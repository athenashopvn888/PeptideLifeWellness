import Image from 'next/image';
import Link from 'next/link';
import type { DraftProduct } from '@/lib/data/draftProducts';

export default function DraftProductCard({ product }: { product: DraftProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#bdd5df] bg-gradient-to-b from-white to-[#e4f4f8] shadow-[0_12px_35px_rgba(6,27,58,0.08)] transition hover:-translate-y-1 hover:border-[#81a9b8] hover:shadow-[0_20px_45px_rgba(6,27,58,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123d63]"
    >
      <div className="relative aspect-square overflow-hidden border-b border-[#cbdde4] bg-[radial-gradient(circle_at_50%_32%,#ffffff_0%,#e7f6f9_58%,#cbdfe6_100%)]">
        <div className="absolute inset-x-[12%] bottom-[8%] h-[8%] rounded-full bg-[#65717a]/15 blur-xl" />
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-[1.035]"
        />
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <h2 className="text-base font-black leading-tight text-[#13283b] sm:text-lg">{product.name}</h2>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[#1d4a68]">{product.strength}</p>
          <span className="shrink-0 rounded-full border border-[#c5d0d6] bg-[#f4f8fa] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5c6e7c]">TBA</span>
        </div>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8aa0ad]">{product.category}</p>
        <span className="sr-only">View details for {product.name} {product.strength}</span>
      </div>
    </Link>
  );
}
