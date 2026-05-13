import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Orders, Payments } from '@/entities';
import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { formatPaymentMethod, getPaymentStatusLabel } from '@/lib/payments';
import { parseOrderNotes } from '@/lib/orderWorkflow';
import { ORDER_STATUS_FLOW, getOrderStatusLabel, normalizeOrderStatus } from '@/lib/orderStatus';
import { RealtimeService } from '@/lib/RealtimeService';

interface OrderWithPayment extends Orders {
  paymentRecord?: Payments;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { currency } = useCurrency();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    
    // Setup real-time listener for orders
    const unsubOrders = RealtimeService.subscribeToCollection('orders', (allOrders) => {
      // Filter based on role
      let visibleOrders = allOrders;
      if (user.role === 'student' || user.role === 'teacher' || user.role === 'university_staff') {
        visibleOrders = allOrders.filter(o => o.userId === user.uid || o.userId === user._id);
      }

      // Fetch payments statically or we could also subscribe if needed
      // For now, let's just use the orders feed which is most critical
      const sortedOrders = visibleOrders.sort((a, b) => {
        const dateA = a._createdDate ? new Date(a._createdDate).getTime() : 0;
        const dateB = b._createdDate ? new Date(b._createdDate).getTime() : 0;
        return dateB - dateA;
      });

      setOrders(sortedOrders);
      setIsLoading(false);
    });

    return () => unsubOrders();
  }, [user]);

  const loadOrders = async () => {
    // This is now handled by the real-time listener in useEffect
  };


  const getStatusIcon = (status?: string) => {
    switch (normalizeOrderStatus(status)) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-sky-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-sky-600" />;
      case 'in_process':
        return <Package className="w-5 h-5 text-amber-600" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const StatusTracker = ({ currentStatus }: { currentStatus?: string }) => {
    const status = normalizeOrderStatus(currentStatus);
    const steps = [
      { id: 'ordered', label: 'Pending' },
      { id: 'accepted', label: 'Pending' },
      { id: 'in_process', label: 'Preparing' },
      { id: 'ready', label: 'Ready' },
      { id: 'delivered', label: 'Completed' }
    ];
    
    const currentIndex = steps.findIndex(s => s.id === status);
    if (status === 'cancelled') return <div className="text-rose-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><XCircle className="w-4 h-4" /> Order Cancelled</div>;

    return (
      <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <React.Fragment key={step.id}>
              {/* Skip duplicate Pending step in visual display if needed, but here we just show them */}
              {step.id === 'accepted' && steps[idx-1].label === 'Pending' ? null : (
                <>
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <div className={`w-3 h-3 rounded-full ${
                      isCompleted ? 'bg-primary' : 'bg-slate-200'
                    } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-tighter ${
                      isCompleted ? 'text-primary' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-[2px] w-8 sm:w-12 -mt-4 ${
                      idx < currentIndex ? 'bg-primary' : 'bg-slate-200'
                    }`} />
                  )}
                </>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Role-based content display
  const getRoleSpecificContent = () => {
    if (!user) return { title: 'Order Status', description: 'Sign in to view orders.' };
    
    switch (user.role) {
      case 'student': return { title: 'My Orders', description: 'Track your food orders and pickup status' };
      case 'teacher': return { title: 'Faculty Orders', description: 'View your order and credit history' };
      case 'admin': case 'super_admin': return { title: 'Order Management', description: 'Review and manage all cafeteria orders.' };
      default: return { title: 'Orders', description: 'Track your activity' };
    }
  };

  const roleContent = getRoleSpecificContent();
  const statuses = ['all', 'ordered', 'in_process', 'ready', 'delivered', 'cancelled'];

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => {
        const normalized = normalizeOrderStatus(order.status);
        if (statusFilter === 'ordered') return normalized === 'ordered' || normalized === 'accepted';
        return normalized === statusFilter;
      });


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground uppercase tracking-tight">
            {roleContent.title}
          </h1>
          <p className="text-secondary-foreground font-paragraph text-sm mt-1">
            {roleContent.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border-2 transition-all ${
                statusFilter === status
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary'
              }`}
            >
              {status === 'all' ? 'All' : getOrderStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse h-40" />
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="grid gap-6">
            {filteredOrders.map((order, index) => {
              const status = normalizeOrderStatus(order.status);
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="p-6 grid grid-cols-12 gap-6 items-center">
                    <div className="col-span-12 md:col-span-4 lg:col-span-3">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          status === 'delivered' ? 'bg-sky-50 text-sky-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">Order #{order.orderNumber}</h3>
                          <p className="text-xs text-slate-400 font-medium">
                            {order._createdDate ? format(new Date(order._createdDate), 'MMM dd, yyyy • hh:mm a') : 'Date unknown'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-5 lg:col-span-6">
                      <StatusTracker currentStatus={order.status} />
                    </div>

                    <div className="col-span-12 md:col-span-3 lg:col-span-3 text-right">
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-heading text-2xl font-bold text-primary">
                          {formatPrice(order.totalPrice || 0, currency ?? DEFAULT_CURRENCY)}
                        </span>
                        <div className="flex gap-2">
                          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            order.isPaid ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">
                            {formatPaymentMethod(order.paymentMethod)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <Package className="w-16 h-16 text-slate-200 mb-4" />
            <p className="font-heading text-xl text-slate-400 uppercase tracking-widest">No Orders Found</p>
          </div>
        )}
      </div>
    </div>
  );
}
