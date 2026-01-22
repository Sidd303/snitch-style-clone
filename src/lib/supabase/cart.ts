import { supabase } from '@/integrations/supabase/client';

export interface DbCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
}

export async function getCart(userId: string) {
  // First get the cart
  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (cartError) throw cartError;
  if (!cart) return { cartId: null, items: [] };

  // Then get cart items with product details
  const { data: items, error: itemsError } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products (
        id,
        name,
        price,
        images,
        stock
      )
    `)
    .eq('cart_id', cart.id);

  if (itemsError) throw itemsError;

  return { cartId: cart.id, items: items as DbCartItem[] };
}

export async function addToCart(cartId: string, productId: string, quantity: number, size?: string, color?: string) {
  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cartId)
    .eq('product_id', productId)
    .eq('size', size || '')
    .eq('color', color || '')
    .maybeSingle();

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Insert new item
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      cart_id: cartId,
      product_id: productId,
      quantity,
      size: size || null,
      color: color || null
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    return removeFromCart(itemId);
  }

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromCart(itemId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
}

export async function clearCart(cartId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId);

  if (error) throw error;
}
