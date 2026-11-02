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
    <div className="bg-[#eaf8fc] text-[#13283b]">
      <section className="relative isolate min-h-[600px] overflow-hidden border-b border-[#8fb6c5] bg-[#061b3a] sm:min-h-[560px]">
        <video
          aria-hidden="true"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/nova-arctic/arctic-lab-wide.png"
          className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
        >
          <source src="/videos/arctic-lab-loop.mp4" type="video/mp4" />
        </video>
        <Image src="/images/nova-arctic/arctic-lab-wide.png" alt="" fill sizes="100vw" priority className="hidden object-cover object-[68%_center] motion-reduce:block sm:object-center" />
        <div className="absolute inset-0 bg-[rgba(4,21,48,.78)] sm:bg-[linear-gradient(90deg,rgba(4,21,48,.92)_0%,rgba(4,35,65,.78)_38%,rgba(5,45,72,.22)_72%,rgba(255,255,255,.03)_100%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.2)_0,rgba(255,255,255,.2)_1px,transparent_1px,transparent_12px)]" />
        <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-center px-4 py-16 sm:min-h-[560px] sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e0e5]/45 bg-[#061b3a]/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#dce5ea] shadow-sm backdrop-blur sm:text-xs"><FlaskConical size={14} /> Nova Pure Labs</div>
            <h1 className="mt-6 text-5xl font-black leading-[0.96] tracking-[-0.05em] sm:text-7xl">Precision in<br /><span className="text-[#cbd5db]">every detail.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/78 sm:text-lg">A modern research catalogue built around clear product identification, sourced scientific context, and transparent listing status.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#061b3a] shadow-lg shadow-black/20 transition hover:bg-[#dce7ec]">View Products <ArrowRight size={17} /></Link>
              <Link href="/guides" className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-[#061b3a]/30 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white hover:bg-[#061b3a]/55">Research Guides</Link>
            </div>
            <div className="mt-10 flex items-center gap-3 border-t border-white/25 pt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#d1dce2]"><ShieldCheck size={16} /> For research use only</div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#bad4de] bg-[#d8edf4]">
        <div className="mx-auto grid max-w-7xl gap-px bg-[#b8d4df] sm:grid-cols-3">
          {[["18", "Research products"], ["TBA", "Pricing status"], ["18", "Detailed listings"]].map(([value, label]) => (
            <div key={label} className="bg-[linear-gradient(145deg,#f8fdff,#e0f2f7)] px-5 py-7 text-center sm:py-9"><p className="text-2xl font-black text-[#061b3a] sm:text-3xl">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#517083] sm:text-xs">{label}</p></div>
          ))}
        </div>
      </section>

      <section className="bg-[#eaf8fc] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.28em] text-[#526f82]">New catalogue</p><h2 className="mt-3 text-3xl font-black tracking-tight text-[#202327] sm:text-5xl">Featured products</h2></div><Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-[#526f82] transition hover:gap-3 hover:text-[#202327]">View all 18 products <ArrowRight size={17} /></Link></div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">{draftProducts.slice(0, 8).map((product) => <DraftProductCard key={product.slug} product={product} />)}</div>
        </div>
      </section>

      <section className="border-y border-[#b9d4df] bg-[linear-gradient(135deg,#cde7f0_0%,#f3fbfd_48%,#d8edf4_100%)] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-[#526f82]">Catalogue standards</p><h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#202327] sm:text-5xl">Clear information.<br />No borrowed claims.</h2><p className="mt-6 max-w-xl leading-relaxed text-[#59636a]">Product pages separate confirmed catalogue facts from research background. Testing, availability, and documentation are never implied before they are posted.</p></div>
          <div className="grid gap-4 sm:grid-cols-3">{catalogueStandards.map(([title, detail], index) => <div key={title} className="rounded-2xl border border-white/90 bg-white/70 p-6 shadow-[0_16px_35px_rgba(32,35,39,.09)] backdrop-blur"><span className="text-xs font-black text-[#526f82]">0{index + 1}</span><h3 className="mt-6 font-bold text-[#202327]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#667078]">{detail}</p></div>)}</div>
        </div></div>
      </section>

      <section className="bg-[#f2fbfd] px-4 py-16 sm:px-6 sm:py-24 lg:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-[#526f82]">Research resources</p><h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#202327] sm:text-5xl">Useful tools, presented with restraint.</h2><p className="mt-6 max-w-xl leading-relaxed text-[#5d676e]">Browse educational material and research-use information without mixing it into unsupported product marketing.</p><div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-[#c8d8df] shadow-[0_20px_45px_rgba(32,35,39,.12)]"><Image src="/images/nova-arctic/laboratory-glassware-square.png" alt="Arctic cyan laboratory glassware" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover object-[center_62%]" /><div className="absolute inset-0 ring-1 ring-inset ring-white/60" /></div></div>
        <div className="grid gap-4 sm:grid-cols-3">{resources.map(({ href, label, detail, icon: Icon }) => <Link key={href} href={href} className="group rounded-2xl border border-[#c8cdd2] bg-[linear-gradient(145deg,#ffffff,#eef0f1)] p-6 transition hover:-translate-y-1 hover:border-[#7e949f] hover:shadow-xl"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#526f82] text-white shadow-md"><Icon size={20} /></div><h3 className="mt-5 font-bold text-[#202327]">{label}</h3><p className="mt-2 text-sm leading-relaxed text-[#667078]">{detail}</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em] text-[#526f82]">Open <ArrowRight size={13} className="transition group-hover:translate-x-1" /></span></Link>)}</div>
      </div></section>

      <section className="border-y border-white/10 bg-[#061b3a] px-4 py-14 text-white sm:px-6 lg:px-8"><div className="mx-auto flex max-w-4xl flex-col items-center text-center"><FileSearch size={30} className="text-[#c7d0d6]" /><h2 className="mt-4 text-2xl font-black sm:text-3xl">Research use only</h2><p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">Catalogue products are not available to order and are not for human consumption. Pricing, availability, and supporting documentation will be posted only when confirmed.</p><Link href="/safety-canada" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white">Read safety information <ArrowRight size={16} /></Link></div></section>
    </div>
  );
}
