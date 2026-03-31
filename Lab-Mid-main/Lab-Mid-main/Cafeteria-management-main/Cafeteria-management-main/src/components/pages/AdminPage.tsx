import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { MenuItems, Orders, Discounts, Payments, Teachers, Administrators } from '@/entities';
import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { Plus, Edit, Trash2, BarChart3, Package, Tag, AlertCircle, Users, Boxes, Mail, Phone, MessageCircle } from 'lucide-react';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { formatPaymentMethod } from '@/lib/payments';
import { parseOrderNotes } from '@/lib/orderWorkflow';
import { getOrderStatusLabel, normalizeOrderStatus } from '@/lib/orderStatus';

type TabType = 'menu' | 'reports' | 'discounts' | 'stock' | 'staff';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('menu');
  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [discounts, setDiscounts] = useState<Discounts[]>([]);
  const [payments, setPayments] = useState<Payments[]>([]);
  const [teachers, setTeachers] = useState<Teachers[]>([]);
  const [admins, setAdmins] = useState<Administrators[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItems | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { currency } = useCurrency();
  const { user } = useAuthStore();

  // Role-based access control
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 p-6 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h2 className="font-heading text-lg text-amber-900 mb-1">Access Restricted</h2>
                <p className="font-paragraph text-sm text-amber-800">
                  The Admin Dashboard is only available for administrators.
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const [formData, setFormData] = useState({
    itemName: '',
    itemPrice: 0,
    itemDescription: '',
    category: '',
    dietaryRestrictions: '',
    isAvailable: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [menuResult, ordersResult, discountsResult, paymentsResult, teachersResult, adminsResult] = await Promise.all([
        BaseCrudService.getAll<MenuItems>('menuitems'),
        BaseCrudService.getAll<Orders>('orders'),
        BaseCrudService.getAll<Discounts>('discounts'),
        BaseCrudService.getAll<Payments>('payments'),
        BaseCrudService.getAll<Teachers>('teachers'),
        BaseCrudService.getAll<Administrators>('admins')
      ]);
      setMenuItems(menuResult.items);
      setOrders(ordersResult.items);
      setDiscounts(discountsResult.items);
      setPayments(paymentsResult.items);
      setTeachers(teachersResult.items);
      setAdmins(adminsResult.items);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await BaseCrudService.update('menuitems', {
          _id: editingItem._id,
          ...formData
        });
      } else {
        await BaseCrudService.create('menuitems', {
          _id: crypto.randomUUID(),
          ...formData,
          itemImage: 'https://static.wixstatic.com/media/a525c7_bfb040f3965343e7aa123f1f837df956~mv2.png?originWidth=128&originHeight=128'
        });
      }
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Failed to save menu item:', error);
    }
  };

  const handleEdit = (item: MenuItems) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName || '',
      itemPrice: item.itemPrice || 0,
      itemDescription: item.itemDescription || '',
      category: item.category || '',
      dietaryRestrictions: item.dietaryRestrictions || '',
      isAvailable: item.isAvailable ?? true
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await BaseCrudService.delete('menuitems', id);
        await loadData();
      } catch (error) {
        console.error('Failed to delete menu item:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      itemPrice: 0,
      itemDescription: '',
      category: '',
      dietaryRestrictions: '',
      isAvailable: true
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const calculateStats = () => {
    const totalRevenue = orders
      .filter(o => o.isPaid)
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => normalizeOrderStatus(o.status) === 'delivered').length;
    const activeOrders = orders.filter((o) => {
      const status = normalizeOrderStatus(o.status);
      return status === 'ordered' || status === 'accepted' || status === 'in_process';
    }).length;

    return { totalRevenue, totalOrders, deliveredOrders, activeOrders };
  };

  const stats = calculateStats();
  const paymentMethodSummary = payments.reduce<Record<string, { count: number; amount: number }>>((summary, payment) => {
    const key = payment.paymentMethod || 'unknown';
    if (!summary[key]) {
      summary[key] = { count: 0, amount: 0 };
    }

    summary[key].count += 1;
    summary[key].amount += payment.amountPaid || 0;
    return summary;
  }, {});
  const redeemedOfferSummary = orders.reduce<Record<string, number>>((summary, order) => {
    const discountCode = parseOrderNotes(order.notes).discountCode;
    if (!discountCode) return summary;
    summary[discountCode] = (summary[discountCode] || 0) + 1;
    return summary;
  }, {});
  const stockSummary = {
    totalItems: menuItems.length,
    availableItems: menuItems.filter((item) => item.isAvailable).length,
    unavailableItems: menuItems.filter((item) => !item.isAvailable).length,
    categories: Array.from(new Set(menuItems.map((item) => item.category).filter(Boolean))).length,
  };
  const staffDirectory = [
    ...admins.map((admin) => ({
      id: admin._id,
      name: admin.fullName || 'Administrator',
      role: admin.adminRole || 'Admin',
      email: admin.email,
      phone: admin.phoneNumber,
      department: 'Operations',
      channel: 'Office / WhatsApp',
    })),
    ...teachers.map((teacher) => ({
      id: teacher._id,
      name: teacher.fullName || 'Teacher',
      role: 'Teacher',
      email: teacher.email,
      phone: teacher.phoneNumber,
      department: teacher.department || 'Academic',
      channel: 'Email / WhatsApp',
    })),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-24">
        {/* Page Header */}
        <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground uppercase mb-4">
            Admin Dashboard
          </h1>
          <div className="w-16 h-1 bg-foreground"></div>
        </section>

        {/* Tabs */}
        <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex gap-2 sm:gap-4 border-b border-secondary overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('menu')}
              className={`font-paragraph text-xs sm:text-sm uppercase tracking-wide px-3 sm:px-6 py-3 whitespace-nowrap transition-colors ${
                activeTab === 'menu'
                  ? 'text-foreground border-b-2 border-foreground'
                  : 'text-secondary-foreground hover:text-foreground'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
              Menu Management
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`font-paragraph text-xs sm:text-sm uppercase tracking-wide px-3 sm:px-6 py-3 whitespace-nowrap transition-colors ${
                activeTab === 'reports'
                  ? 'text-foreground border-b-2 border-foreground'
                  : 'text-secondary-foreground hover:text-foreground'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
              Reports
            </button>
            <button
              onClick={() => setActiveTab('discounts')}
              className={`font-paragraph text-xs sm:text-sm uppercase tracking-wide px-3 sm:px-6 py-3 whitespace-nowrap transition-colors ${
                activeTab === 'discounts'
                  ? 'text-foreground border-b-2 border-foreground'
                  : 'text-secondary-foreground hover:text-foreground'
              }`}
            >
              <Tag className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
              Discounts
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              className={`font-paragraph text-xs sm:text-sm uppercase tracking-wide px-3 sm:px-6 py-3 whitespace-nowrap transition-colors ${
                activeTab === 'stock'
                  ? 'text-foreground border-b-2 border-foreground'
                  : 'text-secondary-foreground hover:text-foreground'
              }`}
            >
              <Boxes className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
              Stock
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`font-paragraph text-xs sm:text-sm uppercase tracking-wide px-3 sm:px-6 py-3 whitespace-nowrap transition-colors ${
                activeTab === 'staff'
                  ? 'text-foreground border-b-2 border-foreground'
                  : 'text-secondary-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
              Staff
            </button>
          </div>
        </section>

        <div className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Menu Management Tab */}
          {activeTab === 'menu' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-heading text-2xl text-foreground uppercase">
                  Menu Items
                </h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-primary text-primary-foreground font-paragraph font-semibold px-6 py-3 rounded transition-opacity hover:opacity-90 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                  Add Item
                </button>
              </div>

              {/* Add/Edit Form */}
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-secondary p-6 mb-8"
                >
                  <h3 className="font-heading text-xl text-foreground uppercase mb-6">
                    {editingItem ? 'Edit Item' : 'Add New Item'}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-6">
                        <label className="font-paragraph text-sm text-foreground mb-2 block">
                          Item Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.itemName}
                          onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                          className="w-full border border-secondary px-3 py-2 font-paragraph text-sm text-foreground bg-background"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <label className="font-paragraph text-sm text-foreground mb-2 block">
                          Price *
                        </label>
                        <input
                          type="number"
                          required
                          step="0.01"
                          value={formData.itemPrice}
                          onChange={(e) => setFormData({ ...formData, itemPrice: parseFloat(e.target.value) })}
                          className="w-full border border-secondary px-3 py-2 font-paragraph text-sm text-foreground bg-background"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <label className="font-paragraph text-sm text-foreground mb-2 block">
                          Category
                        </label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full border border-secondary px-3 py-2 font-paragraph text-sm text-foreground bg-background"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <label className="font-paragraph text-sm text-foreground mb-2 block">
                          Dietary Restrictions
                        </label>
                        <input
                          type="text"
                          value={formData.dietaryRestrictions}
                          onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                          className="w-full border border-secondary px-3 py-2 font-paragraph text-sm text-foreground bg-background"
                        />
                      </div>
                      <div className="col-span-12">
                        <label className="font-paragraph text-sm text-foreground mb-2 block">
                          Description
                        </label>
                        <textarea
                          value={formData.itemDescription}
                          onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                          className="w-full border border-secondary px-3 py-2 font-paragraph text-sm text-foreground bg-background"
                          rows={3}
                        />
                      </div>
                      <div className="col-span-12">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.isAvailable}
                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="font-paragraph text-sm text-foreground">
                            Available
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="bg-primary text-primary-foreground font-paragraph font-semibold px-6 py-3 rounded transition-opacity hover:opacity-90"
                      >
                        {editingItem ? 'Update' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="bg-transparent text-foreground font-paragraph font-semibold px-6 py-3 rounded border border-secondary transition-colors hover:border-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Menu Items List */}
              <div className="space-y-4 min-h-[400px]">
                {isLoading ? null : menuItems.length > 0 ? (
                  menuItems.map((item, index) => (
                    <motion.div
                      key={item._id}
                      className="border border-secondary p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.03 }}
                    >
                      <div className="grid grid-cols-12 gap-6">
                        {item.itemImage && (
                          <div className="col-span-12 md:col-span-2">
                            <Image
                              src={item.itemImage}
                              alt={item.itemName || 'Menu item'}
                              className="w-full h-24 object-cover"
                              width={150}
                            />
                          </div>
                        )}
                        <div className={`col-span-12 ${item.itemImage ? 'md:col-span-7' : 'md:col-span-9'}`}>
                          <h3 className="font-heading text-xl text-foreground uppercase mb-2">
                            {item.itemName}
                          </h3>
                          <div className="space-y-1">
                            <p className="font-paragraph text-sm text-foreground">
                              Price: {formatPrice(item.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                            </p>
                            {item.category && (
                              <p className="font-paragraph text-sm text-foreground">
                                Category: {item.category}
                              </p>
                            )}
                            {item.dietaryRestrictions && (
                              <p className="font-paragraph text-sm text-foreground">
                                Dietary: {item.dietaryRestrictions}
                              </p>
                            )}
                            <p className="font-paragraph text-sm text-foreground">
                              Status: {item.isAvailable ? 'Available' : 'Unavailable'}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-3 flex flex-col gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-transparent text-foreground font-paragraph text-sm px-4 py-2 rounded border border-secondary transition-colors hover:border-foreground flex items-center justify-center gap-2"
                          >
                            <Edit className="w-4 h-4" strokeWidth={1.5} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-transparent text-destructive font-paragraph text-sm px-4 py-2 rounded border border-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="font-paragraph text-base text-foreground">
                      No menu items found
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div>
              <h2 className="font-heading text-2xl text-foreground uppercase mb-8">
                Sales Reports
              </h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-12 gap-8 mb-12">
                <motion.div
                  className="col-span-12 md:col-span-6 lg:col-span-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="border border-secondary p-6">
                    <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                      Total Revenue
                    </p>
                    <p className="font-heading text-3xl text-foreground">
                      {formatPrice(stats.totalRevenue, currency ?? DEFAULT_CURRENCY)}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="col-span-12 md:col-span-6 lg:col-span-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="border border-secondary p-6">
                    <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                      Total Orders
                    </p>
                    <p className="font-heading text-3xl text-foreground">
                      {stats.totalOrders}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="col-span-12 md:col-span-6 lg:col-span-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="border border-secondary p-6">
                    <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                      Delivered
                    </p>
                    <p className="font-heading text-3xl text-foreground">
                      {stats.deliveredOrders}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="col-span-12 md:col-span-6 lg:col-span-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="border border-secondary p-6">
                    <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                      Active
                    </p>
                    <p className="font-heading text-3xl text-foreground">
                      {stats.activeOrders}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Recent Orders */}
              <h3 className="font-heading text-xl text-foreground uppercase mb-6">
                Recent Orders
              </h3>
              <div className="space-y-4 min-h-[300px]">
                {isLoading ? null : orders.length > 0 ? (
                  orders.slice(0, 10).map((order, index) => {
                    const parsedNotes = parseOrderNotes(order.notes);
                    return (
                      <motion.div
                        key={order._id}
                        className="border border-secondary p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.03 }}
                      >
                        <div className="grid grid-cols-12 gap-6">
                          <div className="col-span-12 md:col-span-8">
                            <h4 className="font-heading text-lg text-foreground uppercase mb-2">
                              Order #{order.orderNumber}
                            </h4>
                            <div className="space-y-1">
                              <p className="font-paragraph text-sm text-foreground">
                                Status: <span className="uppercase">{getOrderStatusLabel(order.status)}</span>
                              </p>
                              <p className="font-paragraph text-sm text-foreground">
                                Payment: {formatPaymentMethod(order.paymentMethod)} - {order.isPaid ? 'Paid' : 'Unpaid'}
                              </p>
                              {parsedNotes.discountCode && (
                                <p className="font-paragraph text-sm text-foreground">
                                  Redeemed Offer: {parsedNotes.discountCode}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-4 text-right">
                            <p className="font-heading text-2xl text-foreground">
                              {formatPrice(order.totalPrice || 0, currency ?? DEFAULT_CURRENCY)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <p className="font-paragraph text-base text-foreground">
                      No orders found
                    </p>
                  </div>
                )}
              </div>

              <h3 className="font-heading text-xl text-foreground uppercase mt-12 mb-6">
                Payment Methods
              </h3>
              <div className="grid grid-cols-12 gap-6">
                {Object.entries(paymentMethodSummary).length > 0 ? Object.entries(paymentMethodSummary).map(([method, summary], index) => (
                  <motion.div
                    key={method}
                    className="col-span-12 md:col-span-6 lg:col-span-3 border border-secondary p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                      {formatPaymentMethod(method)}
                    </p>
                    <p className="font-heading text-2xl text-foreground mb-2">
                      {summary.count}
                    </p>
                    <p className="font-paragraph text-sm text-foreground">
                      {formatPrice(summary.amount, currency ?? DEFAULT_CURRENCY)}
                    </p>
                  </motion.div>
                )) : (
                  <div className="col-span-12 text-center py-12">
                    <p className="font-paragraph text-base text-foreground">
                      No payment records found
                    </p>
                  </div>
                )}
              </div>

              <h3 className="font-heading text-xl text-foreground uppercase mt-12 mb-6">
                Redeemed Offers
              </h3>
              <div className="grid grid-cols-12 gap-6">
                {Object.entries(redeemedOfferSummary).length > 0 ? Object.entries(redeemedOfferSummary).map(([offerCode, claimCount], index) => (
                  <motion.div
                    key={offerCode}
                    className="col-span-12 md:col-span-6 lg:col-span-3 border border-secondary p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                      {offerCode}
                    </p>
                    <p className="font-heading text-2xl text-foreground mb-2">
                      {claimCount}
                    </p>
                    <p className="font-paragraph text-sm text-foreground">
                      Times redeemed
                    </p>
                  </motion.div>
                )) : (
                  <div className="col-span-12 text-center py-12">
                    <p className="font-paragraph text-base text-foreground">
                      No offers have been redeemed yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Discounts Tab */}
          {activeTab === 'discounts' && (
            <div>
              <h2 className="font-heading text-2xl text-foreground uppercase mb-8">
                Discount Codes
              </h2>
              <div className="space-y-4 min-h-[400px]">
                {isLoading ? null : discounts.length > 0 ? (
                  discounts.map((discount, index) => (
                    <motion.div
                      key={discount._id}
                      className="border border-secondary p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.03 }}
                    >
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 md:col-span-8">
                          <h3 className="font-heading text-xl text-foreground uppercase mb-2">
                            {discount.discountCode}
                          </h3>
                          <div className="space-y-1">
                            <p className="font-paragraph text-sm text-foreground">
                              Type: {discount.discountType} - Value: {discount.discountType === 'percentage' 
                                ? `${discount.discountValue}%` 
                                : formatPrice(discount.discountValue || 0, currency ?? DEFAULT_CURRENCY)}
                            </p>
                            {discount.minimumOrderAmount && (
                              <p className="font-paragraph text-sm text-foreground">
                                Minimum Order: {formatPrice(discount.minimumOrderAmount, currency ?? DEFAULT_CURRENCY)}
                              </p>
                            )}
                            <p className="font-paragraph text-sm text-foreground">
                              Status: {discount.isActive ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="font-paragraph text-base text-foreground">
                      No discounts found
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stock' && (
            <div>
              <h2 className="font-heading text-2xl text-foreground uppercase mb-8">
                Stock Overview
              </h2>

              <div className="grid grid-cols-12 gap-8 mb-12">
                <div className="col-span-12 md:col-span-6 lg:col-span-3 border border-secondary p-6">
                  <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                    Total Menu Items
                  </p>
                  <p className="font-heading text-3xl text-foreground">{stockSummary.totalItems}</p>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-3 border border-secondary p-6">
                  <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                    In Service
                  </p>
                  <p className="font-heading text-3xl text-foreground">{stockSummary.availableItems}</p>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-3 border border-secondary p-6">
                  <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                    Out of Service
                  </p>
                  <p className="font-heading text-3xl text-foreground">{stockSummary.unavailableItems}</p>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-3 border border-secondary p-6">
                  <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                    Categories
                  </p>
                  <p className="font-heading text-3xl text-foreground">{stockSummary.categories}</p>
                </div>
              </div>

              <div className="space-y-4">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    className="border border-secondary p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.02 }}
                  >
                    <div className="grid grid-cols-12 gap-6 items-center">
                      <div className="col-span-12 md:col-span-5">
                        <h3 className="font-heading text-lg text-foreground uppercase mb-2">
                          {item.itemName}
                        </h3>
                        <p className="font-paragraph text-sm text-foreground">
                          {item.category || 'General'}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <p className="font-paragraph text-sm text-foreground">
                          {formatPrice(item.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4 text-right">
                        <span className={`inline-block px-3 py-1 text-xs font-paragraph uppercase tracking-wide ${
                          item.isAvailable ? 'bg-foreground text-background' : 'border border-secondary text-foreground'
                        }`}>
                          {item.isAvailable ? 'In Stock' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div>
              <h2 className="font-heading text-2xl text-foreground uppercase mb-8">
                Staff Directory
              </h2>

              <div className="grid grid-cols-12 gap-8 mb-12">
                <div className="col-span-12 md:col-span-4 border border-secondary p-6">
                  <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                    Admin Staff
                  </p>
                  <p className="font-heading text-3xl text-foreground">{admins.length}</p>
                </div>
                <div className="col-span-12 md:col-span-4 border border-secondary p-6">
                  <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                    Teaching Staff
                  </p>
                  <p className="font-heading text-3xl text-foreground">{teachers.length}</p>
                </div>
                <div className="col-span-12 md:col-span-4 border border-secondary p-6">
                  <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                    Support Channels
                  </p>
                  <p className="font-heading text-3xl text-foreground">3</p>
                </div>
              </div>

              <div className="space-y-4 mb-12">
                {staffDirectory.map((staff, index) => (
                  <motion.div
                    key={staff.id}
                    className="border border-secondary p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.02 }}
                  >
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12 md:col-span-4">
                        <h3 className="font-heading text-lg text-foreground uppercase mb-2">
                          {staff.name}
                        </h3>
                        <p className="font-paragraph text-sm text-foreground">
                          {staff.role}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <p className="font-paragraph text-sm text-foreground">
                          Department: {staff.department}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-5 space-y-2">
                        {staff.email && (
                          <p className="font-paragraph text-sm text-foreground flex items-center gap-2">
                            <Mail className="w-4 h-4" strokeWidth={1.5} />
                            {staff.email}
                          </p>
                        )}
                        {staff.phone && (
                          <p className="font-paragraph text-sm text-foreground flex items-center gap-2">
                            <Phone className="w-4 h-4" strokeWidth={1.5} />
                            {staff.phone}
                          </p>
                        )}
                        <p className="font-paragraph text-sm text-secondary-foreground flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                          {staff.channel}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border border-secondary p-6">
                <h3 className="font-heading text-xl text-foreground uppercase mb-4">
                  Contact Channels
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">Email</p>
                    <p className="font-paragraph text-sm text-foreground">cafeteria@comsats.edu.pk</p>
                  </div>
                  <div>
                    <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">Phone</p>
                    <p className="font-paragraph text-sm text-foreground">+92 (51) 1234-5678</p>
                  </div>
                  <div>
                    <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">WhatsApp</p>
                    <p className="font-paragraph text-sm text-foreground">+92 300 0000000</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
