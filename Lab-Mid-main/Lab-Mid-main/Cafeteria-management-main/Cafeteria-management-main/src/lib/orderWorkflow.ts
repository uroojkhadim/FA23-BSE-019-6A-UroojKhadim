import { BaseCrudService } from '@/integrations';
import type { Discounts, OrderItems, Orders, Payments } from '@/entities';
import { calculateDiscountAmount } from '@/lib/discounts';
import { isPaymentCompletedByDefault, paymentMethodRequiresReference, type PaymentMethod } from '@/lib/payments';

export interface OrderLineItemInput {
  menuItemId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderInput {
  userId?: string;
  lineItems: OrderLineItemInput[];
  paymentMethod: PaymentMethod;
  notes?: string;
  transferReference?: string;
  discount?: Discounts | null;
  source: 'web' | 'pos';
}

export interface ParsedOrderNotes {
  customerNote?: string;
  discountCode?: string;
  discountAmount?: number;
  paymentReference?: string;
}

export const buildOrderNotes = (input: {
  notes?: string;
  transferReference?: string;
  discountCode?: string;
  discountAmount?: number;
}) => {
  const segments = [
    input.notes?.trim() ? `Customer note: ${input.notes.trim()}` : null,
    input.discountCode ? `Offer: ${input.discountCode}` : null,
    input.discountAmount ? `Discount amount: ${input.discountAmount.toFixed(2)}` : null,
    input.transferReference?.trim() ? `Payment ref: ${input.transferReference.trim()}` : null,
  ].filter(Boolean);

  return segments.join(' | ');
};

export const parseOrderNotes = (notes?: string): ParsedOrderNotes => {
  if (!notes) return {};

  const getMatch = (label: string) => notes.match(new RegExp(`${label}:\\s*([^|]+)`, 'i'))?.[1]?.trim();
  const discountAmountRaw = getMatch('Discount amount');

  return {
    customerNote: getMatch('Customer note'),
    discountCode: getMatch('Offer'),
    discountAmount: discountAmountRaw ? parseFloat(discountAmountRaw) : undefined,
    paymentReference: getMatch('Payment ref'),
  };
};

export const createOrderWorkflow = async (input: CreateOrderInput) => {
  if (input.lineItems.length === 0) {
    throw new Error('At least one item is required.');
  }

  if (paymentMethodRequiresReference(input.paymentMethod) && !input.transferReference?.trim()) {
    throw new Error('This payment method requires a transaction reference.');
  }

  const subtotal = input.lineItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = calculateDiscountAmount(input.discount, subtotal);
  const totalPrice = Math.max(0, subtotal - discountAmount);
  const orderId = crypto.randomUUID();
  const orderNumber = `ORD-${Date.now()}`;
  const paymentCompleted = isPaymentCompletedByDefault(input.paymentMethod, input.source);
  const paymentStatus = paymentCompleted ? 'completed' : paymentMethodRequiresReference(input.paymentMethod) ? 'pending-verification' : 'pending';

  const orderNotes = buildOrderNotes({
    notes: input.notes,
    transferReference: input.transferReference,
    discountCode: discountAmount > 0 ? input.discount?.discountCode : undefined,
    discountAmount: discountAmount > 0 ? discountAmount : undefined,
  });

  const orderPayload: Orders = {
    _id: orderId,
    orderNumber,
    userId: input.userId,
    status: 'ordered',
    totalPrice,
    orderTime: new Date().toISOString(),
    isPaid: paymentCompleted,
    paymentMethod: input.paymentMethod,
    notes: orderNotes || undefined,
  };

  await BaseCrudService.create('orders', orderPayload);

  for (const lineItem of input.lineItems) {
    const orderItem: OrderItems = {
      _id: crypto.randomUUID(),
      orderId,
      menuItemId: lineItem.menuItemId,
      quantity: lineItem.quantity,
      unitPrice: lineItem.unitPrice,
      lineItemTotal: lineItem.unitPrice * lineItem.quantity,
    };

    await BaseCrudService.create('orderitems', orderItem);
  }

  const paymentPayload: Payments = {
    _id: crypto.randomUUID(),
    transactionId: input.transferReference?.trim() || `PAY-${Date.now()}`,
    orderReference: orderId,
    paymentMethod: input.paymentMethod,
    amountPaid: totalPrice,
    paymentStatus,
    paymentDateTime: new Date().toISOString(),
  };

  await BaseCrudService.create('payments', paymentPayload);

  return {
    orderId,
    orderNumber,
    subtotal,
    discountAmount,
    totalPrice,
    paymentStatus,
  };
};
