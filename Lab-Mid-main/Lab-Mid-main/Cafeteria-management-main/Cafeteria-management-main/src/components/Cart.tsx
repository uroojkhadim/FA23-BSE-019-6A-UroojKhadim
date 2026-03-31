import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Image } from '@/components/ui/image';
import { PAYMENT_METHODS, paymentMethodRequiresReference } from '@/lib/payments';
import { useAuthStore } from '@/store/authStore';
import { BaseCrudService } from '@/integrations';
import type { Discounts } from '@/entities';
import { calculateDiscountAmount, getDiscountLabel, isDiscountCurrentlyActive } from '@/lib/discounts';

export default function Cart() {
  const { items, totalPrice, isOpen, itemCount, isCheckingOut, error, actions } = useCart();
  const { currency } = useCurrency();
  const { user } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]['value']>('cash');
  const [transferReference, setTransferReference] = useState('');
  const [notes, setNotes] = useState('');
  const [discounts, setDiscounts] = useState<Discounts[]>([]);
  const [selectedDiscountId, setSelectedDiscountId] = useState('');

  const selectedMethod = PAYMENT_METHODS.find((method) => method.value === paymentMethod);
  const selectedDiscount = discounts.find((discount) => discount._id === selectedDiscountId) || null;
  const discountAmount = calculateDiscountAmount(selectedDiscount, totalPrice);
  const appliedDiscount = selectedDiscount && discountAmount > 0 ? selectedDiscount : null;
  const grandTotal = Math.max(0, totalPrice - discountAmount);

  useEffect(() => {
    if (!isOpen) return;

    const loadDiscounts = async () => {
      try {
        const result = await BaseCrudService.getAll<Discounts>('discounts');
        setDiscounts(result.items.filter((discount) => isDiscountCurrentlyActive(discount)));
      } catch (loadError) {
        console.error('Failed to load discounts:', loadError);
      }
    };

    loadDiscounts();
  }, [isOpen]);

  useEffect(() => {
    if (items.length === 0) {
      setSelectedDiscountId('');
      setTransferReference('');
      setNotes('');
    }
  }, [items.length]);

  return (
    <>
      {/* Cart Toggle Button */}
      <button
        onClick={actions.toggleCart}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-primary text-primary-foreground w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg z-50 hover:opacity-90 transition-opacity"
        aria-label="Toggle cart"
      >
        <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center font-paragraph text-xs font-semibold">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={actions.closeCart}
              className="fixed inset-0 bg-foreground bg-opacity-50 z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col overflow-y-scroll cart-scrollbar"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-secondary">
                <h2 className="font-heading text-2xl text-foreground uppercase">
                  Your Cart
                </h2>
                <button
                  onClick={actions.closeCart}
                  className="text-foreground hover:text-accent transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-secondary mx-auto mb-4" strokeWidth={1.5} />
                    <p className="font-paragraph text-base text-foreground">
                      Your cart is empty
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="border border-secondary p-4">
                        <div className="flex gap-4">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover flex-shrink-0"
                              width={80}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-heading text-base text-foreground uppercase mb-2">
                              {item.name}
                            </h3>
                            <p className="font-paragraph text-sm text-foreground mb-3">
                              {formatPrice(item.price, currency ?? DEFAULT_CURRENCY)}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => actions.updateQuantity(item, Math.max(1, item.quantity - 1))}
                                  className="w-8 h-8 border border-secondary flex items-center justify-center hover:border-foreground transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                                <span className="font-paragraph text-sm text-foreground w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => actions.updateQuantity(item, item.quantity + 1)}
                                  className="w-8 h-8 border border-secondary flex items-center justify-center hover:border-foreground transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                              </div>
                              <button
                                onClick={() => actions.removeFromCart(item)}
                                className="font-paragraph text-xs text-destructive hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-secondary p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="font-paragraph text-xs uppercase tracking-wide text-secondary-foreground block">
                      Redeem Offer
                    </label>
                    <select
                      value={selectedDiscountId}
                      onChange={(event) => setSelectedDiscountId(event.target.value)}
                      className="w-full border border-secondary px-3 py-2 font-paragraph text-sm text-foreground bg-background"
                    >
                      <option value="">No offer selected</option>
                      {discounts.map((discount) => (
                        <option key={discount._id} value={discount._id}>
                          {getDiscountLabel(discount)}
                        </option>
                      ))}
                    </select>
                    {selectedDiscount?.minimumOrderAmount ? (
                      <p className="font-paragraph text-xs text-secondary-foreground">
                        Minimum order: {formatPrice(selectedDiscount.minimumOrderAmount, currency ?? DEFAULT_CURRENCY)}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <label className="font-paragraph text-xs uppercase tracking-wide text-secondary-foreground block">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value as (typeof PAYMENT_METHODS)[number]['value'])}
                      className="w-full border border-secondary px-3 py-2 font-paragraph text-sm text-foreground bg-background"
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                    {selectedMethod && (
                      <p className="font-paragraph text-xs text-secondary-foreground">
                        {selectedMethod.helperText}
                      </p>
                    )}
                  </div>
                  {paymentMethodRequiresReference(paymentMethod) && (
                    <div className="space-y-2">
                      <label className="font-paragraph text-xs uppercase tracking-wide text-secondary-foreground block">
                        Transaction Reference
                      </label>
                      <input
                        type="text"
                        value={transferReference}
                        onChange={(event) => setTransferReference(event.target.value)}
                        placeholder="Enter JazzCash, EasyPaisa, or transfer reference"
                        className="w-full border border-secondary px-3 py-2 font-paragraph text-sm text-foreground bg-background"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="font-paragraph text-xs uppercase tracking-wide text-secondary-foreground block">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={2}
                      placeholder="Pickup or payment notes"
                      className="w-full border border-secondary px-3 py-2 font-paragraph text-sm text-foreground bg-background"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-xl text-foreground uppercase">
                      Subtotal
                    </span>
                    <span className="font-heading text-xl text-foreground">
                      {formatPrice(totalPrice, currency ?? DEFAULT_CURRENCY)}
                    </span>
                  </div>
                  {selectedDiscount && discountAmount > 0 && (
                    <div className="flex justify-between items-center text-accent">
                      <span className="font-paragraph text-sm uppercase tracking-wide">
                        Offer Applied
                      </span>
                      <span className="font-paragraph text-sm">
                        -{formatPrice(discountAmount, currency ?? DEFAULT_CURRENCY)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-xl text-foreground uppercase">
                      Total
                    </span>
                    <span className="font-heading text-xl text-foreground">
                      {formatPrice(grandTotal, currency ?? DEFAULT_CURRENCY)}
                    </span>
                  </div>
                  {error && (
                    <p className="font-paragraph text-xs text-destructive">
                      {error}
                    </p>
                  )}
                  <button
                    onClick={() => actions.checkout({
                      paymentMethod,
                      transferReference,
                      notes,
                      discount: appliedDiscount,
                    })}
                    disabled={isCheckingOut || !user}
                    className="w-full bg-primary text-primary-foreground font-paragraph font-semibold px-6 py-3 rounded transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isCheckingOut ? 'Processing...' : user ? 'Place Order' : 'Sign In to Order'}
                  </button>
                  {!user && (
                    <p className="font-paragraph text-xs text-secondary-foreground">
                      Sign in as a student to submit an order with your selected payment method.
                    </p>
                  )}
                  <button
                    onClick={actions.clearCart}
                    className="w-full bg-transparent text-foreground font-paragraph font-semibold px-6 py-3 rounded border border-secondary transition-colors hover:border-foreground"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
