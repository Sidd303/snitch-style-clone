import { supabase } from '@/integrations/supabase/client';

export interface DbReview {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Fetch profiles separately
  const userIds = [...new Set(data.map(r => r.user_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', userIds);

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
  
  return data.map(review => ({
    ...review,
    profile: profileMap.get(review.user_id) || null
  })) as DbReview[];
}

export async function getUserReviews(userId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as DbReview[];
}

export async function createReview(review: {
  user_id: string;
  product_id: string;
  rating: number;
  title?: string;
  comment?: string;
}) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();

  if (error) {
    // Handle duplicate review error
    if (error.code === '23505') {
      throw new Error('You have already reviewed this product');
    }
    throw error;
  }
  return data as DbReview;
}

export async function updateReview(id: string, updates: {
  rating?: number;
  title?: string;
  comment?: string;
}) {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DbReview;
}

export async function deleteReview(id: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getProductRating(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)
    .eq('is_approved', true);

  if (error) throw error;

  if (!data || data.length === 0) {
    return { average: 0, count: 0 };
  }

  const total = data.reduce((sum, r) => sum + r.rating, 0);
  return {
    average: Math.round((total / data.length) * 10) / 10,
    count: data.length
  };
}

// Admin functions
export async function getAllReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profile:profiles (
        full_name
      ),
      product:products (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function approveReview(id: string, approved: boolean) {
  const { data, error } = await supabase
    .from('reviews')
    .update({ is_approved: approved })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DbReview;
}
