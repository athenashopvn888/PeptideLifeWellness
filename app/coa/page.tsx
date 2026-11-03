import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileCheck2, FileClock, FlaskConical, SearchCheck } from 'lucide-react';
import { draftProducts } from '@/lib/data/draftProducts';

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
  const availableCount = draftProducts.filter((product) => product.coa?.status === 'available' && product.coa.documentUrl).length;

  return (
    <div className="min-h-screen bg-[#eaf8fc] text-[#18222a]">
      <section className="relative isolate overflow-hidden border-b border-[#9fc1cf] bg-[#061b3a] px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8">
        <Image src="/images/nova-arctic/arctic-lab-wide.png" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center opacity-35" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,27,58,.98)_0%,rgba(8,48,80,.9)_52%,rgba(8,77,103,.52)_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-20 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.2)_0,rgba(255,255,255,.2)_1px,transparent_1px,transparent_12px)]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#dce8ed] backdrop-blur sm:text-xs"><FileCheck2 size={15} /> Documentation centre</div>
            <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl">Certificate of Analysis Library</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Check documentation availability for each Nova Pure Labs catalogue item. Certificates appear here only after a genuine product- and batch-specific document is supplied.</p>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/25 bg-white/20 shadow-2xl backdrop-blur">
            <div className="bg-[#061b3a]/65 p-6"><p className="text-3xl font-black">{draftProducts.length}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">Catalogue items</p></div>
            <div className="bg-[#061b3a]/65 p-6"><p className="text-3xl font-black">{availableCount}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">COAs posted</p></div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#b8d4df] bg-[linear-gradient(135deg,#d8edf4,#f8fdff)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            {matchingSteps.map(([title, detail], index) => (
              <article key={title} className="rounded-2xl border border-white bg-white/75 p-6 shadow-[0_14px_35px_rgba(6,27,58,.07)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#123d63] text-sm font-black text-white">{index + 1}</div>
                <h2 className="mt-5 font-black text-[#18222a]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#607078]">{detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#a9c5d0] bg-[#eef9fc] p-5 text-sm leading-6 text-[#52646f]"><SearchCheck className="mt-0.5 shrink-0 text-[#123d63]" size={20} /><p>A COA is not interchangeable between products or batches. If the identifiers do not match, treat the document as unrelated to that item.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#526f82]">Documentation status</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Browse by product</h2></div>
          <p className="max-w-md text-sm leading-6 text-[#607078]">Pending means no certificate has been supplied for publication. It does not represent a passing or failing result.</p>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {draftProducts.map((product) => {
            const isAvailable = product.coa?.status === 'available' && Boolean(product.coa.documentUrl);
            return (
              <article key={product.slug} className="group overflow-hidden rounded-2xl border border-[#b9d2dc] bg-white shadow-[0_12px_32px_rgba(6,27,58,.07)] transition hover:-translate-y-0.5 hover:border-[#789ead] hover:shadow-[0_18px_40px_rgba(6,27,58,.12)]">
                <div className="grid grid-cols-[112px_1fr]">
                  <Link href={`/products/${product.slug}`} className="relative min-h-40 overflow-hidden border-r border-[#d2e0e5] bg-[radial-gradient(circle_at_50%_35%,#fff,#e8f5f8_70%,#d2e5eb)]" aria-label={`View ${product.name} ${product.strength}`}>
                    <Image src={product.image} alt="" fill sizes="112px" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
                  </Link>
                  <div className="flex min-w-0 flex-col p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#617b8a]">{product.category}</p>
                    <h3 className="mt-2 text-lg font-black leading-tight text-[#18222a]">{product.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-[#667078]">{product.strength}</p>
                    <div className="mt-auto pt-5">
                      {isAvailable ? (
                        <a href={product.coa?.documentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#123d63] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#061b3a]"><CheckCircle2 size={15} /> View COA</a>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#b2c8d1] bg-[#edf6f9] px-4 py-2 text-xs font-bold text-[#526f82]"><FileClock size={15} /> COA pending</span>
                      )}
                    </div>
                  </div>
                </div>
                <Link href={`/products/${product.slug}`} className="flex items-center justify-between border-t border-[#d6e2e7] px-5 py-3 text-xs font-bold text-[#526f82] transition hover:bg-[#edf7fa] hover:text-[#123d63]">View product details <ArrowRight size={14} /></Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[#aac8d4] bg-[#061b3a] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center"><FlaskConical className="text-[#b9d7e1]" size={28} /><h2 className="mt-4 text-2xl font-black">Documentation without assumptions</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">Nova Pure Labs does not publish placeholder purity values, duplicate certificates, or unsupported batch claims. Product documentation will be added only when the original matching record is available.</p><Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#061b3a]">Browse products <ArrowRight size={16} /></Link></div>
      </section>
    </div>
  );
}
