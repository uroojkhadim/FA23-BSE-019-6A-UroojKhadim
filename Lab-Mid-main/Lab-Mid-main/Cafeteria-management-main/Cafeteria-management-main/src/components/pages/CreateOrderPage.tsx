import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, User, Phone, Mail, Package, Calculator, Save } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { MenuItems } from '@/entities';
import { createOrderWorkflow, buildOrderNotes } from '@/lib/orderWorkflow';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    selectedItemId: '',
    quantity: 1,
    paymentMethod: 'cash' as any,
    notes: ''
  });

  const [selectedItem, setSelectedItem] = useState<MenuItems | null>(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const result = await BaseCrudService.getAll<MenuItems>('menuitems');
        setMenuItems(result.items.filter(i => i.isAvailable));
      } catch (error) {
        console.error('Failed to load menu:', error);
        toast.error('Failed to load menu items');
      } finally {
        setIsLoading(false);
      }
    };
    loadMenu();
  }, []);

  const handleItemChange = (id: string) => {
    const item = menuItems.find(i => i._id === id) || null;
    setSelectedItem(item);
    setFormData({ ...formData, selectedItemId: id });
  };

  const calculateTotal = () => {
    if (!selectedItem) return 0;
    return (selectedItem.itemPrice || 0) * formData.quantity;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedItemId || !formData.customerName) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const customerInfo = `Customer: ${formData.customerName} | Contact: ${formData.customerPhone} | Email: ${formData.customerEmail}`;
      const finalNotes = formData.notes ? `${customerInfo} | Note: ${formData.notes}` : customerInfo;

      await createOrderWorkflow({
        userId: user?.uid,
        lineItems: [
          {
            menuItemId: formData.selectedItemId,
            quantity: formData.quantity,
            unitPrice: selectedItem?.itemPrice || 0
          }
        ],
        paymentMethod: formData.paymentMethod,
        notes: finalNotes,
        source: 'pos'
      });

      toast.success('Order created successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]">Loading Menu...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Manual Order Creator</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Customer Information */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Customer Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="+92 XXX XXXXXXX"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="customer@example.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Item Selection */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Order Selection</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Menu Item *</label>
                <select 
                  required
                  value={formData.selectedItemId}
                  onChange={(e) => handleItemChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all appearance-none"
                >
                  <option value="">Choose an item...</option>
                  {menuItems.map(item => (
                    <option key={item._id} value={item._id}>
                      {item.itemName} - Rs. {item.itemPrice}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quantity *</label>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                      className="px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      readOnly
                      value={formData.quantity}
                      className="flex-1 text-center bg-white text-sm font-bold outline-none"
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                      className="px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Payment Method</label>
                  <select 
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                  >
                    <option value="cash">Cash on Delivery</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="wallet">In-App Wallet</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Additional Notes</label>
                <textarea 
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special instructions?"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 rounded-3xl p-8 text-white sticky top-24 shadow-xl shadow-slate-900/20">
            <div className="flex items-center gap-3 mb-8">
              <Calculator className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Order Summary</h2>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selected Item</p>
                  <p className="text-lg font-bold mt-1">{selectedItem?.itemName || 'None Selected'}</p>
                </div>
                <p className="font-bold text-primary">Rs. {selectedItem?.itemPrice || 0}</p>
              </div>

              <div className="flex justify-between items-center py-4 border-y border-white/10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quantity</span>
                <span className="font-bold">x {formData.quantity}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtotal</span>
                <span className="font-bold">Rs. {calculateTotal()}</span>
              </div>
            </div>

            <div className="pt-8 border-t border-white/20">
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold uppercase tracking-widest">Grand Total</span>
                <span className="text-3xl font-black text-primary">Rs. {calculateTotal()}</span>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !selectedItem}
                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateOrderPage;
