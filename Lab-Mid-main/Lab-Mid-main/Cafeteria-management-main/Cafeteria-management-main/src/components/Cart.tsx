import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { X, Plus, Minus, ShoppingCart, Upload, FileText, ImageIcon, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Image } from '@/components/ui/image';
import { PAYMENT_METHODS, paymentMethodRequiresReference } from '@/lib/payments';
import { useAuth } from '@/contexts/AuthContext';
import { BaseCrudService } from '@/integrations';
import type { Discounts } from '@/entities';
import { calculateDiscountAmount, getDiscountLabel, isDiscountCurrentlyActive } from '@/lib/discounts';
import { toast } from 'sonner';

export default function Cart() {
  const { items, totalPrice, isOpen, itemCount, isCheckingOut, error, actions } = useCart();
  const { currency } = useCurrency();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]['value']>('cash');
  const [transferReference, setTransferReference] = useState('');
  const [notes, setNotes] = useState('');
  const [discounts, setDiscounts] = useState<Discounts[]>([]);
  const [selectedDiscountId, setSelectedDiscountId] = useState('');
  
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setReceiptFile(null);
      setReceiptFilePreview(null);
    }
  }, [items.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setReceiptFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setReceiptFilePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setReceiptFilePreview(null);
      }
    }
  };

  const handleCheckout = async () => {
    // In a real app, we would upload the file to Firebase Storage here
    // For this demo, we'll just pass the metadata
    actions.checkout({
      paymentMethod,
      transferReference,
      notes: `${notes}${receiptFile ? ` [Receipt Attached: ${receiptFile.name}]` : ''}`,
      discount: appliedDiscount,
    });
  };

  const filteredPaymentMethods = PAYMENT_METHODS.filter(method => {
    if (method.value === 'udhar') {
      // Students and Teachers can use Udhar (Credit)
      return user?.role === 'student' || user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'staff';
    }
    return true;
  });


  return (
    <>
      {/* Cart Toggle Button */}
      <button
        onClick={actions.toggleCart}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl z-50 hover:shadow-sky-500/50 hover:scale-110 transition-all duration-300 group"
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
                    <h2 className="font-heading text-2xl text-[#0ea5e9] font-bold uppercase">
                      COMSATS Cart
                    </h2>
                    <p className="font-paragraph text-xs text-slate-500 mt-1">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'} in your tray
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
              <div className="p-6 flex-1">
                {items.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-sky-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 group-hover:rotate-0 transition-transform">
                      <ShoppingCart className="w-12 h-12 text-[#0ea5e9]" strokeWidth={1.5} />
                    </div>
                    <p className="font-heading text-lg text-slate-900 uppercase mb-2 font-bold">
                      Your tray is empty
                    </p>
                    <p className="font-paragraph text-sm text-slate-500">
                      Add delicious meals from the menu
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
                        className="group bg-white border border-slate-200 p-4 rounded-3xl shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-300"
                      >
                        <div className="flex gap-4">
                          {item.image && (
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border border-slate-100">
                              <Image
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                width={80}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-heading text-sm font-bold text-slate-900 uppercase mb-1 line-clamp-1">
                              {item.name}
                            </h3>
                            <p className="font-paragraph text-sm text-[#0ea5e9] mb-3 font-bold">
                              {formatPrice(item.price, currency ?? DEFAULT_CURRENCY)}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1">
                                <button
                                  onClick={() => actions.updateQuantity(item, Math.max(1, item.quantity - 1))}
                                  className="w-8 h-8 bg-white border border-slate-200 flex items-center justify-center hover:border-sky-500 hover:text-sky-600 rounded-lg transition-all"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                                <span className="font-paragraph text-sm text-slate-900 font-bold w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => actions.updateQuantity(item, item.quantity + 1)}
                                  className="w-8 h-8 bg-white border border-slate-200 flex items-center justify-center hover:border-sky-500 hover:text-sky-600 rounded-lg transition-all"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                              </div>
                              <button
                                onClick={() => actions.removeFromCart(item)}
                                className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
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
                <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                        Offer
                      </label>
                      <select
                        value={selectedDiscountId}
                        onChange={(event) => setSelectedDiscountId(event.target.value)}
                        className="w-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-white rounded-xl focus:border-sky-500 focus:outline-none transition-colors"
                      >
                        <option value="">None</option>
                        {discounts.map((discount) => (
                          <option key={discount._id} value={discount._id}>
                            {getDiscountLabel(discount)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                        Payment
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(event) => setPaymentMethod(event.target.value as (typeof PAYMENT_METHODS)[number]['value'])}
                        className="w-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-white rounded-xl focus:border-sky-500 focus:outline-none transition-colors"
                      >
                        {filteredPaymentMethods.map((method) => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Payment Receipt Upload */}
                  {(paymentMethod === 'bank_transfer' || paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                    <div className="space-y-2 p-4 bg-sky-50 rounded-2xl border border-sky-100">
                      <label className="text-[10px] uppercase font-bold text-[#0ea5e9] tracking-widest block">
                        Upload Receipt (PDF/Screenshot)
                      </label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-sky-200 rounded-xl p-4 flex flex-col items-center justify-center bg-white hover:bg-sky-50 transition-all"
                      >
                        {receiptFile ? (
                          <div className="flex items-center gap-3 w-full">
                            {receiptPreview ? (
                              <img src={receiptPreview} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <FileText className="w-10 h-10 text-sky-600" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{receiptFile.name}</p>
                              <p className="text-[10px] text-slate-500">{(receiptFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-sky-500" />
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-sky-600 mb-2" />
                            <p className="text-[10px] font-bold text-sky-700 uppercase">Click to browse</p>
                          </>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          accept="image/*,application/pdf" 
                          className="hidden" 
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethodRequiresReference(paymentMethod) && (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                        Transaction ID / Reference
                      </label>
                      <input
                        type="text"
                        value={transferReference}
                        onChange={(event) => setTransferReference(event.target.value)}
                        placeholder="Ref #"
                        className="w-full border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 bg-white rounded-xl focus:border-sky-500 focus:outline-none transition-colors"
                      />
                    </div>
                  )}
                  
                  {/* Summary */}
                  <div className="bg-slate-900 rounded-3xl p-5 text-white space-y-3 shadow-xl">
                    <div className="flex justify-between items-center text-xs opacity-70 font-bold uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span>{formatPrice(totalPrice, currency ?? DEFAULT_CURRENCY)}</span>
                    </div>
                    {selectedDiscount && discountAmount > 0 && (
                      <div className="flex justify-between items-center text-sky-400 text-xs font-bold uppercase tracking-widest">
                        <span>Discount</span>
                        <span>-{formatPrice(discountAmount, currency ?? DEFAULT_CURRENCY)}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                      <span className="text-sm font-bold uppercase tracking-widest">Grand Total</span>
                      <span className="text-2xl font-bold text-sky-400">
                        {formatPrice(grandTotal, currency ?? DEFAULT_CURRENCY)}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut || !user || ((paymentMethod === 'bank_transfer' || paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && !receiptFile)}
                      className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-slate-900 font-bold py-4 rounded-2xl transition-all shadow-lg uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-2"
                    >
                      {isCheckingOut ? (
                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>Place Order <ChevronRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>

                  {!user && (
                    <p className="text-[10px] text-amber-600 font-bold text-center uppercase tracking-widest">
                      Please login to place your order
                    </p>
                  )}
                  {user && (paymentMethod === 'bank_transfer' || paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && !receiptFile && (
                    <p className="text-[10px] text-red-500 font-bold text-center uppercase tracking-widest">
                      Please upload payment receipt
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
