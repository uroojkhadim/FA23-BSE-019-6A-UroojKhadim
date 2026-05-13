import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { MenuItems, Orders, Discounts, Payments, Teachers, Administrators, Students, Inventory } from '@/entities';
import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { RealtimeService } from '@/lib/RealtimeService';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3, 
  Package, 
  Tag, 
  AlertCircle, 
  Users, 
  Boxes, 
  Mail, 
  Phone, 
  MessageCircle,
  TrendingUp,
  Clock,
  CreditCard as CreditIcon,
  ShoppingBag as OrderIcon,
  CheckCircle2,
  LayoutDashboard,
  ChevronRight,
  FileText,
  Upload,
  Download,
  Search,
  MoreVertical,
  UserPlus,
  ShieldCheck,
  UserCircle,
  Settings,
  ShoppingBag,
  ListTodo,
  History as ActivityIcon
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { formatPaymentMethod } from '@/lib/payments';
import { parseOrderNotes } from '@/lib/orderWorkflow';
import { getOrderStatusLabel, normalizeOrderStatus } from '@/lib/orderStatus';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { toast } from 'sonner';


type TabType = 'dashboard' | 'menu' | 'reports' | 'discounts' | 'stock' | 'users' | 'orders' | 'settings' | 'payments' | 'kitchen' | 'activity';

import { useLocation } from 'react-router-dom';

