import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, History, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BaseCrudService, formatPrice, DEFAULT_CURRENCY, useCurrency } from '@/integrations';
import { format } from 'date-fns';

export default function CreditPage() {
  const { user } = useAuth();
  const { currency } = useCurrency();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch transactions from a 'transactions' or 'credit_history' collection
    // For this demo, we'll mock some data based on the user's balance
    const mockTransactions = [
      { id: '1', type: 'payment', amount: 500, description: 'Order #ORD-001', date: new Date(Date.now() - 86400000) },
      { id: '2', type: 'topup', amount: 2000, description: 'Balance Recharge', date: new Date(Date.now() - 172800000) },
      { id: '3', type: 'payment', amount: 350, description: 'Order #ORD-005', date: new Date(Date.now() - 259200000) },
    ];
    setTransactions(mockTransactions);
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground uppercase tracking-tight">
          Credit & Wallet
        </h1>
        <p className="text-secondary-foreground font-paragraph text-sm mt-1">
          Manage your cafeteria credit balance and view transaction history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-sm uppercase tracking-widest opacity-80">Current Balance</span>
            </div>
            <h2 className="text-5xl font-bold mb-4">
              {formatPrice(user?.balance || 0, currency ?? DEFAULT_CURRENCY)}
            </h2>
            <div className="flex gap-4">
              <button className="bg-white text-[#0ea5e9] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-sky-50 transition-colors">
                Recharge Now
              </button>
              <button className="bg-white/10 border border-white/20 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-colors">
                Request Credit
              </button>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
        </motion.div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spent this month</p>
                <p className="text-xl font-bold text-slate-900">{formatPrice(1250, currency ?? DEFAULT_CURRENCY)}</p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[60%]" />
            </div>
          </div>

          <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Outstanding Credit</p>
                <p className="text-xl font-bold text-rose-900">{formatPrice(0, currency ?? DEFAULT_CURRENCY)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-lg font-bold text-slate-900 uppercase">Recent Transactions</h3>
          </div>
          <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === 'topup' ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {tx.type === 'topup' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{tx.description}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tx.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                    {format(tx.date, 'MMM dd, yyyy')}
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700">
                      Completed
                    </span>
                  </td>
                  <td className={`px-8 py-5 text-sm font-bold text-right ${
                    tx.type === 'topup' ? 'text-sky-600' : 'text-slate-900'
                  }`}>
                    {tx.type === 'topup' ? '+' : '-'}{formatPrice(tx.amount, currency ?? DEFAULT_CURRENCY)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const AlertTriangle = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);
