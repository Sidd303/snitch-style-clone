import { supabase } from '@/integrations/supabase/client';

export interface DbWishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    original_price: number | null;
    images: string[];
    is_sale: boolean;
    is_new: boolean;
  };
}

export async function getWishlist(userId: string) {
  const { data, error } = await supabase
    .from('wishlists')
    .select(`
      *,
      product:products (
        id,
        name,
        price,
        original_price,
        images,
        is_sale,
        is_new
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as DbWishlistItem[];
}

export async function addToWishlist(userId: string, productId: string) {
  const { data, error } = await supabase
    .from('wishlists')
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();

  if (error) {
    // Handle duplicate error gracefully
    if (error.code === '23505') {
      return null; // Already in wishlist
    }
    throw error;
  }
  return data;
}

export async function removeFromWishlist(userId: string, productId: string) {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
}

export async function isInWishlist(userId: string, productId: string) {
  const { data, error } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}
