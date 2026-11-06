import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileClock, FlaskConical, SearchCheck } from 'lucide-react';
import CompactPageHeader from '@/components/layout/CompactPageHeader';
import { draftProducts, postedCoaCount } from '@/lib/data/draftProducts';

export const metadata: Metadata = {
  title: 'Certificate of Analysis Library',
  description: 'Check Nova Pure Labs Certificate of Analysis availability by product and review how to match a certificate to its batch or lot.',
  alternates: { canonical: 'https://peptidelifewellness.com/coa' },
};

const matchingSteps = [
  ['Choose the product', 'Open the certificate listed for the exact product and strength.'],
  ['Match the batch or lot', 'Confirm the identifier on the certificate matches the product record or vial.'],
  ['Review the test details', 'Check the laboratory, testing date, methods, and reported results on the original document.'],
];

export default function CoaLibraryPage() {
  const availableCount = postedCoaCount();

  return (
    <div className="min-h-screen bg-[#eaf8fc] text-[#18222a]">
      <CompactPageHeader
        eyebrow="Documentation centre"
        title="Certificate of Analysis Library"
        description="Certificates appear here only after a genuine product- and batch-specific document is supplied. Pending means nothing has been posted."
        aside={
          <div className="grid w-full max-w-sm grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#c5d7e0] bg-[#c5d7e0]">
            <div className="bg-white px-4 py-3"><p className="text-2xl font-black text-[#13283b]">{draftProducts.length}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#617b8a]">Catalogue items</p></div>
            <div className="bg-white px-4 py-3"><p className="text-2xl font-black text-[#13283b]">{availableCount} of {draftProducts.length}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#617b8a]">COAs posted</p></div>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#526f82]">Documentation status</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Browse by product</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#607078]">Pending means no certificate has been supplied for publication. It does not represent a passing or failing result.</p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {draftProducts.map((product) => {
            const isAvailable = product.coa?.status === 'available' && Boolean(product.coa.documentUrl);
            return (
              <article key={product.slug} className="overflow-hidden rounded-2xl border border-[#b9d2dc] bg-white shadow-[0_12px_32px_rgba(6,27,58,.07)]">
                <div className="grid grid-cols-[96px_1fr] sm:grid-cols-[112px_1fr]">
                  <Link href={`/products/${product.slug}`} className="relative min-h-32 overflow-hidden border-r border-[#d2e0e5] bg-[radial-gradient(circle_at_50%_35%,#fff,#e8f5f8_70%,#d2e5eb)]" aria-label={`View ${product.name} ${product.strength}`}>
                    <Image src={product.image} alt="" fill sizes="112px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-col p-4">
                    <h3 className="text-base font-black leading-tight text-[#18222a]">{product.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-[#1d4a68]">{product.strength}</p>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8aa0ad]">{product.category}</p>
                    <div className="mt-auto pt-3">
                      {isAvailable ? (
                        <a href={product.coa?.documentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#123d63] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#061b3a]"><CheckCircle2 size={14} /> View COA</a>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#b2c8d1] bg-[#edf6f9] px-3.5 py-1.5 text-xs font-bold text-[#526f82]"><FileClock size={14} /> COA pending</span>
                      )}
                    </div>
                  </div>
                </div>
                <Link href={`/products/${product.slug}`} className="flex items-center justify-between border-t border-[#d6e2e7] px-4 py-2.5 text-xs font-bold text-[#526f82] transition hover:bg-[#edf7fa] hover:text-[#123d63]">View product details <ArrowRight size={14} /></Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#b8d4df] bg-[linear-gradient(135deg,#d8edf4,#f8fdff)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#526f82]">How to read a certificate</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">Three checks before you rely on a document</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {matchingSteps.map(([title, detail], index) => (
              <article key={title} className="rounded-2xl border border-white bg-white/75 p-5 shadow-[0_14px_35px_rgba(6,27,58,.07)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#123d63] text-sm font-black text-white">{index + 1}</div>
                <h3 className="mt-4 font-black text-[#18222a]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#607078]">{detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#a9c5d0] bg-[#eef9fc] p-4 text-sm leading-6 text-[#52646f]"><SearchCheck className="mt-0.5 shrink-0 text-[#123d63]" size={20} /><p>A COA is not interchangeable between products or batches. If the identifiers do not match, treat the document as unrelated to that item.</p></div>
        </div>
      </section>

      <section className="bg-[#061b3a] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center"><FlaskConical className="text-[#b9d7e1]" size={28} /><h2 className="mt-4 text-2xl font-black">Documentation without assumptions</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">Nova Pure Labs does not publish placeholder purity values, duplicate certificates, or unsupported batch claims. Product documentation will be added only when the original matching record is available.</p><Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#061b3a]">Browse products <ArrowRight size={16} /></Link></div>
      </section>
    </div>
  );
}
