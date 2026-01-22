import { motion } from 'framer-motion';
import { Package, ShoppingCart, DollarSign, Clock, TrendingUp, Users } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useAllOrders } from '@/hooks/useOrders';

const AdminDashboard = () => {
  const { data: productsData, isLoading: productsLoading } = useProducts({ isActive: true });
  const { data: orders, isLoading: ordersLoading } = useAllOrders();

  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
  const paidOrders = orders?.filter(o => o.payment_status === 'paid').length || 0;

  const stats = [
    { 
      label: 'Total Products', 
      value: productsLoading ? '...' : productsData?.count || 0, 
      icon: Package, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Total Orders', 
      value: ordersLoading ? '...' : orders?.length || 0, 
      icon: ShoppingCart, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Total Revenue', 
      value: ordersLoading ? '...' : `₹${totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Pending Orders', 
      value: ordersLoading ? '...' : pendingOrders, 
      icon: Clock, 
      color: 'bg-orange-500' 
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your admin dashboard</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          {ordersLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-muted rounded" />
              ))}
            </div>
          ) : orders?.length === 0 ? (
            <p className="text-muted-foreground">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders?.slice(0, 5).map(order => (
                <div key={order.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">₹{Number(order.total).toLocaleString()}</span>
                    <p className="text-xs text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          {productsLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-14 bg-muted rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {productsData?.products?.slice(0, 5).map(product => (
                <div key={product.id} className="flex items-center gap-4">
                  <img 
                    src={product.images[0] || '/placeholder.svg'} 
                    alt={product.name} 
                    className="w-12 h-14 object-cover rounded" 
                  />
                  <div className="flex-1">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">₹{product.price}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Stock: {product.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
