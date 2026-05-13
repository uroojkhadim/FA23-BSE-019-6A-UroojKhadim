import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, Package } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { RealtimeService } from '@/lib/RealtimeService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AddMenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    itemName: '',
    itemPrice: 0,
    itemDescription: '',
    category: '',
    dietaryRestrictions: '',
    isAvailable: true,
    itemImage: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName || !formData.itemPrice) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const newItem = await BaseCrudService.create('menuitems', {
        ...formData,
        itemImage: formData.itemImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
      });

      if (user) {
        // Run logging in the background to improve UI responsiveness
        RealtimeService.logActivity(
          user.uid,
          user.fullName || 'Admin',
          'MENU_ITEM_CREATE',
          `Created menu item: ${formData.itemName}`
        ).catch(err => console.error('Background logging failed:', err));
      }

      toast.success('Menu item added successfully!');
      navigate('/menu');
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error('Failed to add menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Add New Menu Item</h1>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Menu Creator</p>
              <h2 className="text-lg font-bold text-slate-900">Item Details</h2>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Item Name *</label>
              <input 
                type="text" 
                required 
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                placeholder="e.g. Special Chicken Biryani"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Price (PKR) *</label>
              <input 
                type="number" 
                required 
                value={formData.itemPrice || ''}
                onChange={(e) => setFormData({ ...formData, itemPrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Category *</label>
              <select 
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
              >
                <option value="">Select Category</option>
                <option value="Biryani & Rice">Biryani & Rice</option>
                <option value="Burgers & Sandwiches">Burgers & Sandwiches</option>
                <option value="Pizza & Sides">Pizza & Sides</option>
                <option value="Beverages">Beverages</option>
                <option value="Snacks">Snacks</option>
                <option value="Deserts">Deserts</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Image URL (Optional)</label>
              <input 
                type="text" 
                value={formData.itemImage}
                onChange={(e) => setFormData({ ...formData, itemImage: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
            <textarea 
              rows={3} 
              value={formData.itemDescription}
              onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all resize-none"
              placeholder="Tell customers about this dish..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isAvailable" className="text-sm font-bold text-slate-700 cursor-pointer">
              Available for immediate order
            </label>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>Saving to Firestore...</>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Menu Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuPage;
