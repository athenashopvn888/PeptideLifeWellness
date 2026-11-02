import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calculator, FileSearch, FlaskConical, ShieldCheck } from 'lucide-react';
import DraftProductCard from '@/components/products/DraftProductCard';
import { draftProducts } from '@/lib/data/draftProducts';

export const metadata: Metadata = {
  title: { absolute: 'Nova Pure Labs | Research Products' },
  description: 'Explore the Nova Pure Labs research product catalogue, educational guides, calculator, and safety information.',
  alternates: { canonical: 'https://peptidelifewellness.com' },
};

const resources = [
  { href: '/calculator', label: 'Research Calculator', detail: 'A focused calculation tool for laboratory planning.', icon: Calculator },
  { href: '/guides', label: 'Guide Library', detail: 'Educational articles and research terminology.', icon: BookOpen },
  { href: '/safety-canada', label: 'Safety Information', detail: 'Research-use boundaries and handling context.', icon: ShieldCheck },
];

const catalogueStandards = [
  ['Clear identification', 'Every listing displays the supplied product name and strength.'],
  ['Honest status', 'Pricing and documentation remain clearly marked until confirmed.'],
  ['Research context', 'Background summaries link to published scientific literature.'],
];

export default function HomePage() {
  return (
    <div className="bg-[#f7f8f8] text-[#202327]">
      <section className="relative isolate overflow-hidden border-b border-[#bcc2c8] bg-[linear-gradient(135deg,#ffffff_0%,#edf0f2_42%,#cbd0d5_100%)]">
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(115deg,transparent_0%,rgba(255,255,255,.9)_38%,transparent_52%),repeating-linear-gradient(90deg,rgba(255,255,255,.24)_0,rgba(255,255,255,.24)_1px,transparent_1px,transparent_9px)]" />
        <div className="absolute -left-28 top-10 h-80 w-80 rounded-full border border-white/80 bg-white/30 blur-2xl" />
        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-24">
          <div className="z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#aeb6bc] bg-white/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#526f82] shadow-sm backdrop-blur sm:text-xs">
              <FlaskConical size={14} /> Nova Pure Labs
            </div>
            <h1 className="mt-6 text-5xl font-black leading-[0.96] tracking-[-0.05em] text-[#17191c] sm:text-7xl">Precision in<br /><span className="text-[#66727b]">every detail.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-[#4f585f] sm:text-lg">A modern research catalogue built around clear product identification, sourced scientific context, and transparent listing status.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-[#202327] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#202327]/15 transition hover:bg-[#526f82]">View Products <ArrowRight size={17} /></Link>
              <Link href="/guides" className="inline-flex items-center gap-2 rounded-full border border-[#9da6ad] bg-white/55 px-7 py-3.5 text-sm font-semibold text-[#202327] backdrop-blur transition hover:border-[#526f82] hover:bg-white">Research Guides</Link>
            </div>
            <div className="mt-10 flex items-center gap-3 border-t border-[#aeb5bb] pt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#68737b]"><ShieldCheck size={16} /> For research use only</div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[560px]" aria-label="Nova Pure Labs product collection">
            <div className="absolute left-1/2 top-1/2 h-[84%] w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-[radial-gradient(circle,#ffffff_0%,rgba(255,255,255,.58)_50%,transparent_72%)] shadow-[inset_0_0_70px_rgba(82,111,130,.16)]" />
            <div className="absolute inset-x-[12%] bottom-[6%] h-[11%] rounded-full bg-[#34434e]/20 blur-2xl" />
            <div className="absolute left-[2%] top-[15%] w-[44%] -rotate-6 overflow-hidden rounded-3xl border border-white bg-white/80 shadow-[0_30px_60px_rgba(32,35,39,.22)]"><Image src="/products/nova-pure-drafts/bpc-157-10mg.png" alt="BPC-157 10 mg Nova Pure Labs research vial" width={1254} height={1254} priority className="h-auto w-full" /></div>
            <div className="absolute left-[31%] top-[2%] z-20 w-[48%] overflow-hidden rounded-3xl border border-white bg-white shadow-[0_35px_75px_rgba(32,35,39,.28)] ring-1 ring-[#aeb5bb]/60"><Image src="/products/nova-pure-drafts/retatrutide-10mg.png" alt="Retatrutide 10 mg Nova Pure Labs research vial" width={1254} height={1254} priority className="h-auto w-full" /></div>
            <div className="absolute right-[-1%] top-[19%] w-[42%] rotate-6 overflow-hidden rounded-3xl border border-white bg-white/80 shadow-[0_30px_60px_rgba(32,35,39,.22)]"><Image src="/products/nova-pure-drafts/ghk-cu-100mg.png" alt="GHK-Cu 100 mg Nova Pure Labs research vial" width={1254} height={1254} priority className="h-auto w-full" /></div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#c8cdd2] bg-[#e3e6e8]">
        <div className="mx-auto grid max-w-7xl gap-px bg-[#c6cbd0] sm:grid-cols-3">
          {[["18", "Research products"], ["TBA", "Pricing status"], ["18", "Detailed listings"]].map(([value, label]) => (
            <div key={label} className="bg-[linear-gradient(145deg,#f9fafa,#e4e7e9)] px-5 py-7 text-center sm:py-9"><p className="text-2xl font-black text-[#202327] sm:text-3xl">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#65717a] sm:text-xs">{label}</p></div>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f8f8] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.28em] text-[#526f82]">New catalogue</p><h2 className="mt-3 text-3xl font-black tracking-tight text-[#202327] sm:text-5xl">Featured products</h2></div><Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-[#526f82] transition hover:gap-3 hover:text-[#202327]">View all 18 products <ArrowRight size={17} /></Link></div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">{draftProducts.slice(0, 8).map((product) => <DraftProductCard key={product.slug} product={product} />)}</div>
        </div>
      </section>

      <section className="border-y border-[#c5cbd0] bg-[linear-gradient(135deg,#d9dde0_0%,#f8f9f9_48%,#dfe3e6_100%)] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-[#526f82]">Catalogue standards</p><h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#202327] sm:text-5xl">Clear information.<br />No borrowed claims.</h2><p className="mt-6 max-w-xl leading-relaxed text-[#59636a]">Product pages separate confirmed catalogue facts from research background. Testing, availability, and documentation are never implied before they are posted.</p></div>
          <div className="grid gap-4 sm:grid-cols-3">{catalogueStandards.map(([title, detail], index) => <div key={title} className="rounded-2xl border border-white/90 bg-white/70 p-6 shadow-[0_16px_35px_rgba(32,35,39,.09)] backdrop-blur"><span className="text-xs font-black text-[#526f82]">0{index + 1}</span><h3 className="mt-6 font-bold text-[#202327]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#667078]">{detail}</p></div>)}</div>
        </div></div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-[#526f82]">Research resources</p><h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#202327] sm:text-5xl">Useful tools, presented with restraint.</h2><p className="mt-6 max-w-xl leading-relaxed text-[#5d676e]">Browse educational material and research-use information without mixing it into unsupported product marketing.</p></div>
        <div className="grid gap-4 sm:grid-cols-3">{resources.map(({ href, label, detail, icon: Icon }) => <Link key={href} href={href} className="group rounded-2xl border border-[#c8cdd2] bg-[linear-gradient(145deg,#ffffff,#eef0f1)] p-6 transition hover:-translate-y-1 hover:border-[#7e949f] hover:shadow-xl"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#526f82] text-white shadow-md"><Icon size={20} /></div><h3 className="mt-5 font-bold text-[#202327]">{label}</h3><p className="mt-2 text-sm leading-relaxed text-[#667078]">{detail}</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em] text-[#526f82]">Open <ArrowRight size={13} className="transition group-hover:translate-x-1" /></span></Link>)}</div>
      </div></section>

      <section className="border-y border-white/10 bg-[#202327] px-4 py-14 text-white sm:px-6 lg:px-8"><div className="mx-auto flex max-w-4xl flex-col items-center text-center"><FileSearch size={30} className="text-[#c7d0d6]" /><h2 className="mt-4 text-2xl font-black sm:text-3xl">Research use only</h2><p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">Catalogue products are not available to order and are not for human consumption. Pricing, availability, and supporting documentation will be posted only when confirmed.</p><Link href="/safety-canada" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white">Read safety information <ArrowRight size={16} /></Link></div></section>
    </div>
  );
}