export default function AdminPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = (queryParams.get('tab') as TabType) || 'dashboard';

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [discounts, setDiscounts] = useState<Discounts[]>([]);
  const [payments, setPayments] = useState<Payments[]>([]);
  const [teachers, setTeachers] = useState<Teachers[]>([]);
  const [admins, setAdmins] = useState<Administrators[]>([]);
  const [students, setStudents] = useState<Students[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { currency } = useCurrency();
  const { user: currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  // Role-based access control
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'admin';
  const hasAccess = isSuperAdmin || isAdmin;
  
  if (!hasAccess) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-4 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div>
            <h2 className="font-heading text-lg font-bold text-amber-900 mb-1">Access Restricted</h2>
            <p className="font-paragraph text-sm text-amber-800">
              This dashboard is only available for administrators and super admins.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter tabs based on role
  const availableTabs = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['super_admin', 'admin'] },
    { id: 'kitchen', label: 'Kitchen Queue', icon: <ListTodo className="w-4 h-4" />, roles: ['admin', 'super_admin'] },
    { id: 'menu', label: 'Menu', icon: <Package className="w-4 h-4" />, roles: ['super_admin', 'admin'] },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" />, roles: ['super_admin', 'admin'] },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" />, roles: ['super_admin', 'admin'] },
    { id: 'stock', label: 'Inventory', icon: <Boxes className="w-4 h-4" />, roles: ['super_admin', 'admin'] },
    { id: 'payments', label: 'Payments', icon: <CreditIcon className="w-4 h-4" />, roles: ['super_admin', 'admin'] },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" />, roles: ['super_admin', 'admin'] },
    { id: 'activity', label: 'Audit Logs', icon: <ActivityIcon className="w-4 h-4" />, roles: ['super_admin'] },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, roles: ['super_admin'] },
  ].filter(tab => tab.roles.includes(currentUser?.role || ''));



  const [menuFormData, setMenuFormData] = useState({
    itemName: '',
    itemPrice: 0,
    itemDescription: '',
    category: '',
    dietaryRestrictions: '',
    isAvailable: true,
    itemImage: ''
  });

  const [userFormData, setUserFormData] = useState({
    fullName: '',
    email: '',
    role: 'student',
    phoneNumber: '',
    department: '',
    universityName: 'COMSATS Islamabad'
  });

  const [inventoryFormData, setInventoryFormData] = useState({
    itemName: '',
    category: '',
    quantity: 0,
    unit: 'pcs',
    minStockLevel: 5,
    status: 'In Stock',
    itemImage: ''
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'menu' | 'inventory') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, upload to Firebase Storage
    // For now, we simulate by creating an object URL
    const url = URL.createObjectURL(file);
    if (type === 'menu') {
      setMenuFormData(prev => ({ ...prev, itemImage: url }));
    } else {
      setInventoryFormData(prev => ({ ...prev, itemImage: url }));
    }
    toast.success(`${file.name} uploaded successfully`);
  };

  useEffect(() => {
    // Real-time Order Stream
    const unsubOrders = RealtimeService.subscribeToCollection('orders', (data) => {
      setOrders(data);
      // Play sound for new orders if tab is not active or for all new orders
      const lastOrder = data[0];
      if (lastOrder && new Date(lastOrder.orderTime).getTime() > Date.now() - 5000) {
        // Simple notification sound logic could go here
      }
    });

    // Real-time Inventory Stream
    const unsubInventory = RealtimeService.subscribeToCollection('inventory', setInventory);

    // Real-time Payment Stream
    const unsubPayments = RealtimeService.subscribeToCollection('payments', setPayments);

    // Real-time Menu Stream
    const unsubMenu = RealtimeService.subscribeToCollection('menuitems', setMenuItems);

    // Real-time Activity Logs Stream (Super Admin Only)
    let unsubActivity = () => {};
    if (isSuperAdmin) {
      unsubActivity = RealtimeService.subscribeToCollection('activity_logs', setActivityLogs, {
        orderField: 'timestamp',
        orderDirection: 'desc',
        limitCount: 50
      });
    }

    // Static data that doesn't change often
    const loadStaticData = async () => {
      setIsLoading(true);
      try {
        const [menuResult, discountsResult, teachersResult, adminsResult, studentsResult] = await Promise.all([
          BaseCrudService.getAll<Discounts>('discounts'),
          BaseCrudService.getAll<Teachers>('teachers'),
          BaseCrudService.getAll<Administrators>('admins'),
          BaseCrudService.getAll<Students>('students')
        ]);
        setMenuItems(menuResult.items);
        setDiscounts(discountsResult.items);
        setTeachers(teachersResult.items);
        setAdmins(adminsResult.items);
        setStudents(studentsResult.items);
      } catch (error) {
        console.error('Failed to load static data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaticData();

    return () => {
      unsubOrders();
      unsubInventory();
      unsubPayments();
      unsubMenu();
      unsubActivity();
    };
  }, [isSuperAdmin]);

  const loadData = async () => {
    // This is now handled by real-time listeners for dynamic data
    // Static data is loaded in the initial useEffect
  };


  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await BaseCrudService.update('menuitems', {
          _id: editingItem._id,
          ...menuFormData
        });
        toast.success('Menu item updated');
      } else {
        await BaseCrudService.create('menuitems', {
          _id: crypto.randomUUID(),
          ...menuFormData,
          itemImage: menuFormData.itemImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
        });
        toast.success('Menu item created');
      }

      if (currentUser) {
        RealtimeService.logActivity(
          currentUser.uid,
          currentUser.fullName || 'Admin',
          editingItem ? 'MENU_ITEM_UPDATE' : 'MENU_ITEM_CREATE',
          `${editingItem ? 'Updated' : 'Created'} menu item: ${menuFormData.itemName}`
        );
      }

      resetForm();
      await loadData();
    } catch (error) {
      console.error('Failed to save menu item:', error);
      toast.error('Failed to save menu item');
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const collectionId = userFormData.role === 'admin' || userFormData.role === 'super_admin' 
        ? 'admins' : userFormData.role === 'teacher' ? 'teachers' : 'students';
      
      if (editingItem) {
        await BaseCrudService.update(collectionId, {
          _id: editingItem._id,
          ...userFormData
        });
        toast.success('User updated');
      } else {
        await BaseCrudService.create(collectionId, {
          _id: crypto.randomUUID(),
          ...userFormData,
          _createdDate: new Date()
        });
        toast.success('User added successfully');
      }
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Failed to save user:', error);
      toast.error('Failed to save user');
    }
  };

  const handleInventorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await BaseCrudService.update('inventory', {
          _id: editingItem._id,
          ...inventoryFormData,
          lastUpdatedBy: currentUser?.fullName
        });
        toast.success('Inventory updated');
      } else {
        await BaseCrudService.create('inventory', {
          _id: crypto.randomUUID(),
          ...inventoryFormData,
          lastUpdatedBy: currentUser?.fullName,
          _createdDate: new Date()
        });
        toast.success('Stock added successfully');
      }

      if (currentUser) {
        RealtimeService.logActivity(
          currentUser.uid,
          currentUser.fullName || 'Admin',
          editingItem ? 'STOCK_UPDATE' : 'STOCK_CREATE',
          `${editingItem ? 'Updated' : 'Added'} stock item: ${inventoryFormData.itemName} (${inventoryFormData.quantity} ${inventoryFormData.unit})`
        );
      }

      resetForm();
      await loadData();
    } catch (error) {
      console.error('Failed to save inventory:', error);
      toast.error('Failed to save inventory');
    }
  };

  const handleEdit = (item: any, type: TabType) => {
    setEditingItem(item);
    if (type === 'menu') {
      setMenuFormData({
        itemName: item.itemName || '',
        itemPrice: item.itemPrice || 0,
        itemDescription: item.itemDescription || '',
        category: item.category || '',
        dietaryRestrictions: item.dietaryRestrictions || '',
        isAvailable: item.isAvailable ?? true,
        itemImage: item.itemImage || ''
      });
    } else if (type === 'users') {
      setUserFormData({
        fullName: item.fullName || '',
        email: item.email || '',
        role: item.role || (item.adminRole ? 'admin' : 'student'),
        phoneNumber: item.phoneNumber || item.contactNumber || '',
        department: item.department || '',
        universityName: item.universityName || 'COMSATS Islamabad'
      });
    } else if (type === 'stock') {
      setInventoryFormData({
        itemName: item.itemName || '',
        category: item.category || '',
        quantity: item.quantity || 0,
        unit: item.unit || 'pcs',
        minStockLevel: item.minStockLevel || 5,
        status: item.status || 'In Stock'
      });
    }
    setShowAddForm(true);
  };

  const handleDelete = async (id: string, collection: string) => {
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        await BaseCrudService.delete(collection as any, id);
        toast.success('Record deleted successfully');
        await loadData();
      } catch (error) {
        console.error('Failed to delete:', error);
        toast.error('Failed to delete record');
      }
    }
  };

  const resetForm = () => {
    setMenuFormData({ itemName: '', itemPrice: 0, itemDescription: '', category: '', dietaryRestrictions: '', isAvailable: true, itemImage: '' });
    setUserFormData({ fullName: '', email: '', role: 'student', phoneNumber: '', department: '', universityName: 'COMSATS Islamabad' });
    setInventoryFormData({ itemName: '', category: '', quantity: 0, unit: 'pcs', minStockLevel: 5, status: 'In Stock', itemImage: '' });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const updateOrderStatus = async (orderId: string, status: string, isPaid?: boolean) => {
    try {
      await BaseCrudService.update('orders', {
        _id: orderId,
        status,
        ...(isPaid !== undefined && { isPaid })
      });
      
      // Log activity for mature system audit trail
      if (currentUser) {
        RealtimeService.logActivity(
          currentUser.uid, 
          currentUser.fullName || 'Admin', 
          'ORDER_STATUS_UPDATE', 
          `Changed order #${orderId} status to ${status}${isPaid !== undefined ? ` (Paid: ${isPaid})` : ''}`
        );
      }

      toast.success(`Order status updated to ${status}`);
      // await loadData(); // No longer needed due to real-time listeners
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
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

    const pendingOrders = orders.filter((o) => {
      const status = normalizeOrderStatus(o.status);
      return status === 'ordered' || status === 'accepted';
    }).length;

    const totalUdhar = teachers.reduce((sum, t) => sum + ((t as any).balance || 0), 0);

    return { totalRevenue, totalOrders, deliveredOrders, activeOrders, pendingOrders, totalUdhar };
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
  
  const allUsers = [
    ...admins.map(u => ({ ...u, role: u.adminRole || 'admin', collection: 'admins' })),
    ...teachers.map(u => ({ ...u, role: 'teacher', collection: 'teachers' })),
    ...students.map(u => ({ ...u, role: 'student', collection: 'students' }))
  ];

  const filteredUsers = allUsers.filter(u => 
    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInventory = inventory.filter(i => 
    i.itemName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const COLORS = ['#0ea5e9', '#008040', '#0284c7', '#22c55e', '#4ade80', '#86efac'];

  // Prepared data for charts
  const prepareRevenueByDayData = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueByDay: Record<string, number> = {};
    orders.forEach(order => {
      if (order.isPaid && order.orderTime) {
        const date = new Date(order.orderTime);
        const dayName = dayNames[date.getDay()];
        revenueByDay[dayName] = (revenueByDay[dayName] || 0) + (order.totalPrice || 0);
      }
    });
    return dayNames.map(day => ({ day, revenue: revenueByDay[day] || 0 }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Quick Stats Grid */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-[#0ea5e9]">
                  <OrderIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg uppercase tracking-wider">Today</span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Orders</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.totalOrders}</h3>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg uppercase tracking-wider">Revenue</span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Sales</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{formatPrice(stats.totalRevenue, currency ?? DEFAULT_CURRENCY)}</h3>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg uppercase tracking-wider">Active</span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Pending Orders</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.pendingOrders}</h3>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                  <CreditIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg uppercase tracking-wider">Credit</span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Outstanding (Udhar)</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{formatPrice(stats.totalUdhar, currency ?? DEFAULT_CURRENCY)}</h3>
            </motion.div>
          </div>

          <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900">Revenue Analytics</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><Download className="w-4 h-4 text-slate-400" /></button>
                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><MoreVertical className="w-4 h-4 text-slate-400" /></button>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prepareRevenueByDayData()}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `Rs.${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-[#0ea5e9] p-8 rounded-3xl text-white shadow-lg shadow-sky-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-sky-200 text-xs font-bold uppercase tracking-widest mb-2">Inventory Status</p>
                <h3 className="text-2xl font-bold mb-4">Stock Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-80">Low Stock Items</span>
                    <span className="bg-red-500 px-2 py-0.5 rounded-lg text-xs font-bold">
                      {inventory.filter(i => (i.quantity || 0) <= (i.minStockLevel || 0)).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-80">Total SKUs</span>
                    <span className="font-bold">{inventory.length}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('stock')}
                  className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  Manage Stock <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <Boxes className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5" />
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0ea5e9]" />
                User Base
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 font-bold">S</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">Students</p>
                    <p className="text-xs text-slate-500">{students.length} Registered</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">T</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">Teachers</p>
                    <p className="text-xs text-slate-500">{teachers.length} Registered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="bg-white p-1 rounded-2xl border border-slate-200 flex flex-wrap gap-1 w-fit shadow-sm sticky top-20 z-30">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as TabType); resetForm(); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-[#0ea5e9] text-white shadow-lg shadow-sky-900/20' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>


      <div className="w-full">
        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">User Management</h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] outline-none transition-all w-64"
                  />
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-[#0ea5e9] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#0284c7] transition-all flex items-center gap-2 shadow-lg shadow-sky-900/20"
                >
                  <UserPlus className="w-4 h-4" />
                  Add User
                </button>
              </div>
            </div>

            {showAddForm && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  {editingItem ? <Edit className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {editingItem ? 'Edit User Details' : 'Register New User'}
                </h3>
                <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name *</label>
                    <input type="text" required value={userFormData.fullName} onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0ea5e9] outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address *</label>
                    <input type="email" required value={userFormData.email} onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0ea5e9] outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">User Role *</label>
                    <select 
                      value={userFormData.role} 
                      onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0ea5e9] outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="university_staff">University Staff</option>
                      <option value="staff">Operations Staff</option>
                      {isSuperAdmin && (

                        <>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </>
                      )}
                    </select>

                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                    <input type="text" value={userFormData.phoneNumber} onChange={(e) => setUserFormData({ ...userFormData, phoneNumber: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0ea5e9] outline-none" />
                  </div>
                  <div className="flex gap-4 mt-4 col-span-full">
                    <button type="submit" className="bg-[#0ea5e9] text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#0284c7] transition-all">{editingItem ? 'Update User' : 'Create User'}</button>
                    <button type="button" onClick={resetForm} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers
                    .filter(u => isSuperAdmin || (u.role !== 'admin' && u.role !== 'super_admin'))
                    .map((user) => (

                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-[#0ea5e9] font-bold">
                            {user.fullName?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'super_admin' ? 'bg-purple-50 text-purple-600' :
                          user.role === 'admin' ? 'bg-sky-50 text-sky-600' :
                          user.role === 'teacher' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'
                        }`}>
                          {user.role?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-600 font-medium">{user.phoneNumber || user.contactNumber || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(user, 'users')} className="p-2 text-slate-400 hover:text-[#0ea5e9] hover:bg-sky-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(user._id, user.collection)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory Management Tab */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Inventory & Stock</h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search inventory..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64" />
                </div>
                <button onClick={() => setShowAddForm(!showAddForm)} className="bg-[#0ea5e9] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#0284c7] transition-all flex items-center gap-2 shadow-lg shadow-sky-900/20">
                  <Plus className="w-4 h-4" />
                  Add Stock
                </button>
              </div>
            </div>

            {showAddForm && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">{editingItem ? 'Update Stock Item' : 'Add New Stock Item'}</h3>
                <form onSubmit={handleInventorySubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Item Name *</label>
                    <input type="text" required value={inventoryFormData.itemName} onChange={(e) => setInventoryFormData({ ...inventoryFormData, itemName: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Quantity *</label>
                    <div className="flex gap-2">
                      <input type="number" required value={inventoryFormData.quantity} onChange={(e) => setInventoryFormData({ ...inventoryFormData, quantity: parseInt(e.target.value) })} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                      <input type="text" value={inventoryFormData.unit} onChange={(e) => setInventoryFormData({ ...inventoryFormData, unit: e.target.value })} placeholder="unit" className="w-20 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Min Stock Level</label>
                    <input type="number" value={inventoryFormData.minStockLevel} onChange={(e) => setInventoryFormData({ ...inventoryFormData, minStockLevel: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Item Image</label>
                    <div className="flex gap-2">
                      <input type="text" value={inventoryFormData.itemImage} onChange={(e) => setInventoryFormData({ ...inventoryFormData, itemImage: e.target.value })} placeholder="URL or upload..." className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                      <label className="cursor-pointer bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <Upload className="w-5 h-5 text-slate-400" />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'inventory')} />
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4 col-span-full">
                    <button type="submit" className="bg-[#0ea5e9] text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#0284c7] transition-all">Save Stock</button>
                    <button type="button" onClick={resetForm} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInventory.map((item) => (
                <motion.div key={item._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(item, 'stock')} className="p-2 text-slate-400 hover:text-[#0ea5e9] hover:bg-sky-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item._id, 'inventory')} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{item.itemName}</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">{item.category || 'General Inventory'}</p>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Current Stock</p>
                      <p className={`text-2xl font-bold ${(item.quantity || 0) <= (item.minStockLevel || 0) ? 'text-red-600' : 'text-[#0ea5e9]'}`}>
                        {item.quantity} <span className="text-sm font-normal text-slate-400 uppercase tracking-wider">{item.unit}</span>
                      </p>
                    </div>
                    {(item.quantity || 0) <= (item.minStockLevel || 0) && (
                      <span className="flex items-center gap-1 text-red-600 text-[10px] font-bold bg-red-50 px-2 py-1 rounded-lg uppercase">
                        <AlertCircle className="w-3 h-3" /> Low Stock
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Menu Management</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-[#0ea5e9] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#0284c7] transition-all flex items-center gap-2 shadow-lg shadow-sky-900/20"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                  Add New Item
                </button>
              </div>
            </div>

            {showAddForm && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
                <form onSubmit={handleMenuSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Item Name *</label>
                    <input type="text" required value={menuFormData.itemName} onChange={(e) => setMenuFormData({ ...menuFormData, itemName: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Price (PKR) *</label>
                    <input type="number" required value={menuFormData.itemPrice} onChange={(e) => setMenuFormData({ ...menuFormData, itemPrice: parseFloat(e.target.value) })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Category *</label>
                    <select value={menuFormData.category} onChange={(e) => setMenuFormData({ ...menuFormData, category: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
                      <option value="">Select Category</option>
                      <option value="Biryani & Rice">Biryani & Rice</option>
                      <option value="Burgers & Sandwiches">Burgers & Sandwiches</option>
                      <option value="Pizza & Sides">Pizza & Sides</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Snacks">Snacks</option>
                    </select>
                  </div>
                  <div className="col-span-full space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                    <textarea rows={2} value={menuFormData.itemDescription} onChange={(e) => setMenuFormData({ ...menuFormData, itemDescription: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none resize-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Image URL (Optional)</label>
                    <div className="flex gap-2">
                      <input type="text" value={menuFormData.itemImage} onChange={(e) => setMenuFormData({ ...menuFormData, itemImage: e.target.value })} placeholder="https://..." className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                      <label className="cursor-pointer bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition-colors" title="Upload Image">
                        <Upload className="w-5 h-5 text-slate-400" />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'menu')} />
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-8">
                    <input type="checkbox" id="available" checked={menuFormData.isAvailable} onChange={(e) => setMenuFormData({ ...menuFormData, isAvailable: e.target.checked })} className="w-4 h-4 rounded text-[#0ea5e9]" />
                    <label htmlFor="available" className="text-sm font-bold text-slate-700">Available for Order</label>
                  </div>
                  <div className="flex gap-4 mt-4 col-span-full">
                    <button type="submit" className="bg-[#0ea5e9] text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#0284c7] transition-all">Save Menu Item</button>
                    <button type="button" onClick={resetForm} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.map((item) => (
                <motion.div key={item._id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                  <div className="relative h-40 overflow-hidden">
                    <img src={item.itemImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'} alt={item.itemName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 flex gap-1">
                      <button onClick={() => handleEdit(item, 'menu')} className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-[#0ea5e9] rounded-xl shadow-sm transition-all"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item._id, 'menuitems')} className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-red-600 rounded-xl shadow-sm transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    {!item.isAvailable && <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest">Out of Stock</div>}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-base font-bold text-slate-900 uppercase truncate">{item.itemName}</h4>
                      <span className="text-[#0ea5e9] font-bold">Rs.{item.itemPrice}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">{item.category}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.itemDescription}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'discounts' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Promotions & Discounts</h2>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-[#0ea5e9] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#0284c7] transition-all flex items-center gap-2 shadow-lg shadow-sky-900/20"
              >
                <Tag className="w-4 h-4" />
                New Discount
              </button>
            </div>

            {showAddForm && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Create Discount Campaign</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaign Name *</label>
                    <input type="text" placeholder="e.g. Winter Sale" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Discount Type</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (Rs.)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Value</label>
                    <input type="number" placeholder="10" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valid Until</label>
                    <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                  </div>
                  <div className="flex gap-4 mt-4 col-span-full">
                    <button className="bg-[#0ea5e9] text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#0284c7] transition-all">Create Campaign</button>
                    <button onClick={resetForm} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discounts.map((discount) => (
                <div key={discount._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-sky-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-[#0ea5e9]">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 text-slate-400 hover:text-[#0ea5e9] rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(discount._id, 'discounts')} className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{discount.code || 'SALE10'}</h4>
                    <p className="text-sm text-slate-500 font-medium mb-4">{discount.description || 'Winter Special Discount'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#0ea5e9]">{discount.percentage}% OFF</span>
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${discount.status === 'active' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'}`}>
                        {discount.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Payment Records</h2>
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search transactions..." className="text-sm outline-none bg-transparent" />
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Method</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date/Time</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">#{payment._id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-600 font-medium">{formatPaymentMethod(payment.paymentMethod)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#0ea5e9]">
                        {formatPrice(payment.amountPaid || 0, currency ?? DEFAULT_CURRENCY)}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {payment.paymentDateTime ? format(new Date(payment.paymentDateTime), 'MMM d, yyyy • hh:mm a') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          payment.paymentStatus === 'completed' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {payment.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Force reload */}
        {activeTab === 'reports' && (


          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Business Intelligence</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => toast.success('Daily closing report generated and saved to history.')}
                  className="bg-[#0ea5e9] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#0284c7] transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Daily Closing
                </button>
                <button className="bg-white text-slate-600 border border-slate-200 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Breakdown</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(paymentMethodSummary).map(([name, data]) => ({ name: formatPaymentMethod(name), value: data.amount }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {Object.entries(paymentMethodSummary).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Today's Performance</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gross Sales</p>
                      <p className="text-xl font-black text-slate-900">{formatPrice(stats.totalRevenue, currency ?? DEFAULT_CURRENCY)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Order</p>
                      <p className="text-xl font-black text-slate-900">
                        {formatPrice(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0, currency ?? DEFAULT_CURRENCY)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency Metrics</h4>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Completion Rate</span>
                      <span className="font-bold text-sky-600">{stats.totalOrders > 0 ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full transition-all duration-1000" style={{ width: `${stats.totalOrders > 0 ? (stats.deliveredOrders / stats.totalOrders) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kitchen' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Live Kitchen Queue</h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold animate-pulse">
                <div className="w-2 h-2 bg-rose-600 rounded-full" />
                LIVE KITCHEN FEED
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {orders
                .filter(o => ['ordered', 'accepted', 'in_process'].includes(normalizeOrderStatus(o.status)))
                .map((order) => (
                <motion.div 
                  layout
                  key={order._id} 
                  className="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-black text-slate-900">#{order._id.slice(-5).toUpperCase()}</span>
                    <span className="text-[10px] font-bold text-slate-400">{new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-700">{item.quantity}x {item.itemName}</span>
                          {item.variant && <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">{item.variant}</span>}
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-slate-50">
                      <div className="flex justify-between items-center mb-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          normalizeOrderStatus(order.status) === 'in_process' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                        }`}>
                          {order.status}
                        </span>
                        <div className="flex gap-2">
                          {normalizeOrderStatus(order.status) === 'ordered' && (
                            <button 
                              onClick={() => updateOrderStatus(order._id, 'accepted')}
                              className="bg-sky-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-sky-700 transition-colors"
                            >
                              Accept
                            </button>
                          )}
                          {normalizeOrderStatus(order.status) === 'accepted' && (
                            <button 
                              onClick={() => updateOrderStatus(order._id, 'in_process')}
                              className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-amber-700 transition-colors"
                            >
                              Start
                            </button>
                          )}
                          {normalizeOrderStatus(order.status) === 'in_process' && (
                            <button 
                              onClick={() => updateOrderStatus(order._id, 'ready')}
                              className="bg-sky-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-sky-700 transition-colors"
                            >
                              Ready
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {orders.filter(o => ['ordered', 'accepted', 'in_process'].includes(normalizeOrderStatus(o.status))).length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">Kitchen queue is empty. New orders will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'activity' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Audit Trail</h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing last 50 actions</span>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {activityLogs.map((log, idx) => (
                  <div key={log._id || idx} className="p-4 hover:bg-slate-50/50 transition-colors flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      log.action.includes('UPDATE') ? 'bg-amber-50 text-amber-600' :
                      log.action.includes('CREATE') ? 'bg-sky-50 text-sky-600' :
                      log.action.includes('DELETE') ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                    }`}>
                      <ActivityIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-slate-900">{log.userName}</p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {log.timestamp?.seconds 
                            ? new Date(log.timestamp.seconds * 1000).toLocaleString() 
                            : log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1"><span className="font-bold text-slate-800">{log.action}:</span> {log.details}</p>
                    </div>
                  </div>
                ))}
                {activityLogs.length === 0 && (
                  <div className="p-12 text-center text-slate-500 font-medium italic">No activity recorded yet.</div>
                )}
              </div>
            </div>
          </div>
        )}



        {activeTab === 'settings' && isSuperAdmin && (
          <div className="space-y-8 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">System Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Business Config */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Business Configuration</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cafe Name</label>
                    <input type="text" defaultValue="COMSATS Islamabad Cafeteria" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0ea5e9]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tax Percentage (%)</label>
                    <input type="number" defaultValue={0} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0ea5e9]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Default Currency</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0ea5e9]">
                      <option value="PKR">PKR (₨)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Security & Roles */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <p className="text-sm font-bold text-slate-900">User Self-Registration</p>
                      <p className="text-[10px] text-slate-500">Allow users to sign up themselves</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0ea5e9] rounded" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                      <p className="text-[10px] text-slate-500">Restrict all public access</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-[#0ea5e9] rounded" />
                  </div>
                  <div className="pt-4">
                    <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
                      Update Security Policies
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="bg-[#0ea5e9] text-white px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#0284c7] transition-all shadow-xl shadow-sky-900/20">
                Save Global Settings
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
