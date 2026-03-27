import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import * as XLSX from 'xlsx';
import { 
  Edit, Trash2, Plus, Download, BarChart3, Package, Users, 
  DollarSign, TrendingUp, Search, Calendar, ArrowUpRight, Wallet, BadgeCheck, ShieldAlert, RefreshCcw, LayoutGrid, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell
} from 'recharts';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'menu', 'users'
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Drinks', stock: 100, image: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menuRes, ordersRes, usersRes] = await Promise.all([
        api.get('/menu'),
        api.get('/orders'),
        api.get('/users') // I added this route in a previous step
      ]);
      setMenu(menuRes.data);
      setOrders(ordersRes.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Strategic Intelligence Link Failure');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/menu', newItem);
      setNewItem({ name: '', price: '', category: 'Drinks', stock: 100, image: '' });
      fetchData();
      toast.success('Asset Catalog Successfully Updated');
    } catch (err) {
      toast.error('Asset Authorization Failed');
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Confirm Asset Deauthorization?')) {
      try {
          await api.delete(`/menu/${id}`);
          fetchData();
          toast.info('Asset Purged from Catalog');
      } catch (err) {
          toast.error('Purge Sequence Failed');
      }
    }
  };

  const topupWallet = async (userId, amount) => {
      try {
          await api.post('/users/wallet/topup', { userId, amount });
          fetchData();
          toast.success(`Capital Injection Successful: Rs. ${amount}`);
      } catch (err) {
          toast.error('Capital Injection Protocol Failed');
      }
  };

  // Chart Data Preparation
  const chartData = orders.slice(0, 10).reverse().map(o => ({
    name: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    revenue: Number(o.final_amount),
  }));

  const totalSales = orders.reduce((sum, o) => sum + Number(o.final_amount), 0);
  const totalOrders = orders.length;

  const statusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#9333ea' },
    { name: 'Preparing', value: orders.filter(o => o.status === 'preparing').length, color: '#f97316' },
    { name: 'Completed', value: orders.filter(o => o.status === 'completed').length, color: '#22c55e' },
  ];

  return (
    <div className="p-6 md:p-12 max-w-[1800px] mx-auto space-y-16 bg-background min-h-screen">
      {/* Executive Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pb-10 border-b border-glass-border">
        <div className="space-y-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-primary font-black text-[10px] uppercase tracking-[0.6em]">Executive Command Tier</motion.div>
          <h1 className="text-6xl font-black tracking-tighter italic">Global <span className="gradient-text uppercase text-nowrap">Operational Dashboard</span></h1>
        </div>
        
        <div className="flex flex-wrap gap-4 bg-white/[0.02] p-3 rounded-[32px] border border-glass-border shadow-2xl">
           {[
             { id: 'analytics', label: 'Intelligence', icon: BarChart3 },
             { id: 'menu', label: 'Asset Management', icon: LayoutGrid },
             { id: 'users', label: 'Governance', icon: Users }
           ].map((tab) => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`px-8 py-4 rounded-[22px] flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${activeTab === tab.id ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
             >
               <tab.icon size={18} /> {tab.label}
             </button>
           ))}
           <button onClick={fetchData} className="w-14 h-14 bg-white/5 rounded-[20px] flex items-center justify-center text-primary border border-glass-border hover:bg-primary hover:text-white transition-all shadow-xl active:scale-90">
             <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
           </button>
        </div>
      </div>

      {activeTab === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Cumulative Capital', value: `Rs. ${totalSales.toLocaleString()}`, icon: DollarSign, color: 'primary', trend: '+18.2%' },
              { label: 'Strategic Volume', value: totalOrders, icon: BarChart3, color: 'secondary', trend: '+5.4%' },
              { label: 'Asset Inventory', value: menu.length, icon: Package, color: 'accent', trend: 'Stable' },
              { label: 'Citizen Base', value: users.length, icon: Users, color: 'success', trend: '+12' }
            ].map((stat, i) => (
              <div key={stat.label} className="glass-panel p-10 space-y-8 border-l-8 border-transparent hover:border-primary transition-all duration-500 group relative overflow-hidden">
                <div className="flex justify-between items-start">
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <stat.icon size={32} />
                   </div>
                   <div className="text-[10px] font-black text-success uppercase tracking-widest bg-success/10 px-3 py-1 rounded-full">{stat.trend}</div>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">{stat.label}</p>
                   <h3 className="text-4xl font-black italic tracking-tighter">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
             {/* Revenue Chart */}
             <div className="xl:col-span-2 glass-panel p-12 space-y-10 border border-glass-border shadow-2xl">
                <div className="flex justify-between items-center">
                   <div className="space-y-1">
                      <h2 className="text-3xl font-black italic uppercase">Revenue <span className="gradient-text">Stream</span></h2>
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-text-muted">High-frequency fiscal monitoring</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-xl text-[10px] font-black border border-success/20">
                         <ArrowUpRight size={14} /> Peak Performance
                      </div>
                   </div>
                </div>
                <div className="h-[450px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} fontWeight={900} tick={{ fill: 'rgba(255,255,255,0.4)' }} />
                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} fontWeight={900} tick={{ fill: 'rgba(255,255,255,0.4)' }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'black', border: '1px solid var(--primary)', borderRadius: '20px', padding: '20px' }}
                          itemStyle={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.2rem' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Recent Global Activity */}
             <div className="xl:col-span-1 glass-panel p-10 space-y-10 border-t-8 border-secondary shadow-2xl">
                <div className="space-y-1">
                   <h2 className="text-3xl font-black italic uppercase">Live <span className="gradient-text">Ledger</span></h2>
                   <p className="text-[9px] font-black uppercase tracking-[0.4em] text-text-muted">Real-time transaction log</p>
                </div>
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
                   {orders.slice(0, 10).map(order => (
                     <div key={order.id} className="p-6 bg-white/[0.02] border border-glass-border rounded-3xl group hover:border-primary transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{new Date(order.created_at).toLocaleTimeString()}</span>
                           <span className="text-lg font-black italic text-primary">Rs. {order.final_amount}</span>
                        </div>
                        <p className="text-sm font-bold opacity-60 line-clamp-1">{order.items.map(i => i.name).join(', ')}</p>
                     </div>
                   ))}
                </div>
              </div>

              {/* Status Distribution */}
              <div className="glass-panel p-10 space-y-10 border border-glass-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase shrink-0">Status <br/><span className="gradient-text">Manifest</span></h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '15px', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between gap-4">
                   {statusData.map(s => (
                     <div key={s.name} className="text-center space-y-1 flex-1">
                        <p style={{ color: s.color }} className="text-xl font-black italic tracking-tighter">{s.value}</p>
                        <p className="text-[8px] font-black uppercase text-text-muted tracking-widest">{s.name}</p>
                     </div>
                   ))}
                </div>
              </div>
             </div>
          </motion.div>
      )}

      {activeTab === 'menu' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 xl:grid-cols-3 gap-16">
          {/* Menu Management Form */}
          <div className="xl:col-span-1 space-y-10">
             <div className="glass-panel p-10 border border-glass-border space-y-10">
                <div className="space-y-2">
                   <h2 className="text-3xl font-black italic flex items-center gap-4"><Plus className="text-primary" size={32} /> Authorize <span className="gradient-text">Asset</span></h2>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">Introduce new curated selection to catalog</p>
                </div>
                <form onSubmit={handleAddItem} className="space-y-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Asset Nomenclature</label>
                      <input type="text" placeholder="e.g., Artisanal Sourdough" className="modern-input py-5" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required />
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Capital Value (Rs.)</label>
                        <input type="number" className="modern-input py-5 font-black text-xl italic" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} required />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Strategic Logic (Stock)</label>
                        <input type="number" className="modern-input py-5 font-black text-xl italic" value={newItem.stock} onChange={(e) => setNewItem({...newItem, stock: e.target.value})} required />
                      </div>
                   </div>
                   <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Market Segment</label>
                        <select className="modern-input py-5 appearance-none cursor-pointer uppercase font-black tracking-widest text-[10px] bg-bg-deep" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})}>
                           <option>Drinks</option>
                           <option>Food</option>
                           <option>Bakery</option>
                           <option>Specials</option>
                        </select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Visual Asset URL</label>
                      <input type="text" placeholder="https://..." className="modern-input py-5" value={newItem.image} onChange={(e) => setNewItem({...newItem, image: e.target.value})} />
                   </div>
                   <button type="submit" className="btn-vibrant w-full py-6 text-xl shadow-2xl shadow-primary/40 group">
                      Finalize Catalog Update <ArrowUpRight className="group-hover:translate-x-3 transition-transform" />
                   </button>
                </form>
             </div>
          </div>

          {/* Asset Matrix Table */}
          <div className="xl:col-span-2 glass-panel p-12 space-y-12">
             <div className="flex justify-between items-center bg-white/[0.02] p-8 rounded-[32px] border border-glass-border">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Global <span className="gradient-text">Asset Matrix</span></h2>
                <div className="p-4 bg-primary/10 rounded-2xl text-primary font-black text-xs">{menu.length} Recorded Units</div>
             </div>
             
             <div className="modern-table-wrapper">
                <table className="modern-table">
                   <thead>
                      <tr>
                         <th>Nomenclature</th>
                         <th>Segment</th>
                         <th>Capital</th>
                         <th>Availability</th>
                         <th className="text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody>
                      {menu.map(item => (
                        <tr key={item.id} className="group">
                           <td className="font-black italic text-xl group-hover:text-primary transition-colors">{item.name}</td>
                           <td><span className="px-4 py-2 bg-white/5 border border-glass-border rounded-xl text-[10px] font-black uppercase tracking-widest">{item.category}</span></td>
                           <td className="font-black text-2xl tracking-tighter italic text-primary">Rs. {item.price}</td>
                           <td>
                              <div className="flex items-center gap-3">
                                 <div className={`w-3 h-3 rounded-full ${item.stock > 10 ? 'bg-success shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-danger animate-pulse'}`}></div>
                                 <span className="text-sm font-black italic opacity-60 text-white">{item.stock} Units</span>
                              </div>
                           </td>
                           <td className="text-right">
                              <button onClick={() => deleteItem(item.id)} className="w-12 h-12 bg-danger/10 text-danger rounded-xl flex items-center justify-center hover:bg-danger hover:text-white transition-all shadow-lg active:scale-95">
                                 <Trash2 size={20} />
                              </button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
           <div className="flex justify-between items-center bg-white/[0.02] p-10 rounded-[40px] border border-glass-border shadow-2xl">
              <div className="space-y-2">
                 <h2 className="text-5xl font-black italic uppercase tracking-tighter border-b-4 border-primary pb-2 w-fit">Citizen <span className="gradient-text uppercase">Governance</span></h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.6em] text-text-muted">Lifecycle & Capital Authorization Protocol</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {users.map((u) => (
                <div key={u.id} className="glass-panel p-10 border-t-8 border-glass-border space-y-8 group hover:border-primary transition-all duration-700 bg-white/[0.01]">
                   <div className="flex justify-between items-start">
                      <div className="w-20 h-20 bg-primary/20 rounded-[30px] flex items-center justify-center text-primary text-4xl font-black relative overflow-hidden group-hover:bg-primary group-hover:text-white transition-all duration-700">
                         {u.name?.charAt(0)}
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                        u.role === 'admin' ? 'bg-danger/10 text-danger border-danger/20' : 'bg-secondary/10 text-secondary border-secondary/20'
                      }`}>
                        {u.role}
                      </div>
                   </div>
                   <div className="space-y-3">
                      <h3 className="text-2xl font-black italic tracking-tighter group-hover:translate-x-2 transition-transform">{u.name}</h3>
                      <p className="font-mono text-[11px] opacity-40 font-bold overflow-hidden text-ellipsis">{u.email}</p>
                   </div>
                   
                   <div className="pt-8 border-t border-glass-border space-y-8">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">Capital Reserves</span>
                          <span className="text-2xl font-black text-primary tracking-tighter">Rs. {u.walletBalance || 0}</span>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <button 
                             onClick={() => topupWallet(u.id, 1000)}
                             className="py-4 bg-white/5 border border-glass-border rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 shadow-xl"
                          >
                             <Wallet size={14} /> +1000
                          </button>
                          <button 
                             onClick={() => topupWallet(u.id, 5000)}
                             className="py-4 bg-white/5 border border-glass-border rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 shadow-xl"
                          >
                             <Plus size={14} /> +5000
                          </button>
                       </div>
                   </div>
                   
                   <div className="flex items-center gap-3 pt-6 text-success opacity-40 group-hover:opacity-100 transition-opacity">
                      <BadgeCheck size={18} />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em]">Protocol Active</span>
                   </div>
                </div>
              ))}
           </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
