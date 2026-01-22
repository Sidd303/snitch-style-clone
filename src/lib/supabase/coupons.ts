import { supabase } from '@/integrations/supabase/client';

export interface DbCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_purchase: number;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getCoupons() {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as DbCoupon[];
}

export async function getCoupon(id: string) {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as DbCoupon | null;
}

export async function getCouponByCode(code: string) {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data as DbCoupon | null;
}

export async function validateCoupon(code: string, subtotal: number): Promise<{
  valid: boolean;
  discount: number;
  message: string;
  coupon?: DbCoupon;
}> {
  const coupon = await getCouponByCode(code);

  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid coupon code' };
  }

  if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
    return { valid: false, discount: 0, message: 'Coupon has expired' };
  }

  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return { valid: false, discount: 0, message: 'Coupon usage limit reached' };
  }

  if (subtotal < coupon.min_purchase) {
    return { 
      valid: false, 
      discount: 0, 
      message: `Minimum purchase of ₹${coupon.min_purchase} required` 
    };
  }

  let discount = coupon.type === 'percentage' 
    ? (subtotal * coupon.value) / 100 
    : coupon.value;

  if (coupon.max_discount && discount > coupon.max_discount) {
    discount = coupon.max_discount;
  }

  return { 
    valid: true, 
    discount: Math.round(discount * 100) / 100, 
    message: 'Coupon applied successfully!',
    coupon 
  };
}

export async function createCoupon(coupon: Omit<DbCoupon, 'id' | 'used_count' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('coupons')
    .insert({ ...coupon, code: coupon.code.toUpperCase() })
    .select()
    .single();

  if (error) throw error;
  return data as DbCoupon;
}

export async function updateCoupon(id: string, updates: Partial<Omit<DbCoupon, 'id' | 'created_at' | 'updated_at'>>) {
  const updateData = { ...updates };
  if (updateData.code) {
    updateData.code = updateData.code.toUpperCase();
  }

  const { data, error } = await supabase
    .from('coupons')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DbCoupon;
}

export async function deleteCoupon(id: string) {
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function incrementCouponUsage(id: string) {
  const { data: coupon } = await supabase
    .from('coupons')
    .select('used_count')
    .eq('id', id)
    .single();

  if (!coupon) return;

  await supabase
    .from('coupons')
    .update({ used_count: coupon.used_count + 1 })
    .eq('id', id);
}
