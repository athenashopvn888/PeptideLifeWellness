import type { Metadata } from 'next';
import DraftProductCard from '@/components/products/DraftProductCard';
import { draftProducts } from '@/lib/data/draftProducts';

export const metadata: Metadata = {
  title: 'Research Products',
  description: 'Browse the Nova Pure Labs draft research product catalogue. Product pricing is coming soon.',
  alternates: { canonical: 'https://peptidelifewellness.com/products' },
};

export default function ProductsPage() {
  return (
    <div className="bg-[#f5f5f3] text-black">
      <section className="border-b border-white/10 bg-black px-4 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">Nova Pure Labs</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Research product catalogue</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            Explore the current draft collection. Product pricing and ordering details will be announced when available.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">Full collection</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{draftProducts.length} products</h2>
          </div>
          <span className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-black/60">Prices TBA</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {draftProducts.map((product) => <DraftProductCard key={product.slug} product={product} />)}
        </div>
      </section>
    </div>
  );
}
