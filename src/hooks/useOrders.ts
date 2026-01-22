import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getOrders, 
  getOrder, 
  getOrderByNumber, 
  createOrder, 
  updateOrderStatus, 
  getAllOrders,
  DbOrder 
} from '@/lib/supabase/orders';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => getOrders(user?.id),
    enabled: !!user,
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });
}

export function useOrderByNumber(orderNumber: string) {
  return useQuery({
    queryKey: ['order', 'number', orderNumber],
    queryFn: () => getOrderByNumber(orderNumber),
    enabled: !!orderNumber,
  });
}

export function useAllOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: getAllOrders,
    enabled: !!user?.isAdmin,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      orderData, 
      items 
    }: { 
      orderData: Parameters<typeof createOrder>[0];
      items: Parameters<typeof createOrder>[1];
    }) => {
      return createOrder(
        { ...orderData, user_id: user?.id || null },
        items
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Order placed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: DbOrder['status'] }) =>
      updateOrderStatus(orderId, status),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      toast.success('Order status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
