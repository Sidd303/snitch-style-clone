import { supabase } from '@/integrations/supabase/client';

export interface DbOrder {
  id: string;
  user_id: string | null;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: Record<string, any>;
  billing_address: Record<string, any> | null;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string | null;
  payment_id: string | null;
  coupon_code: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  quantity: number;
  size: string | null;
  color: string | null;
  price: number;
  created_at: string;
}

export async function getOrders(userId?: string) {
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as DbOrder[];
}

export async function getOrder(orderId: string) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();

  if (orderError) throw orderError;
  if (!order) return null;

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (itemsError) throw itemsError;

  return { order: order as DbOrder, items: items as DbOrderItem[] };
}

export async function getOrderByNumber(orderNumber: string) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .maybeSingle();

  if (orderError) throw orderError;
  if (!order) return null;

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  if (itemsError) throw itemsError;

  return { order: order as DbOrder, items: items as DbOrderItem[] };
}

export async function createOrder(
  orderData: {
    user_id?: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone?: string | null;
    shipping_address: Record<string, any>;
    billing_address?: Record<string, any> | null;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    discount: number;
    total: number;
    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method?: string | null;
    payment_id?: string | null;
    coupon_code?: string | null;
    notes?: string | null;
  },
  items: {
    product_id?: string | null;
    product_name: string;
    product_image?: string | null;
    quantity: number;
    size?: string | null;
    color?: string | null;
    price: number;
  }[]
) {
  // Create order - cast to any to bypass type mismatch until types are regenerated
  const insertData = {
    user_id: orderData.user_id || null,
    customer_name: orderData.customer_name,
    customer_email: orderData.customer_email,
    customer_phone: orderData.customer_phone || null,
    shipping_address: orderData.shipping_address,
    billing_address: orderData.billing_address || null,
    subtotal: orderData.subtotal,
    shipping_cost: orderData.shipping_cost,
    tax: orderData.tax,
    discount: orderData.discount,
    total: orderData.total,
    status: orderData.status || 'pending',
    payment_status: orderData.payment_status || 'pending',
    payment_method: orderData.payment_method || null,
    payment_id: orderData.payment_id || null,
    coupon_code: orderData.coupon_code || null,
    notes: orderData.notes || null
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(insertData as any)
    .select()
    .single();

  if (orderError) throw orderError;

  // Create order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id || null,
    product_name: item.product_name,
    product_image: item.product_image || null,
    quantity: item.quantity,
    size: item.size || null,
    color: item.color || null,
    price: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order as DbOrder;
}

export async function updateOrderStatus(orderId: string, status: DbOrder['status']) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data as DbOrder;
}

export async function updatePaymentStatus(orderId: string, paymentStatus: DbOrder['payment_status'], paymentId?: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ 
      payment_status: paymentStatus,
      payment_id: paymentId 
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data as DbOrder;
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as DbOrder[];
}
