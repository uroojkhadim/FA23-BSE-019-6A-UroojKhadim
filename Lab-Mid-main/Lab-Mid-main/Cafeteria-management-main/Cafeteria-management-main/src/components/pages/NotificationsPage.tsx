import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Package, CheckCircle2, AlertCircle, ShoppingBag, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function NotificationsPage() {
  const notifications = [
    { 
      id: 1, 
      title: 'Order Status Updated', 
      message: 'Your order #ORD-001 is now being prepared in the kitchen.', 
      type: 'order', 
      time: new Date(Date.now() - 1000 * 60 * 15), 
      read: false 
    },
    { 
      id: 2, 
      title: 'Payment Confirmed', 
      message: 'The online payment for order #ORD-002 has been successfully verified.', 
      type: 'payment', 
      time: new Date(Date.now() - 1000 * 60 * 60 * 2), 
      read: true 
    },
    { 
      id: 3, 
      title: 'Wallet Top-up Success', 
      message: 'Rs. 2000 has been added to your cafeteria wallet.', 
      type: 'wallet', 
      time: new Date(Date.now() - 1000 * 60 * 60 * 24), 
      read: true 
    },
    { 
      id: 4, 
      title: 'Lunch Special', 
      message: 'Special Biryani is now available! Get it before it runs out.', 
      type: 'info', 
      time: new Date(Date.now() - 1000 * 60 * 60 * 25), 
      read: true 
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-5 h-5 text-amber-600" />;
      case 'payment': return <CheckCircle2 className="w-5 h-5 text-sky-600" />;
      case 'wallet': return <Info className="w-5 h-5 text-sky-600" />;
      default: return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'order': return 'bg-amber-50';
      case 'payment': return 'bg-sky-50';
      case 'wallet': return 'bg-sky-50';
      default: return 'bg-slate-50';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground uppercase tracking-tight">
            Notifications
          </h1>
          <p className="text-secondary-foreground font-paragraph text-sm mt-1">
            Stay updated with your orders and cafeteria news.
          </p>
        </div>
        <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group p-6 rounded-3xl border transition-all duration-300 flex gap-6 ${
              notif.read ? 'bg-white border-slate-100 opacity-80' : 'bg-white border-primary/20 shadow-md ring-1 ring-primary/5'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center ${getBg(notif.type)}`}>
              {getIcon(notif.type)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className={`font-bold text-sm ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                  {notif.title}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">
                  {format(notif.time, 'hh:mm a • MMM dd')}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {notif.message}
              </p>
              {!notif.read && (
                <div className="pt-2">
                  <span className="w-2 h-2 bg-primary rounded-full inline-block" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center pt-8">
        <button className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
          View older notifications
        </button>
      </div>
    </div>
  );
}
