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
    <div className="min-h-screen bg-[#f7f8f8] text-[#202327]">
      <section className="relative overflow-hidden border-b border-[#bcc2c8] bg-[linear-gradient(135deg,#ffffff_0%,#e9ecee_55%,#cbd0d4_100%)] px-4 py-16 sm:py-24">
        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(115deg,transparent_0%,white_42%,transparent_58%),repeating-linear-gradient(90deg,rgba(255,255,255,.35)_0,rgba(255,255,255,.35)_1px,transparent_1px,transparent_10px)]" />
        <div className="mx-auto max-w-7xl">
          <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#526f82]">Nova Pure Labs</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-[#202327] sm:text-6xl">Research product catalogue</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#566169] sm:text-lg">
            Browse 18 clearly identified research listings with sourced background information. Pricing and ordering details remain TBA.
          </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#526f82]">Full collection</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{draftProducts.length} products</h2>
          </div>
          <span className="rounded-full border border-[#aeb7bd] bg-[linear-gradient(145deg,#ffffff,#e5e8ea)] px-4 py-2 text-xs font-bold text-[#526f82] shadow-sm">Prices TBA</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {draftProducts.map((product) => <DraftProductCard key={product.slug} product={product} />)}
        </div>
      </section>
    </div>
  );
}
