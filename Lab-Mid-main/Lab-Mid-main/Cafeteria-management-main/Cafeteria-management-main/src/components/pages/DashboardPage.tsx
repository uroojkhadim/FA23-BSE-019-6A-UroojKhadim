import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  History, 
  Bell,
  CheckCircle2,
  User,
  CreditCard,
  MapPin,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  Menu as MenuIcon,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RealtimeService } from '@/lib/RealtimeService';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { toast } from 'sonner';

const data = [
  { name: 'Mon', orders: 40, revenue: 2400 },
  { name: 'Tue', orders: 30, revenue: 1398 },
  { name: 'Wed', orders: 20, revenue: 9800 },
  { name: 'Thu', orders: 27, revenue: 3908 },
  { name: 'Fri', orders: 18, revenue: 4800 },
  { name: 'Sat', orders: 23, revenue: 3800 },
  { name: 'Sun', orders: 34, revenue: 4300 },
];

const COLORS = ['#0ea5e9', '#FFBB28', '#FF8042', '#00C49F', '#FF0000'];
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [realtimeStats, setRealtimeStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    lowStock: 0,
    pending: 0,
    ready: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Real-time Order Stream for dynamic stats
    const unsubOrders = RealtimeService.subscribeToCollection('orders', (data) => {
      const revenue = data.filter(o => o.isPaid).reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const pending = data.filter(o => ['ordered', 'accepted'].includes(o.status)).length;
      const ready = data.filter(o => o.status === 'ready').length;
      
      setRealtimeStats(prev => ({
        ...prev,
        revenue,
        orders: data.length,
        pending,
        ready
      }));
      setRecentOrders(data.slice(0, 5));
    });

    // Real-time Inventory Stream
    const unsubInventory = RealtimeService.subscribeToCollection('inventory', (data) => {
      const lowStock = data.filter(i => (i.quantity || 0) <= (i.minStockLevel || 0)).length;
      setRealtimeStats(prev => ({ ...prev, lowStock }));
    });

    return () => {
      unsubOrders();
      unsubInventory();
    };
  }, [user]);

  const renderStats = () => {
    const stats = [];
    if (user?.role === 'super_admin' || user?.role === 'admin') {
      stats.push(
        { label: 'Total Revenue', value: `Rs. ${realtimeStats.revenue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: 'text-sky-600', bg: 'bg-sky-50' },
        { label: 'System Orders', value: realtimeStats.orders.toString(), icon: <ShoppingBag className="w-5 h-5" />, color: 'text-sky-600', bg: 'bg-sky-50' },
        { label: 'Pending Task', value: realtimeStats.pending.toString(), icon: <Clock className="w-5 h-5" />, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Low Stock', value: `${realtimeStats.lowStock} Items`, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-rose-600', bg: 'bg-rose-50' }
      );
    } else if (user?.role === 'staff') {
      stats.push(
        { label: 'Total Orders', value: realtimeStats.orders.toString(), icon: <ShoppingBag className="w-5 h-5" />, color: 'text-sky-600', bg: 'bg-sky-50' },
        { label: 'In Preparation', value: realtimeStats.pending.toString(), icon: <Clock className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Ready to Serve', value: realtimeStats.ready.toString(), icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-sky-600', bg: 'bg-sky-50' },
        { label: 'Shift Sales', value: `Rs. ${realtimeStats.revenue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: 'text-sky-600', bg: 'bg-sky-50' }
      );
    } else {
      // Teachers, Students, University Staff
      const myOrdersCount = recentOrders.filter(o => o.userId === user?.uid || o.userId === user?._id).length;
      stats.push(
        { label: 'My Orders', value: myOrdersCount.toString(), icon: <ShoppingBag className="w-5 h-5" />, color: 'text-sky-600', bg: 'bg-sky-50' },
        { label: 'Wallet Balance', value: user?.balance ? `Rs. ${user.balance}` : 'Rs. 0', icon: <CreditCard className="w-5 h-5" />, color: 'text-sky-600', bg: 'bg-sky-50' },
        { label: 'Loyalty Points', value: '450', icon: <TrendingUp className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Unread Alerts', value: '2', icon: <Bell className="w-5 h-5" />, color: 'text-rose-600', bg: 'bg-rose-50' }
      );
    }



    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">
            {user?.role?.replace('_', ' ')} Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {user?.fullName}! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => toast.success('Report generation started. Your download will begin shortly.')}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Download Report
          </button>
          {(user?.role === 'admin' || user?.role === 'super_admin') && (
            <button 
              onClick={() => navigate('/add-menu')}
              className="px-4 py-2 bg-white border-2 border-[#0ea5e9] text-[#0ea5e9] rounded-lg text-sm font-bold hover:bg-sky-50 transition-colors"
            >
              Add Menu Item
            </button>
          )}
          <button 
            onClick={() => navigate('/create-order')}
            className="px-4 py-2 bg-[#0ea5e9] text-white rounded-lg text-sm font-semibold hover:bg-[#0284c7] transition-colors shadow-lg shadow-sky-900/20"
          >
            + New Order
          </button>
        </div>

      </div>

      {/* Stats Cards */}
      {renderStats()}

      <div className="grid grid-cols-12 gap-8">
        {/* Main Chart */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                <p className="text-sm text-gray-500">Weekly sales performance overview</p>
              </div>
              <select className="bg-gray-50 border-none rounded-lg text-xs font-bold text-gray-500 uppercase tracking-wider px-3 py-2 outline-none cursor-pointer">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <button className="text-sm font-semibold text-[#0ea5e9] hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#ORD-00{i}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Zinger Burger Combo</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">Rs. 450</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Profile Quick View */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-24 bg-[#0ea5e9] relative">
              <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-sky-50 flex items-center justify-center text-[#0ea5e9] font-bold text-2xl">
                  {user?.fullName?.charAt(0)}
                </div>
              </div>
            </div>
            <div className="pt-14 p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
                <p className="text-xs text-[#0ea5e9] font-bold uppercase tracking-widest mt-1">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm font-medium">COMSATS Islamabad</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-sky-500" />
                  </div>
                  <span className="text-sm font-medium">Verified Profile</span>
                </div>
              </div>

              <button className="w-full py-3 rounded-xl border border-gray-200 font-bold text-sm text-gray-600 hover:bg-gray-50 transition-all">
                Profile Settings
              </button>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-[10px] font-bold">3 NEW</span>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0 text-sky-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Order Dispatched</p>
                    <p className="text-xs text-gray-500 mt-1">Your order #ORD-00{i} has been picked up.</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert for Admins */}
          {(user?.role === 'super_admin' || user?.role === 'admin') && (
            <div className="bg-rose-50 rounded-3xl border border-rose-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Stock Alerts</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-rose-900 font-medium">Fresh Milk</span>
                  <span className="px-2 py-0.5 bg-rose-200 text-rose-800 rounded-full text-[10px] font-bold">2L LEFT</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-rose-900 font-medium">Chicken Breast</span>
                  <span className="px-2 py-0.5 bg-rose-200 text-rose-800 rounded-full text-[10px] font-bold">1KG LEFT</span>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors">
                Restock Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;