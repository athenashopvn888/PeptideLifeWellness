import type { Metadata } from 'next';
import Link from 'next/link';
import CompactPageHeader from '@/components/layout/CompactPageHeader';
import { NO_CARD_NOTICE, ORDER_REFERENCE_PATTERN, PAYMENT_NOTICE, PRICE_TBA_NOTE } from '@/lib/order-request/constants';

export const metadata: Metadata = {
  title: 'Order confirmation',
  description: 'Your Nova Pure Labs order request reference and the next steps.',
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.reference) ? params.reference[0] : params.reference;
  const reference = raw && ORDER_REFERENCE_PATTERN.test(raw) ? raw : null;

  return (
    <div className="min-h-screen bg-[#eaf8fc] text-[#202327]">
      <CompactPageHeader
        eyebrow="Order request"
        title={reference ? 'Request received' : 'Order reference'}
        description="Keep this page for your records. Nothing has been charged."
      />
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-3xl border border-[#c5d7e0] bg-white p-6 shadow-[0_12px_35px_rgba(6,27,58,0.06)] sm:p-8">
          {reference ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#526f82]">Order reference</p>
              <p className="mt-3 break-all font-mono text-2xl font-black tracking-wide text-[#061b3a] sm:text-3xl" aria-live="polite">{reference}</p>
              <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-[#334450]">
                <li>Save the reference {reference}.</li>
                <li>{PRICE_TBA_NOTE}.</li>
                <li>{PAYMENT_NOTICE}</li>
                <li>{NO_CARD_NOTICE} Do not send a transfer until the quote email arrives.</li>
                <li>These products are for laboratory research use only, not for human or animal consumption.</li>
              </ol>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black text-[#13283b]">No order reference is attached to this page</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#566169]">If you just submitted a request, the confirmation link includes a reference that starts with NPL-. You can return to the cart and submit the request again.</p>
            </>
          )}
          <Link href="/products" className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-[#123d63] px-6 text-sm font-bold text-white transition hover:bg-[#061b3a]">Back to products</Link>
        </div>
      </section>
    </div>
  );
}
