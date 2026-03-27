import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import * as XLSX from 'xlsx';
import { Edit, Trash2, Plus, Download, BarChart3, Package, Users, DollarSign, TrendingUp, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/menu', newItem);
      setNewItem({ name: '', price: '', category: 'All' });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Delete this item?')) {
      await api.delete(`/menu/${id}`);
      fetchData();
    }
  };

  const totalSales = orders.reduce((sum, o) => sum + o.finalAmount, 0);
  const totalOrders = orders.length;

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tight">Executive <span className="gradient-text">Insights</span></h1>
          <p className="text-text-muted font-bold text-sm uppercase tracking-[0.2em]">Operational oversight & analytics</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 glass-card flex items-center gap-3 font-bold text-sm hover:bg-white/5 border-glass-border">
            <TrendingUp size={18} className="text-primary" /> Real-time Analytics
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {[
          { label: 'Total Revenue', value: `Rs. ${totalSales.toLocaleString()}`, icon: DollarSign, color: 'from-primary/20 to-primary/5', border: 'border-primary/20' },
          { label: 'Total Orders', value: totalOrders, icon: BarChart3, color: 'from-secondary/20 to-secondary/5', border: 'border-secondary/20' },
          { label: 'Menu Items', value: menu.length, icon: Package, color: 'from-accent/20 to-accent/5', border: 'border-accent/20' },
          { label: 'Active Users', value: '128', icon: Users, color: 'from-success/20 to-success/5', border: 'border-success/20' }
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className={`glass-panel p-8 flex items-center justify-between border-t-4 ${stat.border} hover:scale-[1.02] transition-transform`}
          >
            <div className="space-y-1">
              <p className="text-text-muted text-xs font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-4xl font-black">{stat.value}</h3>
            </div>
            <div className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} shadow-2xl shadow-black/40`}>
              <stat.icon size={32} className="text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Inventory Management */}
        <div className="xl:col-span-1 space-y-8">
           <div className="glass-panel p-10 border-b-4 border-primary">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <Plus size={28} className="text-primary"/> Manage Store
            </h2>
            <form onSubmit={handleAddItem} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Item Title</label>
                <input 
                  type="text" placeholder="e.g. Vanilla Latte Premium" className="modern-input"
                  value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Price (Rs.)</label>
                  <input 
                    type="number" className="modern-input"
                    value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Category</label>
                  <select 
                    className="modern-input bg-bg-deep appearance-none"
                    value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    required
                  >
                    <option value="All">All</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-vibrant w-full mt-4 py-5 font-black uppercase tracking-widest text-xs">Authorize Listing</button>
            </form>
           </div>

           <div className="glass-panel p-10">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black">Menu Snapshot</h3>
                <span className="text-[10px] font-black px-3 py-1 bg-white/5 rounded-full border border-glass-border">{menu.length} Items</span>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
              {menu.map(item => (
                <div key={item.id} className="flex justify-between items-center glass-card p-5 group hover:bg-white/[0.03]">
                  <div className="space-y-1">
                    <p className="font-black text-sm group-hover:text-primary transition-colors">{item.name}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase text-text-muted">{item.category}</span>
                        <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                        <p className="text-xs font-black text-primary">Rs. {item.price}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="p-3 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-xl transition-all duration-300">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
           </div>
        </div>

        {/* Sales Oversight */}
        <div className="xl:col-span-2 glass-panel p-12 overflow-hidden relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <div className="space-y-1">
                <h2 className="text-3xl font-black">Trade Intelligence</h2>
                <p className="text-text-muted font-bold text-[10px] uppercase tracking-widest">Global transaction ledger</p>
            </div>
            <button className="bg-white/5 hover:bg-primary hover:text-white px-8 py-4 rounded-2xl border border-glass-border font-black uppercase text-xs tracking-widest flex items-center gap-3 transition-all duration-500 shadow-xl active:scale-95">
              <Download size={20} /> Export Audit Logs (PDF/XLS)
            </button>
          </div>
          
          <div className="modern-table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Segment</th>
                  <th>Revenue</th>
                  <th>Gateway</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>
                       <span className="font-mono text-sm opacity-60 font-medium">#{order.id.slice(-8).toUpperCase()}</span>
                       <p className="text-[10px] text-text-muted mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="font-bold text-sm">
                      <div className="flex flex-col">
                        <span>{order.items.length} Asset(s)</span>
                        <span className="text-[10px] text-text-muted font-medium italic">{order.items[0]?.name}{order.items.length > 1 && '...'}</span>
                      </div>
                    </td>
                    <td>
                       <span className="text-lg font-black text-primary">Rs. {order.finalAmount}</span>
                    </td>
                    <td>
                       <span className="px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-black uppercase border border-glass-border tracking-widest">{order.paymentMethod}</span>
                    </td>
                    <td className="text-center">
                       <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${
                         order.status === 'completed' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                       }`}>
                         {order.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 opacity-20 space-y-6">
                <Search size={64} />
                <p className="text-2xl font-black uppercase tracking-[0.4em]">Historical Void</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
