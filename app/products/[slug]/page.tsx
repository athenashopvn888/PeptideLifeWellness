import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink, FileCheck2, FileText, FlaskConical, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import DraftProductCard from '@/components/products/DraftProductCard';
import { draftProducts, getDraftProduct } from '@/lib/data/draftProducts';

export function generateStaticParams() {
  return draftProducts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getDraftProduct(slug);
  if (!product) return { title: 'Product not found' };
  return {
    title: `${product.name} ${product.strength}`,
    description: `${product.name} ${product.strength} research catalogue listing from Nova Pure Labs. Price TBA.`,
    alternates: { canonical: `https://peptidelifewellness.com/products/${product.slug}` },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getDraftProduct(slug);
  if (!product) notFound();

  const relatedProducts = product.relatedSlugs
    .map((relatedSlug) => getDraftProduct(relatedSlug))
    .filter((relatedProduct) => relatedProduct !== undefined);

  return (
    <div className="min-h-screen bg-[#eaf8fc] text-[#202327]">
      <div className="border-b border-[#bfd8e1] bg-[linear-gradient(135deg,#ffffff,#dceff5)] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-[#526f82] transition hover:text-[#202327]"><ArrowLeft size={16} /> All products</Link>
        </div>
      </div>

      <section className="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-[460px] bg-[linear-gradient(135deg,#dde1e4,#ffffff_48%,#cfd4d8)]" />
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#bfc5ca] bg-white/85 shadow-[0_30px_80px_rgba(32,35,39,.14)] backdrop-blur">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-square border-b border-[#ccd1d5] bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#edf0f2_60%,#d1d6da_100%)] lg:border-b-0 lg:border-r">
              <div className="absolute inset-x-[18%] bottom-[8%] h-[9%] rounded-full bg-[#52606a]/15 blur-2xl" />
              <Image src={product.image} alt={`Nova Pure Labs ${product.name} ${product.strength} research vial`} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#526f82]">{product.category}</p>
              <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#1d2023] sm:text-5xl">{product.name}</h1>
              <p className="mt-3 text-xl font-semibold text-[#606b73]">{product.strength}</p>

              <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#c7ccd0] bg-[#c7ccd0]">
                <div className="bg-[linear-gradient(145deg,#ffffff,#edf0f1)] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#69747b]">Price</p><p className="mt-2 text-3xl font-black">TBA</p></div>
                <div className="bg-[linear-gradient(145deg,#ffffff,#edf0f1)] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#69747b]">COA status</p><p className="mt-2 text-base font-black">{product.coa?.status === 'available' ? 'Available' : 'Not yet posted'}</p></div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#9bbbc8] bg-[linear-gradient(135deg,#e6f5f9,#ffffff)] p-5 shadow-[0_12px_30px_rgba(6,27,58,.07)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#123d63] text-white"><FileCheck2 size={21} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#526f82]">Certificate of Analysis</p>
                    {product.coa?.status === 'available' && product.coa.documentUrl ? (
                      <>
                        <p className="mt-2 text-sm leading-relaxed text-[#566169]">Review the posted certificate and confirm its batch or lot number matches the product record.</p>
                        <a href={product.coa.documentUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#123d63] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#061b3a]">View COA <ExternalLink size={15} /></a>
                      </>
                    ) : (
                      <>
                        <p className="mt-2 text-sm leading-relaxed text-[#566169]">A product-specific certificate has not been posted. No purity, identity, or batch result is implied.</p>
                        <Link href="/coa" className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#8caebb] bg-white px-5 py-2.5 text-sm font-bold text-[#123d63] transition hover:border-[#123d63]">Check COA Library <ArrowRight size={15} /></Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                {product.catalogueFacts.map((fact) => <p key={fact} className="flex items-start gap-3 text-sm font-medium text-[#59636a]"><FlaskConical className="mt-0.5 shrink-0 text-[#526f82]" size={18} /> {fact}</p>)}
              </div>

              <div className="mt-8 rounded-2xl border border-[#aeb8bf] bg-[linear-gradient(135deg,#e7ebed,#f9fafa)] p-5">
                <p className="flex items-center gap-2 text-sm font-bold text-[#202327]"><ShieldCheck size={18} className="text-[#526f82]" /> Research-use catalogue listing</p>
                <p className="mt-2 text-sm leading-relaxed text-[#657078]">Ordering is not yet available. This product is presented for laboratory research planning only and is not for human consumption.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-3xl border border-[#c7ccd0] bg-white p-7 shadow-[0_16px_45px_rgba(32,35,39,.07)] sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#526f82]">Research overview</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">About {product.name}</h2>
            <p className="mt-6 text-base leading-8 text-[#566169]">{product.overview}</p>
            <div className="mt-8 rounded-2xl border border-[#d0d5d8] bg-[#f0f2f3] p-5 text-sm leading-relaxed text-[#626d74]">
              This summary describes published research context. It does not establish the identity, purity, suitability, or performance of this catalogue item.
            </div>
          </article>

          <aside className="rounded-3xl border border-[#bfc6cb] bg-[linear-gradient(145deg,#e8ebed,#ffffff)] p-7 shadow-[0_16px_45px_rgba(32,35,39,.07)] sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#526f82] text-white"><FileText size={20} /></div>
            <h2 className="mt-5 text-xl font-black">Research references</h2>
            {product.researchReferences.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {product.researchReferences.map((reference) => (
                  <li key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer" className="group flex items-start justify-between gap-4 rounded-xl border border-[#c7ccd0] bg-white/75 p-4 text-sm font-semibold text-[#526f82] transition hover:border-[#7d939f] hover:bg-white"><span>{reference.label}</span><ExternalLink size={15} className="mt-0.5 shrink-0 transition group-hover:translate-x-0.5" /></a></li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-[#647077]">No composition-specific research reference is listed because the blend details have not yet been supplied.</p>
            )}
            <p className="mt-6 border-t border-[#c5cbd0] pt-5 text-xs leading-relaxed text-[#6c767d]">External references are provided for general research context and are not product certificates or usage instructions.</p>
          </aside>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="border-t border-[#bfd8e1] bg-[linear-gradient(135deg,#d8edf4,#f2fbfd)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.26em] text-[#526f82]">Continue browsing</p><h2 className="mt-3 text-2xl font-black sm:text-3xl">Related catalogue products</h2></div><Link href="/products" className="hidden items-center gap-2 text-sm font-bold text-[#526f82] sm:inline-flex">All products <ArrowRight size={16} /></Link></div>
            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:gap-6">{relatedProducts.map((relatedProduct) => <DraftProductCard key={relatedProduct.slug} product={relatedProduct} />)}</div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
