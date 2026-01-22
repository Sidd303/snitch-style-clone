import { supabase } from '@/integrations/supabase/client';

export interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  sku: string | null;
  category_id: string | null;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_sale: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export async function getProducts(options?: {
  categoryId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}) {
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' });

  if (options?.isActive !== undefined) {
    query = query.eq('is_active', options.isActive);
  }
  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId);
  }
  if (options?.isFeatured) {
    query = query.eq('is_featured', true);
  }
  if (options?.isNew) {
    query = query.eq('is_new', true);
  }
  if (options?.isSale) {
    query = query.eq('is_sale', true);
  }
  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) throw error;
  return { products: data as DbProduct[], count };
}

export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as DbProduct | null;
}

export async function createProduct(product: Omit<DbProduct, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data as DbProduct;
}

export async function updateProduct(id: string, updates: Partial<Omit<DbProduct, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DbProduct;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function uploadProductImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return publicUrl;
}
