import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calculator, FlaskConical, ShieldCheck } from 'lucide-react';
import DraftProductCard from '@/components/products/DraftProductCard';
import { draftProducts } from '@/lib/data/draftProducts';

export const metadata: Metadata = {
  title: { absolute: 'Nova Pure Labs | Research Products' },
  description: 'Explore the Nova Pure Labs draft research product catalogue, educational guides, calculator, and safety information.',
  alternates: { canonical: 'https://peptidelifewellness.com' },
};

const resources = [
  { href: '/calculator', label: 'Research Calculator', detail: 'A simple calculation tool.', icon: Calculator },
  { href: '/guides', label: 'Guide Library', detail: 'Browse educational articles.', icon: BookOpen },
  { href: '/safety-canada', label: 'Safety Information', detail: 'Read the research-use guidance.', icon: ShieldCheck },
];

export default function HomePage() {
  return (
    <div className="bg-white text-black">
      <section className="relative isolate overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_70%_20%,#777_0,transparent_35%),linear-gradient(120deg,#000_40%,#222_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(120deg,transparent_0%,white_48%,transparent_55%)]" />
        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.08fr] lg:px-8 lg:py-24">
          <div className="z-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/50">Nova Pure Labs</p>
            <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-[-0.045em] sm:text-7xl">
              Research products.<br /><span className="text-white/55">Clearly presented.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              Explore the new Nova Pure Labs draft catalogue. Product details are available now, with pricing and ordering information coming soon.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition hover:bg-[#dedede]">
                View Products <ArrowRight size={17} />
              </Link>
              <Link href="/guides" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/5">
                Research Guides
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.2em] text-white/40">
              <FlaskConical size={16} /> For research use only
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[560px]" aria-label="Nova Pure Labs product collection">
            <div className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute left-[2%] top-[15%] w-[44%] -rotate-6 overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-black/50">
              <Image src="/products/nova-pure-drafts/bpc-157-10mg.png" alt="BPC-157 10 mg Nova Pure Labs research vial" width={1024} height={1024} priority className="h-auto w-full" />
            </div>
            <div className="absolute left-[31%] top-[2%] z-20 w-[48%] overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl shadow-black/60">
              <Image src="/products/nova-pure-drafts/retatrutide-10mg.png" alt="Retatrutide 10 mg Nova Pure Labs research vial" width={1024} height={1024} priority className="h-auto w-full" />
            </div>
            <div className="absolute right-[-1%] top-[19%] w-[42%] rotate-6 overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-black/50">
              <Image src="/products/nova-pure-drafts/ghk-cu-100mg.png" alt="GHK-Cu 100 mg Nova Pure Labs research vial" width={1024} height={1024} priority className="h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#ececea]">
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-black/10 px-4 sm:px-6 lg:px-8">
          {[
            ['18', 'Draft products'],
            ['TBA', 'Pricing status'],
            ['Details', 'Available to view'],
          ].map(([value, label]) => (
            <div key={label} className="px-3 py-7 text-center sm:py-9">
              <p className="text-xl font-black sm:text-3xl">{value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45 sm:text-xs">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f5f5f3] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/45">New catalogue</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Featured products</h2>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-black transition hover:gap-3">
              View all 18 products <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {draftProducts.slice(0, 8).map((product) => <DraftProductCard key={product.slug} product={product} />)}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/45">Simple by design</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">The information you need, without the clutter.</h2>
            <p className="mt-6 max-w-xl leading-relaxed text-black/60">
              Each draft listing shows the confirmed product name and strength. Pricing, availability, and supporting product information will be added only when finalized.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {resources.map(({ href, label, detail, icon: Icon }) => (
              <Link key={href} href={href} className="group rounded-2xl border border-black/10 bg-[#f5f5f3] p-6 transition hover:-translate-y-1 hover:border-black/30 hover:bg-white hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white"><Icon size={20} /></div>
                <h3 className="mt-5 font-bold">{label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/50">{detail}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em]">Open <ArrowRight size={13} className="transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <ShieldCheck size={30} className="text-white/70" />
          <h2 className="mt-4 text-2xl font-black sm:text-3xl">Research use only</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55">
            Products shown in this draft catalogue are not available to order. They are presented for research catalogue planning and are not for human consumption.
          </p>
          <Link href="/safety-canada" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white">Read safety information <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  );
}
