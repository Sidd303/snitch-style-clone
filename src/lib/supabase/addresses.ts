import { supabase } from '@/integrations/supabase/client';

export interface DbAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  street: string;
  apartment: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAddresses(userId: string) {
  const { data, error } = await supabase
    .from('shipping_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as DbAddress[];
}

export async function getAddress(id: string) {
  const { data, error } = await supabase
    .from('shipping_addresses')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as DbAddress | null;
}

export async function getDefaultAddress(userId: string) {
  const { data, error } = await supabase
    .from('shipping_addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .maybeSingle();

  if (error) throw error;
  return data as DbAddress | null;
}

export async function createAddress(address: Omit<DbAddress, 'id' | 'created_at' | 'updated_at'>) {
  // If setting as default, unset other defaults first
  if (address.is_default) {
    await supabase
      .from('shipping_addresses')
      .update({ is_default: false })
      .eq('user_id', address.user_id);
  }

  const { data, error } = await supabase
    .from('shipping_addresses')
    .insert(address)
    .select()
    .single();

  if (error) throw error;
  return data as DbAddress;
}

export async function updateAddress(id: string, updates: Partial<Omit<DbAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
  // Get the address first to check user_id
  const { data: existing } = await supabase
    .from('shipping_addresses')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!existing) throw new Error('Address not found');

  // If setting as default, unset other defaults first
  if (updates.is_default) {
    await supabase
      .from('shipping_addresses')
      .update({ is_default: false })
      .eq('user_id', existing.user_id);
  }

  const { data, error } = await supabase
    .from('shipping_addresses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DbAddress;
}

export async function deleteAddress(id: string) {
  const { error } = await supabase
    .from('shipping_addresses')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
