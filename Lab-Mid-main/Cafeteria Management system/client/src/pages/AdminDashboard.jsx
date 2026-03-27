import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import * as XLSX from 'xlsx';
import { 
  Edit, Trash2, Plus, Download, BarChart3, Package, Users, 
  DollarSign, TrendingUp, Search, Calendar, ArrowUpRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'All' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menuRes, ordersRes] = await Promise.all([
        api.get('/menu'),
        api.get('/orders')
      ]);
      setMenu(menuRes.data);
      setOrders(ordersRes.data.reverse());
      // Mock users since we don't have a direct /users endpoint in current LowDB setup maybe
      setUsers([
        { id: '1', name: 'John Doe', role: 'student', email: 'john@cafe.com' },
        { id: '2', name: 'Jane Smith', role: 'teacher', email: 'jane@cafe.com' }
      ]);
    } catch (err) {
      console.error(err);
      toast.error('Strategic Data Link Failed');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/menu', newItem);
      setNewItem({ name: '', price: '', category: 'All' });
      fetchData();
      toast.success('Asset Catalog Updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Deauthorize this asset?')) {
      await api.delete(`/menu/${id}`);
      fetchData();
      toast.info('Asset Removed from Catalog');
    }
  };

  // Chart Data Preparation
  const chartData = orders.slice(0, 7).reverse().map(o => ({
    name: new Date(o.createdAt).toLocaleDateString(undefined, { weekday: 'short' }),
    revenue: o.finalAmount,
    orders: 1
  }));

  const totalSales = orders.reduce((sum, o) => sum + o.finalAmount, 0);
  const totalOrders = orders.length;

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tight italic">Executive <span className="gradient-text">Trade Insights</span></h1>
          <p className="text-text-muted font-bold text-[10px] uppercase tracking-[0.4em]">Global operational oversight & performance analytics</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-8 py-4 glass-card font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-primary text-white border-primary' : 'hover:bg-white/5 border-glass-border'}`}
          >
            <TrendingUp size={16} className={activeTab === 'analytics' ? 'text-white' : 'text-primary'} /> Portfolio Analytics
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-8 py-4 glass-card font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-primary text-white border-primary' : 'hover:bg-white/5 border-glass-border'}`}
          >
            <Users size={16} className={activeTab === 'users' ? 'text-white' : 'text-primary'} /> User Governance
          </button>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {[
              { label: 'Cumulative Revenue', value: `Rs. ${totalSales.toLocaleString()}`, icon: DollarSign, color: 'primary' },
              { label: 'Transaction Volume', value: totalOrders, icon: BarChart3, color: 'accent' },
              { label: 'Active Catalog Items', value: menu.length, icon: Package, color: 'secondary' },
              { label: 'Market Reach', value: 'Elite', icon: TrendingUp, color: 'success' }
            ].map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                key={stat.label} 
                className="glass-panel p-10 flex items-center justify-between border-t-8 border-primary group hover:scale-[1.02] transition-transform"
              >
                <div className="space-y-2">
                  <p className="text-text-muted text-[9px] font-black uppercase tracking-[0.3em]">{stat.label}</p>
                  <h3 className="text-4xl font-black italic">{stat.value}</h3>
                </div>
                <div className={`p-6 rounded-[24px] bg-${stat.color}/10 group-hover:bg-${stat.color} group-hover:text-white transition-all duration-500 shadow-2xl`}>
                  <stat.icon size={32} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Revenue Analytics */}
            <div className="xl:col-span-2 glass-panel p-12 space-y-12 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black italic">Revenue <span className="gradient-text">Trajectory</span></h2>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">7-Day Fiscal Performance</p>
                </div>
                <div className="flex items-center gap-3 text-success font-black text-sm">
                    <ArrowUpRight size={20} /> +12.5% Growth
                </div>
              </div>
              
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} fontWeight={900} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} fontWeight={900} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-deep)', border: '1px solid var(--glass-border)', borderRadius: '16px' }}
                      itemStyle={{ color: 'var(--primary)', fontWeight: 900 }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Global Inventory */}
            <div className="xl:col-span-1 space-y-12">
              <div className="glass-panel p-10 border-b-8 border-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Plus size={100} />
                </div>
                <h2 className="text-2xl font-black mb-10 flex items-center gap-4 italic leading-none">
                  <Plus size={32} className="text-primary"/> Authorize Asset
                </h2>
                <form onSubmit={handleAddItem} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Asset Nomenclature</label>
                    <input 
                      type="text" placeholder="e.g. Gold Roast Espresso" className="modern-input py-5"
                      value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Capital (Rs.)</label>
                      <input 
                        type="number" className="modern-input py-5 font-black italic text-lg"
                        value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Segment</label>
                      <select 
                        className="modern-input py-5 bg-bg-deep appearance-none font-black text-xs uppercase tracking-widest"
                        value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        required
                      >
                        <option value="All">All Segments</option>
                        <option value="Drinks">Drinks</option>
                        <option value="Food">Food</option>
                        <option value="Desserts">Desserts</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn-vibrant w-full py-6 font-black uppercase tracking-[0.3em] text-xs">Execute Update</button>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-panel p-12 space-y-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-black italic">Citizen <span className="gradient-text">Governance</span> Registry</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">Managed access and user authorization protocols</p>
          </div>
          
          <div className="modern-table-wrapper">
             <table className="modern-table text-left">
                <thead>
                   <tr>
                      <th>Identity Name</th>
                      <th>Email Protocol</th>
                      <th>Operational Role</th>
                      <th>Access Status</th>
                   </tr>
                </thead>
                <tbody>
                   {users.map(u => (
                      <tr key={u.id}>
                         <td className="font-black italic text-lg">{u.name}</td>
                         <td className="font-mono text-sm opacity-60 font-bold">{u.email}</td>
                         <td>
                            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">{u.role}</span>
                         </td>
                         <td>
                            <div className="flex items-center gap-3">
                               <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                               <span className="text-[10px] font-black uppercase tracking-widest text-success">Authorized</span>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      <div className="glass-panel p-12 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-12">
           <div className="space-y-2">
               <h2 className="text-3xl font-black italic">Trade <span className="gradient-text">Intelligence</span> Ledger</h2>
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">Global transaction sequence history</p>
           </div>
           <button className="bg-white/5 hover:bg-primary hover:text-white px-10 py-5 rounded-[24px] border border-glass-border font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-3 transition-all duration-500 shadow-2xl active:scale-95 group">
             <Download size={20} className="group-hover:translate-y-1 transition-transform" /> Export Audit Sequence
           </button>
        </div>
        
        <div className="modern-table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Sequence ID</th>
                <th>Asset Manifest</th>
                <th>Revenue</th>
                <th>Gateway</th>
                <th className="text-center">Protocol Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="group">
                  <td>
                     <span className="font-mono text-sm opacity-40 font-bold tracking-tighter">#{order.id.slice(-8).toUpperCase()}</span>
                     <p className="text-[9px] text-text-muted mt-1 font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="font-black text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="group-hover:text-primary transition-colors">{order.items.length} Asset Segment(s)</span>
                      <span className="text-[10px] text-text-muted font-bold italic opacity-60">{order.items[0]?.name}{order.items.length > 1 && '...'}</span>
                    </div>
                  </td>
                  <td>
                     <span className="text-xl font-black italic text-primary">Rs. {order.finalAmount}</span>
                  </td>
                  <td>
                     <span className="px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase border border-glass-border tracking-widest group-hover:border-primary/30 transition-colors">{order.paymentMethod}</span>
                  </td>
                  <td className="text-center">
                     <span className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl ${
                       order.status === 'completed' ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'
                     }`}>
                       {order.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
