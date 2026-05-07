import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Beaker, ShieldCheck, AlertTriangle } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/config/featureFlags';

export const metadata: Metadata = {
  title: 'Semaglutide vs Tirzepatide | Peptide Comparison | NovaPure Labs',
  description: 'Research comparison of Semaglutide and Tirzepatide — GLP-1 receptor agonists studied for metabolic and weight management research. Mechanisms, selectivity, and preclinical data.',
};

export default function SemaVsTirzPage() {
  if (!isFeatureEnabled('comparisonPages')) return notFound();

  return (
    <div className="min-h-screen bg-silver" id="sema-vs-tirz">
      <section className="relative overflow-hidden">
        <div className="relative h-[180px] sm:h-[240px] lg:h-[300px]">
          <Image src="/images/nova-banner-5.png" alt="Semaglutide vs Tirzepatide" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/50 to-transparent" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 h-full flex items-center">
            <div>
              <span className="text-xs font-bold text-green uppercase tracking-wider">Peptide Comparison</span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mt-2">Semaglutide vs Tirzepatide</h1>
              <p className="mt-2 text-sm sm:text-base text-white/80">GLP-1 receptor agonists for metabolic research</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link href="/research" className="inline-flex items-center gap-2 text-sm text-gray hover:text-navy transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Research Hub
        </Link>

        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Beaker size={18} className="text-blue" />
            <span className="text-xs font-bold text-blue uppercase tracking-wider">Quick Answer</span>
          </div>
          <p className="text-sm sm:text-base text-gray-dark leading-relaxed">
            <strong>Semaglutide</strong> is a selective <strong>GLP-1 receptor agonist</strong> studied for glucose regulation and appetite suppression in metabolic research models. <strong>Tirzepatide</strong> is a dual <strong>GLP-1/GIP receptor agonist</strong> that activates both incretin pathways, showing enhanced metabolic effects in preclinical and clinical studies. Tirzepatide&apos;s dual mechanism represents a newer approach to metabolic research. Both are sold <strong>for laboratory research purposes only</strong>.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800"><strong>Research Disclaimer:</strong> All content summarizes publicly available literature. These are prescription medications in some jurisdictions. Research-grade peptides are for laboratory use only. Not for human consumption.</p>
          </div>
        </div>

        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">Head-to-Head Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-4 py-3 rounded-tl-lg font-semibold">Attribute</th>
                  <th className="px-4 py-3 font-semibold">Semaglutide</th>
                  <th className="px-4 py-3 rounded-tr-lg font-semibold">Tirzepatide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Classification', 'GLP-1 receptor agonist (selective)', 'Dual GLP-1/GIP receptor agonist'],
                  ['Receptor Targets', 'GLP-1R only', 'GLP-1R + GIPR (dual)'],
                  ['Mechanism', 'Incretin mimetic → insulin secretion, appetite suppression', 'Dual incretin activation → enhanced metabolic signaling'],
                  ['Half-Life', '~7 days (weekly dosing)', '~5 days (weekly dosing)'],
                  ['Administration', 'Subcutaneous, once weekly', 'Subcutaneous, once weekly'],
                  ['Weight Research', 'Significant body weight reduction in animal models', 'Greater weight reduction vs semaglutide in comparative studies'],
                  ['Glucose Research', 'Strong glycemic control', 'Superior glycemic control in head-to-head trials'],
                  ['Appetite Effects', 'Reduced food intake via CNS pathways', 'Reduced food intake + enhanced nutrient signaling'],
                  ['GI Tolerance', 'Nausea common in dose escalation studies', 'Similar profile; dose titration recommended'],
                  ['Novelty', 'Established GLP-1 agonist; extensive literature', 'Newer dual-agonist; growing research body'],
                  ['Research Applications', 'Metabolic, obesity, cardiovascular models', 'Metabolic, obesity, dual-incretin signaling studies'],
                ].map(([attr, sema, tirz], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-silver'}>
                    <td className="px-4 py-3 font-medium text-navy">{attr}</td>
                    <td className="px-4 py-3 text-gray-dark">{sema}</td>
                    <td className="px-4 py-3 text-gray-dark">{tirz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">When Researchers Choose One vs the Other</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-blue-soft rounded-xl p-5">
              <h3 className="font-bold text-navy mb-3">Semaglutide When Studying:</h3>
              <ul className="text-sm text-gray-dark space-y-2">
                <li>• Selective GLP-1 pathway research</li>
                <li>• Cardiovascular benefit models</li>
                <li>• Well-established protocols with extensive literature</li>
                <li>• Standard incretin-based metabolic research</li>
              </ul>
            </div>
            <div className="bg-green-soft rounded-xl p-5">
              <h3 className="font-bold text-navy mb-3">Tirzepatide When Studying:</h3>
              <ul className="text-sm text-gray-dark space-y-2">
                <li>• Dual GLP-1/GIP receptor interaction</li>
                <li>• Enhanced metabolic effect models</li>
                <li>• Novel dual-agonist mechanisms</li>
                <li>• Comparative efficacy studies</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">Frequently Asked Questions</h2>
          <div className="divide-y divide-border">
            {[
              { q: 'Which is more effective in preclinical weight studies?', a: 'Head-to-head clinical trials (SURMOUNT vs STEP) suggest Tirzepatide achieves greater weight reduction, likely due to dual GLP-1/GIP activation. However, both show significant metabolic effects.' },
              { q: 'Can they be combined in research?', a: 'Combination studies are limited. Most research focuses on individual compound effects or head-to-head comparison rather than stacking.' },
              { q: 'What purity is required for metabolic research?', a: 'HPLC-verified ≥99% purity is essential for reproducible metabolic research outcomes. NovaPure Labs includes batch-specific COAs.' },
            ].map((faq, i) => (
              <details key={i} className="py-4 group">
                <summary className="font-semibold text-navy text-sm cursor-pointer hover:text-blue transition-colors list-none flex items-center justify-between">{faq.q}<span className="text-gray group-open:rotate-180 transition-transform">▼</span></summary>
                <p className="mt-3 text-sm text-gray-dark leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-navy rounded-2xl p-6 sm:p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-green" /><span className="text-green text-sm font-bold">COA Included</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Start Your Metabolic Research</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop/semaglutide" className="bg-white text-navy px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all">Shop Semaglutide</Link>
            <Link href="/shop/tirzepatide" className="bg-blue text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-all">Shop Tirzepatide</Link>
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: 'Semaglutide vs Tirzepatide — GLP-1 Research Comparison', author: { '@type': 'Organization', name: 'NovaPure Labs' }, publisher: { '@type': 'Organization', name: 'NovaPure Labs', url: 'https://peptidelifewellness.com' }, datePublished: '2026-05-08' })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'Which is more effective for weight research?', acceptedAnswer: { '@type': 'Answer', text: 'Tirzepatide shows greater weight reduction in comparative studies due to dual GLP-1/GIP activation.' } }] })}} />
    </div>
  );
}
