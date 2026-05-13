export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', helperText: 'Collect at pickup or counter.' },
  { value: 'debit-credit-card', label: 'Debit or Credit Card', helperText: 'Accept a debit or credit card payment.' },
  { value: 'jazzcash', label: 'JazzCash', helperText: 'Upload JazzCash transaction screenshot.' },
  { value: 'easypaisa', label: 'EasyPaisa', helperText: 'Upload EasyPaisa transaction screenshot.' },
  { value: 'bank_transfer', label: 'Online Transfer', helperText: 'Upload bank app or online transfer PDF/screenshot.' },
  { value: 'udhar', label: 'Pay Later (Udhar)', helperText: 'Add to your outstanding balance.' },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]['value'];

export const formatPaymentMethod = (paymentMethod?: string) => {
  if (paymentMethod === 'card') return 'Debit or Credit Card';
  if (paymentMethod === 'online-transfer' || paymentMethod === 'bank-transfer') return 'Online Transfer';
  if (paymentMethod === 'student-id') return 'Student ID Balance (Legacy)';
  const match = PAYMENT_METHODS.find((method) => method.value === paymentMethod);
  return match?.label ?? paymentMethod ?? 'Not specified';
};

export const isOnlineTransfer = (paymentMethod?: string) =>
  paymentMethod === 'bank_transfer' || paymentMethod === 'bank-transfer' || paymentMethod === 'online-transfer';

export const paymentMethodRequiresReference = (paymentMethod?: string) =>
  paymentMethod === 'jazzcash' ||
  paymentMethod === 'easypaisa' ||
  paymentMethod === 'bank_transfer' ||
  paymentMethod === 'bank-transfer' ||
  paymentMethod === 'online-transfer';

export const isPaymentCompletedByDefault = (paymentMethod: PaymentMethod, source: 'web' | 'pos') => {
  if (source === 'pos') {
    return paymentMethod !== 'bank-transfer';
  }

  return false;
};

export const getPaymentStatusLabel = (paymentStatus?: string) => {
  switch (paymentStatus) {
    case 'completed':
      return 'Paid';
    case 'pending-verification':
      return 'Pending Verification';
    case 'pending':
      return 'Pending';
    default:
      return paymentStatus ?? 'Pending';
  }
};
