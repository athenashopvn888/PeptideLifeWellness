'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NO_CARD_NOTICE, PAYMENT_NOTICE, PRICE_TBA_NOTE } from '@/lib/order-request/constants';
import { useCatalogueCart } from '@/components/catalogue-cart/CatalogueCartProvider';
import CartLineList from '@/components/catalogue-cart/CartLineList';

export default function CartPageView() {
  const router = useRouter();
  const { lines, ready } = useCatalogueCart();

  if (!ready) {
    return <p className="rounded-3xl border border-[#c5d7e0] bg-white px-6 py-12 text-center text-sm font-semibold text-[#526f82]" aria-live="polite">Loading your cart.</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-[#c5d7e0] bg-white px-6 py-12 text-center shadow-[0_12px_35px_rgba(6,27,58,0.06)]">
        <h2 className="text-2xl font-black text-[#13283b]">Your cart is empty</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#566169]">Add catalogue listings to request a quote. {PRICE_TBA_NOTE}.</p>
        <Link href="/products" className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#123d63] px-6 text-sm font-bold text-white transition hover:bg-[#061b3a]">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CartLineList />
      <div className="rounded-3xl border border-[#9bbbc8] bg-white p-5 sm:p-7">
        <p className="text-base font-black text-[#13283b]">{PRICE_TBA_NOTE}</p>
        <p className="mt-2 text-sm leading-relaxed text-[#334450]">{PAYMENT_NOTICE}</p>
        <p className="mt-2 text-sm leading-relaxed text-[#334450]">{NO_CARD_NOTICE}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="button" id="cart-continue" onClick={() => router.push('/order')} className="inline-flex h-12 items-center justify-center rounded-full bg-[#123d63] px-6 text-sm font-bold text-white transition hover:bg-[#061b3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123d63]">
            Continue to order
          </button>
          <Link href="/products" className="inline-flex h-12 items-center justify-center rounded-full border border-[#8caebb] bg-white px-6 text-sm font-bold text-[#123d63] transition hover:border-[#123d63] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123d63]">
            Continue browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
