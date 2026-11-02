import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, FlaskConical, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { draftProducts, getDraftProduct } from '@/lib/data/draftProducts';

export function generateStaticParams() {
  return draftProducts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getDraftProduct(slug);
  if (!product) return { title: 'Product not found' };
  return {
    title: `${product.name} ${product.strength}`,
    description: `${product.name} ${product.strength} from the Nova Pure Labs draft research product catalogue. Price TBA.`,
    alternates: { canonical: `https://peptidelifewellness.com/products/${product.slug}` },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getDraftProduct(slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-[#f5f5f3] px-4 py-8 text-black sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-black/55 transition hover:text-black">
          <ArrowLeft size={16} /> All products
        </Link>

        <div className="mt-7 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl shadow-black/5">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-square bg-[#fafaf8]">
              <Image
                src={product.image}
                alt={`Nova Pure Labs ${product.name} ${product.strength} research vial`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/45">Nova Pure Labs</p>
              <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">{product.name}</h1>
              <p className="mt-3 text-xl font-semibold text-black/55">{product.strength}</p>

              <div className="mt-9 border-y border-black/10 py-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Price</p>
                <p className="mt-2 text-3xl font-black">TBA</p>
              </div>

              <div className="mt-7 space-y-4 text-sm leading-relaxed text-black/60">
                <p className="flex gap-3"><FlaskConical className="mt-0.5 shrink-0 text-black" size={19} /> Draft research product listing. Ordering is not yet available.</p>
                <p className="flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-black" size={19} /> For research use only. Not for human consumption.</p>
              </div>

              <div className="mt-9 rounded-2xl bg-black p-5 text-white">
                <p className="text-sm font-semibold">Product details are being finalized.</p>
                <p className="mt-1 text-sm text-white/60">Pricing and availability will be posted when confirmed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
