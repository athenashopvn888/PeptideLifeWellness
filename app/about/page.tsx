import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, FileClock, FlaskConical, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { draftProducts, postedCoaCount } from '@/lib/data/draftProducts';

export const metadata: Metadata = {
  title: 'About',
  description: 'Nova Pure Labs is a Canadian research catalogue with 19 listings. Pricing is TBA, and certificates of analysis are posted only when a matching document is available.',
};

const principles = [
  {
    icon: FlaskConical,
    title: 'Clear identification',
    desc: 'Each listing shows the supplied product name and strength, with a page of its own. Nothing in the catalogue is renamed for marketing.',
  },
  {
    icon: FileClock,
    title: 'Documentation in progress',
    desc: 'Certificate status stays pending until a product-specific document is supplied. A lot number on a listing is not a certificate of analysis.',
  },
  {
    icon: BookOpen,
    title: 'Research context, kept separate',
    desc: 'Guides, the calculator, and published references are educational material. They are not proof of identity, purity, or performance for a catalogue item.',
  },
  {
    icon: ShieldCheck,
    title: 'Research use only',
    desc: 'This site does not give medical advice, dosing guidance, or treatment claims. An order request asks for a quote. Payment is not taken on this site.',
  },
];

export default function AboutPage() {
  const listings = draftProducts.length;
  const posted = postedCoaCount();

  const stats = [
    { value: String(listings), label: 'Catalogue listings' },
    { value: posted === 0 ? 'In progress' : `${posted} posted`, label: 'Documentation' },
    { value: 'Canada', label: 'Ships in Canada' },
    { value: 'TBA', label: 'Pricing' },
  ];

  const postedToday = [
    `${listings} research listings, each with a name, strength, and detail page.`,
    posted === 0
      ? 'No certificates of analysis are posted yet. The COA Library marks every item pending.'
      : `${posted} of ${listings} certificates of analysis are posted. The rest stay pending.`,
    'Pricing is TBA. The cart collects an order request and does not show a price or a total.',
    'A Canadian catalogue. A quote email confirms the next step for shipping.',
  ];

  return (
    <div className="min-h-screen bg-[#eaf8fc] text-[#18222a]" id="about-page">
      <header className="border-b border-[#b7d3de] bg-[linear-gradient(180deg,#f7fcfe_0%,#e7f3f8_100%)]">
        <div className="mx-auto max-w-3xl px-4 py-8 text-center sm:px-6 sm:py-10">
          <Image
            src="/images/nova-arctic/logo-black-transparent.png"
            alt="Nova Pure Labs"
            width={2191}
            height={718}
            preload
            className="mx-auto h-auto w-52 sm:w-64"
          />
          <h1 className="mt-6 text-3xl font-black tracking-tight text-[#13283b] sm:text-4xl">A research catalogue, stated plainly.</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#566169] sm:text-base">
            Nova Pure Labs publishes {listings} research listings with the names and strengths supplied for the catalogue. Pricing is TBA. Documentation is in progress, and a certificate is added only when the matching record exists.
          </p>
        </div>
      </header>

      <section className="bg-[#061b3a] py-6" id="about-stats">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-white sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16" id="our-story">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#526f82]">The catalogue</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#13283b] sm:text-3xl">What changed, and what has not</h2>
          <div className="mt-8 space-y-6">
            {[
              ['The record', 'Buyers often see purity and testing language with no document attached. This catalogue does not repeat those claims.'],
              ['The choice', 'List the product identity that is actually supplied, and keep pricing, storage, and certificates marked pending until they are confirmed.'],
              ['Today', `${listings} listings are public. ${posted === 0 ? 'No certificate of analysis has been posted.' : `${posted} of ${listings} certificates are posted.`} Order requests can be submitted. Prices stay TBA until a quote is emailed.`],
            ].map(([title, description], index) => (
              <article key={title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#123d63] text-sm font-black text-white">{index + 1}</div>
                <div>
                  <h3 className="font-black text-[#13283b]">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#566169]">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#b8d4df] bg-[#d8edf4] px-4 py-12 sm:px-6 sm:py-16" id="our-values">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-black tracking-tight text-[#13283b] sm:text-3xl">How the catalogue is handled</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {principles.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white bg-white/80 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#123d63] text-white">
                  <item.icon size={20} />
                </div>
                <h3 className="mt-4 font-black text-[#13283b]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#566169]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16" id="posted-today">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#526f82]">Posted today</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#13283b] sm:text-3xl">Only what can be checked</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#566169]">These are the facts the public site can support right now. Testing language is not added in their place.</p>
          </div>
          <ul className="space-y-3">
            {postedToday.map((item) => (
              <li key={item} className="rounded-2xl border border-[#c5d7e0] bg-white px-5 py-4 text-sm leading-relaxed text-[#334450]">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-[#b8d4df] bg-white px-4 py-12 sm:px-6" id="about-cta">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-black tracking-tight text-[#13283b]">Read the listings, not a promise</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#566169]">Browse the catalogue or the COA Library. Safety notes stay in their own section and do not stand in for a certificate.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#061b3a] px-6 py-3 text-sm font-bold text-white">Browse catalogue <ArrowRight size={16} /></Link>
            <Link href="/coa" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#123d63] bg-white px-6 py-3 text-sm font-bold text-[#123d63]">COA Library</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
