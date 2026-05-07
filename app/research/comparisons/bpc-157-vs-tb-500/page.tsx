import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Beaker, ShieldCheck, AlertTriangle } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/config/featureFlags';

export const metadata: Metadata = {
  title: 'BPC-157 vs TB-500 | Peptide Comparison | NovaPure Labs',
  description: 'Head-to-head comparison of BPC-157 and TB-500 research peptides. Mechanisms of action, preclinical data, and research applications compared with PubMed citations.',
  openGraph: {
    title: 'BPC-157 vs TB-500 — Research Peptide Comparison | NovaPure Labs',
    description: 'Detailed comparison of BPC-157 and TB-500 mechanisms, research applications, and preclinical findings.',
  },
};

export default function BPC157vsTB500Page() {
  if (!isFeatureEnabled('comparisonPages')) return notFound();

  return (
    <div className="min-h-screen bg-silver" id="bpc157-vs-tb500">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[180px] sm:h-[240px] lg:h-[300px]">
          <Image src="/images/nova-banner-5.png" alt="BPC-157 vs TB-500 Comparison" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/50 to-transparent" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 h-full flex items-center">
            <div>
              <span className="text-xs font-bold text-green uppercase tracking-wider">Peptide Comparison</span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mt-2">BPC-157 vs TB-500</h1>
              <p className="mt-2 text-sm sm:text-base text-white/80">Which research peptide fits your laboratory protocols?</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link href="/research" className="inline-flex items-center gap-2 text-sm text-gray hover:text-navy transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Research Hub
        </Link>

        {/* Quick Answer */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Beaker size={18} className="text-blue" />
            <span className="text-xs font-bold text-blue uppercase tracking-wider">Quick Answer</span>
          </div>
          <p className="text-sm sm:text-base text-gray-dark leading-relaxed">
            In research contexts, <strong>BPC-157</strong> is primarily studied for <strong>localized tissue repair</strong> — tendon, ligament, gut, and muscle injury models — while <strong>TB-500</strong> is examined for <strong>systemic wound healing</strong> via actin regulation and cell migration. BPC-157 typically shows stronger effects at injection sites; TB-500 distributes systemically. Both are sold strictly <strong>for laboratory research purposes only</strong>.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              <strong>Research Disclaimer:</strong> All content summarizes publicly available preclinical literature. No claims are made about human efficacy, safety, or therapeutic use. Not for human consumption.
            </p>
          </div>
        </div>

        {/* Main Comparison Table */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">Head-to-Head Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-4 py-3 rounded-tl-lg font-semibold">Attribute</th>
                  <th className="px-4 py-3 font-semibold">BPC-157</th>
                  <th className="px-4 py-3 rounded-tr-lg font-semibold">TB-500</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Full Name', 'Body Protection Compound-157', 'Thymosin Beta-4 (Fragment)'],
                  ['Type', 'Synthetic pentadecapeptide (15 amino acids)', 'Synthetic peptide (43 amino acids)'],
                  ['Primary Research Focus', 'Localized tissue repair, cytoprotection', 'Systemic wound healing, cell migration'],
                  ['Mechanism', 'Inflammatory pathway modulation, fibroblast proliferation, collagen organization', 'Actin sequestration, endothelial differentiation, neovascularization'],
                  ['Tissue Targets', 'Tendon, ligament, muscle, gut, spinal cord', 'Wound healing, cardiac, musculoskeletal (systemic)'],
                  ['Angiogenesis', 'Moderate — promotes in select models', 'Strong — endothelial migration focus'],
                  ['Administration', 'Subcutaneous (local) or oral', 'Subcutaneous (systemic)'],
                  ['Typical Research Dose', '200–500 mcg/day', '2–5 mg twice weekly (loading)'],
                  ['Half-Life', 'Stable in gastric juice; relatively short systemic', 'Longer half-life; systemic distribution'],
                  ['Research Duration', '4–8 weeks typical', '4–8 weeks (loading + maintenance)'],
                  ['Oral Bioavailability', 'Yes — studied in gut models', 'No — injectable only'],
                  ['Stacking Potential', 'Combines well with TB-500 (Wolverine Stack)', 'Combines well with BPC-157, GHK-Cu'],
                ].map(([attr, bpc, tb], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-silver'}>
                    <td className="px-4 py-3 font-medium text-navy">{attr}</td>
                    <td className="px-4 py-3 text-gray-dark">{bpc}</td>
                    <td className="px-4 py-3 text-gray-dark">{tb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* When to Use Which */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">When Researchers Study One vs the Other</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-blue-soft rounded-xl p-5">
              <h3 className="font-bold text-navy mb-3">Choose BPC-157 When Studying:</h3>
              <ul className="text-sm text-gray-dark space-y-2">
                <li>• Localized injury models (tendon, ligament, joint)</li>
                <li>• Gut/intestinal repair and protection</li>
                <li>• Oral delivery protocols</li>
                <li>• Targeted inflammation modulation</li>
                <li>• Nerve and spinal injury models</li>
              </ul>
            </div>
            <div className="bg-green-soft rounded-xl p-5">
              <h3 className="font-bold text-navy mb-3">Choose TB-500 When Studying:</h3>
              <ul className="text-sm text-gray-dark space-y-2">
                <li>• Systemic wound healing and recovery</li>
                <li>• Broad musculoskeletal repair</li>
                <li>• Cardiac tissue regeneration</li>
                <li>• Cell migration and angiogenesis</li>
                <li>• Multi-site injury protocols</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 bg-silver rounded-xl p-5">
            <h3 className="font-bold text-navy mb-2">Use Both (Wolverine Stack) When:</h3>
            <p className="text-sm text-gray-dark">
              Research aims to study complementary localized + systemic tissue repair, maximizing both targeted and broad regenerative signaling. <Link href="/research/wolverine-stack" className="text-blue hover:underline font-medium">See full Wolverine Stack Guide →</Link>
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">Frequently Asked Questions</h2>
          <div className="divide-y divide-border">
            {[
              { q: 'Is BPC-157 or TB-500 better for tissue repair research?', a: 'It depends on the model. BPC-157 excels in localized injury studies (tendon, gut), while TB-500 is preferred for systemic wound healing and cardiac models. Many researchers combine both for comprehensive coverage.' },
              { q: 'Can they be administered at the same time?', a: 'In preclinical research, they are frequently co-administered as separate injections in the same session. The Wolverine Stack protocol is the most commonly referenced combination.' },
              { q: 'Which has more published research?', a: 'BPC-157 has a larger body of published preclinical literature (100+ PubMed indexed studies). TB-500/Thymosin Beta-4 research is also extensive but more focused on cardiology and wound models.' },
              { q: 'What purity should I use?', a: 'Always use ≥99% HPLC-verified peptides with batch-specific COAs for reproducible results. NovaPure Labs includes third-party analysis with every order.' },
            ].map((faq, i) => (
              <details key={i} className="py-4 group">
                <summary className="font-semibold text-navy text-sm cursor-pointer hover:text-blue transition-colors list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-gray group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-sm text-gray-dark leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-navy rounded-2xl p-6 sm:p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-green" />
            <span className="text-green text-sm font-bold">COA Included With Every Order</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Start Your Research Today</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop/bpc-157" className="bg-white text-navy px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all">Shop BPC-157</Link>
            <Link href="/shop/tb-500" className="bg-blue text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-all">Shop TB-500</Link>
            <Link href="/research/wolverine-stack" className="border border-white/30 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all">Wolverine Stack Guide</Link>
          </div>
        </section>
      </div>

      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: 'BPC-157 vs TB-500 — Research Peptide Comparison',
        description: 'Head-to-head comparison of BPC-157 and TB-500 research peptides with mechanisms, protocols, and data tables.',
        author: { '@type': 'Organization', name: 'NovaPure Labs' },
        publisher: { '@type': 'Organization', name: 'NovaPure Labs', url: 'https://peptidelifewellness.com' },
        datePublished: '2026-05-07', dateModified: '2026-05-07',
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Is BPC-157 or TB-500 better for tissue repair research?', acceptedAnswer: { '@type': 'Answer', text: 'BPC-157 excels in localized injury studies while TB-500 is preferred for systemic wound healing. Many researchers combine both.' } },
          { '@type': 'Question', name: 'Can they be administered at the same time?', acceptedAnswer: { '@type': 'Answer', text: 'In preclinical research, they are frequently co-administered as separate injections.' } },
        ],
      })}} />
    </div>
  );
}
