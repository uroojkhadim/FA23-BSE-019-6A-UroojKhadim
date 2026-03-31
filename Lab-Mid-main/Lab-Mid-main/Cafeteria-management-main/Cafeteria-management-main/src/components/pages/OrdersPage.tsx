import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Orders, Payments } from '@/entities';
import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { formatPaymentMethod, getPaymentStatusLabel } from '@/lib/payments';
import { parseOrderNotes } from '@/lib/orderWorkflow';
import { ORDER_STATUS_FLOW, getOrderStatusLabel, normalizeOrderStatus } from '@/lib/orderStatus';

interface OrderWithPayment extends Orders {
  paymentRecord?: Payments;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { currency } = useCurrency();
  const { user } = useAuthStore();

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    setIsLoading(true);

    if (!user || user.role === 'teacher') {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    try {
      const [ordersResult, paymentsResult] = await Promise.all([
        BaseCrudService.getAll<Orders>('orders'),
        BaseCrudService.getAll<Payments>('payments')
      ]);

      const visibleOrders = ordersResult.items.filter((order) => {
        if (user.role === 'student') {
          return order.userId === user._id;
        }
        return user.role === 'admin';
      });

      const ordersWithPayments = visibleOrders.map((order) => ({
        ...order,
        paymentRecord: paymentsResult.items.find((payment) => payment.orderReference === order._id),
      }));

      const sortedOrders = ordersWithPayments.sort((a, b) => {
        const dateA = a._createdDate ? new Date(a._createdDate).getTime() : 0;
        const dateB = b._createdDate ? new Date(b._createdDate).getTime() : 0;
        return dateB - dateA;
      });
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (normalizeOrderStatus(status)) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-foreground" strokeWidth={1.5} />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-destructive" strokeWidth={1.5} />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-accent" strokeWidth={1.5} />;
      case 'in_process':
        return <Package className="w-5 h-5 text-foreground" strokeWidth={1.5} />;
      default:
        return <Clock className="w-5 h-5 text-foreground" strokeWidth={1.5} />;
    }
  };

  // Role-based content display
  const getRoleSpecificContent = () => {
    if (!user) {
      return {
        title: 'Order Status',
        description: 'Sign in to view role-based order activity.'
      };
    }
    
    switch (user.role) {
      case 'student':
        return {
          title: 'My Orders',
          description: 'Track your food orders and pickup status'
        };
      case 'teacher':
        return {
          title: 'Orders Restricted',
          description: 'Order details are private and visible only to administrators and the student who placed the order.'
        };
      case 'admin':
        return {
          title: 'All Orders',
          description: 'Review all orders, payment methods, and fulfillment progress.'
        };
      default:
        return {
          title: 'Order Status',
          description: 'Track your orders'
        };
    }
  };

  const roleContent = getRoleSpecificContent();
  const statuses = ['all', ...ORDER_STATUS_FLOW, ...(orders.some((order) => normalizeOrderStatus(order.status) === 'cancelled') ? ['cancelled'] : [])];

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => normalizeOrderStatus(order.status) === statusFilter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-24">
        {/* Page Header */}
        <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground uppercase mb-4">
            {roleContent.title}
          </h1>
          <p className="font-paragraph text-base text-secondary-foreground mb-4">
            {roleContent.description}
          </p>
          <div className="w-16 h-1 bg-foreground"></div>
        </section>

        {/* Status Filter */}
        {user && user.role !== 'teacher' && (
          <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="flex flex-wrap gap-4">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`font-paragraph text-sm uppercase tracking-wide px-6 py-3 border transition-colors ${
                    statusFilter === status
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-transparent text-foreground border-secondary hover:border-foreground'
                  }`}
                >
                  {status === 'all' ? 'All' : getOrderStatusLabel(status)}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Orders List */}
        <section className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 min-h-[360px] sm:min-h-[520px]">
          {!user ? (
            <div className="text-center py-24">
              <p className="font-paragraph text-lg text-foreground">
                Sign in to see the order features available for your role.
              </p>
            </div>
          ) : user.role === 'teacher' ? (
            <div className="text-center py-24">
              <p className="font-paragraph text-lg text-foreground">
                Order details are visible only to administrators and the student who placed the order.
              </p>
            </div>
          ) : isLoading ? null : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const parsedNotes = parseOrderNotes(order.notes);

                return (
                  <motion.div
                    key={order._id}
                    className="border border-secondary p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                  >
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12 md:col-span-8">
                        <div className="flex items-start gap-4 mb-4">
                          {getStatusIcon(order.status)}
                          <div className="flex-1">
                            <h3 className="font-heading text-xl text-foreground uppercase mb-2">
                              Order #{order.orderNumber}
                            </h3>
                            <div className="space-y-1">
                              <p className="font-paragraph text-sm text-foreground">
                                Status: <span className="uppercase">{getOrderStatusLabel(order.status)}</span>
                              </p>
                              {order._createdDate && (
                                <p className="font-paragraph text-sm text-foreground">
                                  Placed: {format(new Date(order._createdDate), 'MMM dd, yyyy HH:mm')}
                                </p>
                              )}
                              {order.paymentMethod && (
                                <p className="font-paragraph text-sm text-foreground">
                                  Payment: {formatPaymentMethod(order.paymentMethod)}
                                </p>
                              )}
                              {parsedNotes.discountCode && (
                                <p className="font-paragraph text-sm text-foreground">
                                  Redeemed Offer: {parsedNotes.discountCode}
                                </p>
                              )}
                              {order.paymentRecord && (
                                <p className="font-paragraph text-sm text-foreground">
                                  Payment Status: {getPaymentStatusLabel(order.paymentRecord.paymentStatus)}
                                </p>
                              )}
                              {(parsedNotes.paymentReference || order.paymentRecord?.transactionId) && (
                                <p className="font-paragraph text-sm text-foreground">
                                  Reference: {parsedNotes.paymentReference || order.paymentRecord?.transactionId}
                                </p>
                              )}
                              {parsedNotes.customerNote && (
                                <p className="font-paragraph text-sm text-foreground">
                                  Notes: {parsedNotes.customerNote}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-4 flex flex-col justify-between">
                        <div className="text-left md:text-right">
                          <p className="font-paragraph text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                            Total
                          </p>
                          <p className="font-heading text-2xl text-foreground">
                            {formatPrice(order.totalPrice || 0, currency ?? DEFAULT_CURRENCY)}
                          </p>
                          {parsedNotes.discountAmount ? (
                            <p className="font-paragraph text-sm text-accent mt-2">
                              Saved {formatPrice(parsedNotes.discountAmount, currency ?? DEFAULT_CURRENCY)}
                            </p>
                          ) : null}
                        </div>
                        <div className="text-left md:text-right mt-4">
                          <span className={`inline-block px-3 py-1 text-xs font-paragraph uppercase tracking-wide ${
                            order.paymentRecord?.paymentStatus === 'completed' || order.isPaid
                              ? 'bg-foreground text-background'
                              : 'border border-secondary text-foreground'
                          }`}>
                            {getPaymentStatusLabel(order.paymentRecord?.paymentStatus || (order.isPaid ? 'completed' : 'pending'))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-paragraph text-lg text-foreground">
                No orders found.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
