import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { products } from '@/lib/data/products';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'novapure2026';

export async function POST(req: NextRequest) {
  const auth = req.headers.get('x-admin-password');
  if (auth !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({
      error: `Missing Supabase env vars. URL present: ${!!url}, Key present: ${!!key}. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel Environment Variables and redeploy.`,
    }, { status: 500 });
  }

  try {
    const supabase = createClient(url, key);

    // Check if products already exist
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({
        message: `Database already has ${existing.length}+ products. Skipping seed.`,
        skipped: true,
      });
    }

    // Map local products to DB schema
    const rows = products.map((p, i) => ({
      slug: p.slug,
      sku: p.id,
      name: p.name,
      subtitle: p.subtitle,
      description: p.description,
      category: p.category,
      price: p.price,
      compare_price: p.comparePrice || null,
      image: p.image,
      images: p.images,
      badge: p.badge || null,
      purity: p.purity || null,
      volume: p.volume || null,
      details: p.details,
      pubmed_refs: p.pubmedRefs || [],
      status: 'published' as const,
      stock_quantity: 50,
      low_stock_threshold: 5,
      sort_order: i,
    }));

    const { data, error } = await supabase
      .from('products')
      .insert(rows)
      .select();

    if (error) throw error;

    return NextResponse.json({
      message: `Successfully seeded ${data?.length || 0} products`,
      count: data?.length || 0,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
