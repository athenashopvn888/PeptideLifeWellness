import Image from 'next/image';
import Link from 'next/link';
import type { DraftProduct } from '@/lib/data/draftProducts';

export default function DraftProductCard({ product }: { product: DraftProduct }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#bdd5df] bg-gradient-to-b from-white to-[#e4f4f8] shadow-[0_12px_35px_rgba(6,27,58,0.08)] transition hover:-translate-y-1 hover:border-[#81a9b8] hover:shadow-[0_20px_45px_rgba(6,27,58,0.14)]">
      <Link href={`/products/${product.slug}`} className="block" aria-label={`View details for ${product.name} ${product.strength}`}>
        <div className="relative aspect-square overflow-hidden border-b border-[#cbdde4] bg-[radial-gradient(circle_at_50%_32%,#ffffff_0%,#e7f6f9_58%,#cbdfe6_100%)]">
          <div className="absolute inset-x-[12%] bottom-[8%] h-[8%] rounded-full bg-[#65717a]/15 blur-xl" />
          <Image
            src={product.image}
            alt={`Nova Pure Labs ${product.name} ${product.strength} research vial`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#526f82] sm:text-xs">{product.category}</p>
          <h2 className="mt-2 min-h-12 text-base font-bold leading-tight text-[#202327] sm:text-lg">{product.name}</h2>
          <p className="mt-1 text-sm font-semibold text-[#5f686f]">{product.strength}</p>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#cfd4d7] pt-4">
            <span className="text-lg font-black text-[#202327]">TBA</span>
            <span className="rounded-full bg-[#526f82] px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-[#344f61]">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
