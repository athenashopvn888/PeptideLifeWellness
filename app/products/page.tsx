import type { Metadata } from 'next';
import Image from 'next/image';
import DraftProductCard from '@/components/products/DraftProductCard';
import { draftProducts } from '@/lib/data/draftProducts';

export const metadata: Metadata = {
  title: 'Research Products',
  description: 'Browse the Nova Pure Labs draft research product catalogue. Product pricing is coming soon.',
  alternates: { canonical: 'https://peptidelifewellness.com/products' },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#eaf8fc] text-[#202327]">
      <section className="relative overflow-hidden border-b border-[#b7d3de] bg-[linear-gradient(135deg,#f8fdff_0%,#e1f3f8_55%,#c5e3ed_100%)] px-4 py-16 sm:py-24">
        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(115deg,transparent_0%,white_42%,transparent_58%),repeating-linear-gradient(90deg,rgba(255,255,255,.35)_0,rgba(255,255,255,.35)_1px,transparent_1px,transparent_10px)]" />
        <Image src="/images/nova-arctic/molecular-structure-square.png" alt="" width={440} height={443} className="absolute -right-20 -top-32 h-[420px] w-[420px] rounded-full object-cover opacity-20 mix-blend-multiply sm:right-[18%]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#526f82]">Nova Pure Labs</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-[#202327] sm:text-6xl">Research product catalogue</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#566169] sm:text-lg">
              Browse {draftProducts.length} clearly identified research listings with sourced background information. Pricing and ordering details remain TBA.
            </p>
          </div>
          <div className="relative hidden aspect-square overflow-hidden rounded-[2rem] border border-white/80 bg-white/55 shadow-[0_28px_60px_rgba(32,35,39,.16)] ring-1 ring-[#aeb7bd]/50 md:block">
            <Image src="/images/nova-arctic/blank-vials-square.png" alt="Unlabelled laboratory vials" fill sizes="360px" className="object-cover" priority />
            <div className="absolute inset-0 bg-[linear-gradient(145deg,transparent_55%,rgba(0,188,212,.16))]" />
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
