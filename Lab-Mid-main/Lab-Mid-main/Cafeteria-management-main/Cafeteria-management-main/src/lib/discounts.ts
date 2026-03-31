import type { Discounts } from '@/entities';

export const isDiscountCurrentlyActive = (discount: Discounts, now = new Date()) => {
  if (!discount.isActive) return false;

  const validFrom = discount.validFrom ? new Date(discount.validFrom) : null;
  const validUntil = discount.validUntil ? new Date(discount.validUntil) : null;

  if (validFrom && validFrom > now) return false;
  if (validUntil && validUntil < now) return false;

  return true;
};

export const calculateDiscountAmount = (discount: Discounts | null | undefined, subtotal: number) => {
  if (!discount || subtotal <= 0) return 0;

  if (discount.minimumOrderAmount && subtotal < discount.minimumOrderAmount) {
    return 0;
  }

  if (discount.discountType === 'percentage') {
    return subtotal * ((discount.discountValue || 0) / 100);
  }

  return Math.min(discount.discountValue || 0, subtotal);
};

export const getDiscountLabel = (discount: Discounts) => {
  if (discount.discountType === 'percentage') {
    return `${discount.discountCode} - ${discount.discountValue || 0}% off`;
  }

  return `${discount.discountCode} - ${discount.discountValue || 0} off`;
};
