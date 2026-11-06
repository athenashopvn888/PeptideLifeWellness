'use client';

import Image from 'next/image';
import { useCatalogueCart } from '@/components/catalogue-cart/CatalogueCartProvider';
import QuantityStepper from '@/components/catalogue-cart/QuantityStepper';

export default function CartLineList() {
  const { lines, updateQuantity, removeItem } = useCatalogueCart();

  return (
    <ul className="space-y-3" aria-label="Cart items">
      {lines.map((line) => {
        const label = `${line.name} ${line.strength}`;
        return (
          <li key={line.slug} className="flex gap-4 rounded-2xl border border-[#c5d7e0] bg-white p-4 shadow-[0_10px_30px_rgba(6,27,58,0.05)]">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[#d5e3ea] bg-[radial-gradient(circle_at_50%_32%,#ffffff_0%,#e7f6f9_58%,#cbdfe6_100%)]">
              <Image src={line.image} alt="" fill sizes="96px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-black leading-tight text-[#13283b] sm:text-lg">{line.name}</h2>
              <p className="mt-1 text-sm font-semibold text-[#1d4a68]">{line.strength}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <QuantityStepper
                  id={`line-qty-${line.slug}`}
                  label={`Quantity for ${label}`}
                  value={line.quantity}
                  onChange={(quantity) => updateQuantity(line.slug, quantity)}
                />
                <button
                  type="button"
                  onClick={() => removeItem(line.slug)}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#c5d5de] px-4 text-sm font-bold text-[#40586b] transition hover:border-[#123d63] hover:text-[#061b3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123d63]"
                >
                  Remove <span className="sr-only">{label}</span>
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
