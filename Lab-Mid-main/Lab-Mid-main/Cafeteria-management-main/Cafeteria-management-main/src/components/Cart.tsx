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
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl z-50 hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 group"
        aria-label="Toggle cart"
      >
        <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-paragraph text-xs font-bold shadow-lg border-2 border-white">
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
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-gradient-to-br from-slate-50 via-white to-slate-100 z-50 flex flex-col overflow-y-scroll cart-scrollbar shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 p-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-2xl text-slate-900 uppercase">
                      Your Cart
                    </h2>
                    <p className="font-paragraph text-xs text-slate-500 mt-1">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <button
                    onClick={actions.closeCart}
                    className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
                    aria-label="Close cart"
                  >
                    <X className="w-5 h-5 text-slate-700" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="p-6">
                {items.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingCart className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
                    </div>
                    <p className="font-heading text-lg text-slate-900 uppercase mb-2">
                      Your cart is empty
                    </p>
                    <p className="font-paragraph text-sm text-slate-500">
                      Add items from the menu to get started
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300"
                      >
                        <div className="flex gap-4">
                          {item.image && (
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-slate-200">
                              <Image
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                width={80}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-heading text-base text-slate-900 uppercase mb-1 line-clamp-1">
                              {item.name}
                            </h3>
                            <p className="font-paragraph text-sm text-slate-600 mb-3 font-semibold">
                              {formatPrice(item.price, currency ?? DEFAULT_CURRENCY)}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
                                <button
                                  onClick={() => actions.updateQuantity(item, Math.max(1, item.quantity - 1))}
                                  className="w-8 h-8 bg-white border border-slate-200 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 rounded-md transition-all"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                                <span className="font-paragraph text-sm text-slate-900 font-bold w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => actions.updateQuantity(item, item.quantity + 1)}
                                  className="w-8 h-8 bg-white border border-slate-200 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 rounded-md transition-all"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                              </div>
                              <button
                                onClick={() => actions.removeFromCart(item)}
                                className="font-paragraph text-xs text-red-600 hover:text-red-700 hover:underline font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-6 space-y-4 pb-8">
                  <div className="space-y-2">
                    <label className="font-paragraph text-xs uppercase tracking-wide text-slate-500 block font-semibold">
                      Redeem Offer
                    </label>
                    <select
                      value={selectedDiscountId}
                      onChange={(event) => setSelectedDiscountId(event.target.value)}
                      className="w-full border-2 border-slate-200 px-4 py-3 font-paragraph text-sm text-slate-700 bg-white rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="">No offer selected</option>
                      {discounts.map((discount) => (
                        <option key={discount._id} value={discount._id}>
                          {getDiscountLabel(discount)}
                        </option>
                      ))}
                    </select>
                    {selectedDiscount?.minimumOrderAmount ? (
                      <p className="font-paragraph text-xs text-slate-500">
                        Minimum order: {formatPrice(selectedDiscount.minimumOrderAmount, currency ?? DEFAULT_CURRENCY)}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <label className="font-paragraph text-xs uppercase tracking-wide text-slate-500 block font-semibold">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value as (typeof PAYMENT_METHODS)[number]['value'])}
                      className="w-full border-2 border-slate-200 px-4 py-3 font-paragraph text-sm text-slate-700 bg-white rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                    {selectedMethod && (
                      <p className="font-paragraph text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                        {selectedMethod.helperText}
                      </p>
                    )}
                  </div>
                  {paymentMethodRequiresReference(paymentMethod) && (
                    <div className="space-y-2">
                      <label className="font-paragraph text-xs uppercase tracking-wide text-slate-500 block font-semibold">
                        Transaction Reference
                      </label>
                      <input
                        type="text"
                        value={transferReference}
                        onChange={(event) => setTransferReference(event.target.value)}
                        placeholder="Enter JazzCash, EasyPaisa, or transfer reference"
                        className="w-full border-2 border-slate-200 px-4 py-3 font-paragraph text-sm text-slate-700 bg-white rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="font-paragraph text-xs uppercase tracking-wide text-slate-500 block font-semibold">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={2}
                      placeholder="Pickup or payment notes"
                      className="w-full border-2 border-slate-200 px-4 py-3 font-paragraph text-sm text-slate-700 bg-white rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  
                  {/* Price Summary */}
                  <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-paragraph text-sm text-slate-600 uppercase tracking-wide">
                        Subtotal
                      </span>
                      <span className="font-heading text-lg text-slate-900 font-bold">
                        {formatPrice(totalPrice, currency ?? DEFAULT_CURRENCY)}
                      </span>
                    </div>
                    {selectedDiscount && discountAmount > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span className="font-paragraph text-sm uppercase tracking-wide font-semibold">
                          Offer Applied
                        </span>
                        <span className="font-paragraph text-sm font-bold">
                          -{formatPrice(discountAmount, currency ?? DEFAULT_CURRENCY)}
                        </span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                      <span className="font-heading text-lg text-slate-900 uppercase tracking-wide font-bold">
                        Total
                      </span>
                      <span className="font-heading text-2xl text-blue-600 font-bold">
                        {formatPrice(grandTotal, currency ?? DEFAULT_CURRENCY)}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="font-paragraph text-xs text-red-700 font-medium">
                        {error}
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => actions.checkout({
                      paymentMethod,
                      transferReference,
                      notes,
                      discount: appliedDiscount,
                    })}
                    disabled={isCheckingOut || !user}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-paragraph font-bold px-6 py-4 rounded-xl transition-all hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform active:scale-[0.98]"
                  >
                    {isCheckingOut ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : user ? 'Place Order' : 'Sign In to Order'}
                  </button>
                  {!user && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="font-paragraph text-xs text-amber-800 font-medium">
                        Sign in as a student to submit an order with your selected payment method.
                      </p>
                    </div>
                  )}
                  <button
                    onClick={actions.clearCart}
                    className="w-full bg-white text-slate-700 font-paragraph font-bold px-6 py-4 rounded-xl border-2 border-slate-200 transition-all hover:border-slate-400 hover:bg-slate-50"
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
