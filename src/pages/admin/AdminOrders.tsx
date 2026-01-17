import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/contexts/StoreContext';

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Orders</h1>

      <div className="bg-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50"><tr><th className="text-left p-4">Order ID</th><th className="text-left p-4">Customer</th><th className="text-left p-4">Date</th><th className="text-left p-4">Total</th><th className="text-left p-4">Status</th><th className="text-left p-4">Action</th></tr></thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No orders yet</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4">{order.customerName}</td>
                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">₹{order.total.toLocaleString()}</td>
                    <td className="p-4"><Badge className={getStatusColor(order.status)}>{order.status}</Badge></td>
                    <td className="p-4">
                      <Select value={order.status} onValueChange={v => updateOrderStatus(order.id, v as any)}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
