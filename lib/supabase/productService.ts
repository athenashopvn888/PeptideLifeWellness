import { createClient } from '@supabase/supabase-js';
import { products as localProducts } from '@/lib/data/products';
import type { Product } from '@/lib/data/products';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// ════════════════════════════════════════════════
// DATABASE → FRONTEND TYPE MAPPING
// ════════════════════════════════════════════════

interface DBProduct {
  id: string;
  slug: string;
  sku: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  category: string;
  price: number;
  compare_price: number | null;
  image: string;
  images: string[];
  badge: string | null;
  purity: string | null;
  volume: string | null;
  details: string[];
  pubmed_refs: { title: string; url: string; journal: string }[] | null;
  status: 'published' | 'draft' | 'coming_soon' | 'sold_out';
  stock_quantity: number;
  low_stock_threshold: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function dbToProduct(row: DBProduct): Product & { status: string; stockQuantity: number } {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle || '',
    description: row.description || '',
    category: row.category,
    price: Number(row.price),
    comparePrice: row.compare_price ? Number(row.compare_price) : undefined,
    image: row.image,
    images: row.images || [],
    rating: 0,
    reviewCount: 0,
    inStock: row.status === 'published' && row.stock_quantity > 0,
    badge: row.badge || undefined,
    details: row.details || [],
    purity: row.purity || undefined,
    volume: row.volume || undefined,
    pubmedRefs: row.pubmed_refs || undefined,
    status: row.status,
    stockQuantity: row.stock_quantity,
  };
}

// ════════════════════════════════════════════════
// PUBLIC QUERIES (for storefront)
// ════════════════════════════════════════════════

export async function getPublishedProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabase();
    if (!supabase) return localProducts;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('status', ['published', 'coming_soon', 'sold_out'])
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Supabase products fetch failed or empty, using local fallback:', error?.message);
      return localProducts;
    }

    return data.map(dbToProduct);
  } catch {
    console.warn('Supabase unavailable, using local product fallback');
    return localProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const supabase = getSupabase();
    if (!supabase) return localProducts.find((p) => p.slug === slug);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      // Fallback to local
      return localProducts.find((p) => p.slug === slug);
    }

    return dbToProduct(data);
  } catch {
    return localProducts.find((p) => p.slug === slug);
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (category === 'all' || !category) return getPublishedProducts();

  try {
    const supabase = getSupabase();
    if (!supabase) {
      return localProducts.filter(
        (p) => p.category.toLowerCase().replace(/[\s&]+/g, '-').replace(/-+/g, '-') === category.toLowerCase()
      );
    }
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .in('status', ['published', 'coming_soon', 'sold_out'])
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return localProducts.filter(
        (p) => p.category.toLowerCase().replace(/[\s&]+/g, '-').replace(/-+/g, '-') === category.toLowerCase()
      );
    }

    return data.map(dbToProduct);
  } catch {
    return localProducts.filter(
      (p) => p.category.toLowerCase().replace(/[\s&]+/g, '-').replace(/-+/g, '-') === category.toLowerCase()
    );
  }
}

// ════════════════════════════════════════════════
// ADMIN QUERIES (all products, unrestricted)
// ════════════════════════════════════════════════

export async function getAllProductsAdmin(): Promise<(Product & { status: string; stockQuantity: number })[]> {
  try {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error || !data) {
      throw new Error(error?.message || 'No data');
    }

    return data.map(dbToProduct);
  } catch (err) {
    console.error('Admin products fetch failed:', err);
    return [];
  }
}

export async function updateProduct(
  id: string,
  updates: Partial<{
    name: string;
    subtitle: string;
    description: string;
    category: string;
    price: number;
    compare_price: number | null;
    image: string;
    badge: string | null;
    purity: string;
    volume: string;
    details: string[];
    status: string;
    stock_quantity: number;
    sort_order: number;
  }>
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return dbToProduct(data);
}

export async function adjustStock(
  productId: string,
  quantityChange: number,
  changeType: 'intake' | 'sale' | 'adjustment' | 'return',
  notes?: string
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');

  // Get current stock
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('stock_quantity')
    .eq('id', productId)
    .single();

  if (fetchError || !product) throw new Error('Product not found');

  const newQuantity = product.stock_quantity + quantityChange;
  if (newQuantity < 0) throw new Error('Stock cannot go negative');

  // Update stock
  const { error: updateError } = await supabase
    .from('products')
    .update({ stock_quantity: newQuantity })
    .eq('id', productId);

  if (updateError) throw new Error(updateError.message);

  // Log history
  const { error: historyError } = await supabase
    .from('inventory_history')
    .insert({
      product_id: productId,
      change_type: changeType,
      quantity_change: quantityChange,
      quantity_after: newQuantity,
      notes: notes || null,
      created_by: 'admin',
    });

  if (historyError) console.error('Failed to log inventory history:', historyError.message);

  return { newQuantity };
}

export async function getInventoryHistory(productId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('inventory_history')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  return data || [];
}
