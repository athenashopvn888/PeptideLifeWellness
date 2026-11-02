import Image from 'next/image';
import Link from 'next/link';
import type { DraftProduct } from '@/lib/data/draftProducts';

export default function DraftProductCard({ product }: { product: DraftProduct }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/products/${product.slug}`} className="block" aria-label={`View details for ${product.name} ${product.strength}`}>
        <div className="relative aspect-square overflow-hidden bg-[#f7f7f5]">
          <Image
            src={product.image}
            alt={`Nova Pure Labs ${product.name} ${product.strength} research vial`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">Research use only</p>
          <h2 className="mt-2 min-h-12 text-base font-bold leading-tight text-black sm:text-lg">{product.name}</h2>
          <p className="mt-1 text-sm font-medium text-black/55">{product.strength}</p>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/10 pt-4">
            <span className="text-lg font-bold text-black">TBA</span>
            <span className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-[#2b2b2b]">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
