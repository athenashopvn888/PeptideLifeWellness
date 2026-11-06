'use client';

import { useState } from 'react';
import DraftProductCard from '@/components/products/DraftProductCard';
import { catalogueGroups, type CatalogueGroup, type DraftProduct } from '@/lib/data/draftProducts';

const filters = ['All', ...catalogueGroups] as const;

export default function ProductCatalogue({ products }: { products: DraftProduct[] }) {
  const [group, setGroup] = useState<(typeof filters)[number]>('All');
  const visible = group === 'All' ? products : products.filter((product) => product.catalogueGroup === (group as CatalogueGroup));

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#526f82]">Browse</p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-[#13283b] sm:text-2xl">
            {visible.length} {visible.length === 1 ? 'listing' : 'listings'}
          </h2>
        </div>
        <span className="rounded-full border border-[#c5d0d6] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#526f82]">Prices TBA</span>
      </div>

      <div className="relative mt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 pr-6" role="toolbar" aria-label="Filter by catalogue group">
          {filters.map((option) => {
            const selected = group === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => setGroup(option)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${selected ? 'border-[#123d63] bg-[#123d63] text-white' : 'border-[#c5d5de] bg-white text-[#40586b] hover:border-[#123d63]'}`}
              >
                {option}
              </button>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#eaf8fc] to-transparent sm:hidden" aria-hidden="true" />
      </div>
      <p className="mt-3 max-w-3xl text-xs leading-relaxed text-[#6a7c88]">Groups organize the catalogue. They are not indications, instructions, or statements about effects.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((product) => <DraftProductCard key={product.slug} product={product} />)}
      </div>
    </div>
  );
}
