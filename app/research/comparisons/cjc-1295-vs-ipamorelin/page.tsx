import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Beaker, ShieldCheck, AlertTriangle } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/config/featureFlags';

export const metadata: Metadata = {
  title: 'CJC-1295 vs Ipamorelin | Peptide Comparison | NovaPure Labs',
  description: 'Head-to-head comparison of CJC-1295 and Ipamorelin research peptides. Mechanisms, half-life, selectivity, and protocols compared with PubMed citations.',
};

export default function CJCvsIpamorelinPage() {
  if (!isFeatureEnabled('comparisonPages')) return notFound();

  return (
    <div className="min-h-screen bg-silver" id="cjc-vs-ipamorelin">
      <section className="relative overflow-hidden">
        <div className="relative h-[180px] sm:h-[240px] lg:h-[300px]">
          <Image src="/images/nova-banner-main.png" alt="CJC-1295 vs Ipamorelin" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/50 to-transparent" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 h-full flex items-center">
            <div>
              <span className="text-xs font-bold text-green uppercase tracking-wider">Peptide Comparison</span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mt-2">CJC-1295 vs Ipamorelin</h1>
              <p className="mt-2 text-sm sm:text-base text-white/80">Growth hormone research peptides compared</p>
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
            <strong>CJC-1295</strong> is a synthetic GHRH analog that provides <strong>sustained GH elevation</strong> over days (especially with DAC), while <strong>Ipamorelin</strong> is a selective ghrelin mimetic that triggers <strong>acute pulsatile GH release</strong> with minimal cortisol/prolactin impact. CJC-1295 acts on GHRH receptors; Ipamorelin acts on ghrelin receptors. They are often studied together for synergistic GH axis stimulation. Both are sold <strong>for laboratory research only</strong>.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800"><strong>Research Disclaimer:</strong> All content summarizes publicly available preclinical literature. Not for human consumption.</p>
          </div>
        </div>

        {/* Comparison Table */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">Head-to-Head Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-4 py-3 rounded-tl-lg font-semibold">Attribute</th>
                  <th className="px-4 py-3 font-semibold">CJC-1295</th>
                  <th className="px-4 py-3 rounded-tr-lg font-semibold">Ipamorelin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Classification', 'GHRH analog (Growth Hormone Releasing Hormone)', 'Ghrelin mimetic / GH Secretagogue'],
                  ['Receptor Target', 'GHRH receptor (pituitary)', 'Ghrelin receptor (GHS-R1a)'],
                  ['Mechanism', 'Sustained GHRH signaling → prolonged GH elevation', 'Pulsatile GH release mimicking natural rhythm'],
                  ['Half-Life', 'With DAC: ~6-8 days; Without DAC: ~30 min', '~2 hours'],
                  ['GH Release Pattern', 'Sustained, elevated baseline', 'Acute pulse, returns to baseline'],
                  ['Cortisol Impact', 'Minimal', 'Minimal (highly selective)'],
                  ['Prolactin Impact', 'Low', 'Very low — major advantage'],
                  ['Hunger Stimulation', 'None', 'None (unlike GHRP-6)'],
                  ['Research Dose Range', '1-2 mg/week (DAC)', '200-300 mcg, 2-3x daily'],
                  ['Administration', 'Subcutaneous, 1-2x weekly', 'Subcutaneous, 2-3x daily'],
                  ['Duration Studied', '8-12 weeks', '8-12 weeks'],
                  ['Best For', 'Sustained GH elevation, IGF-1 increase', 'Selective GH pulsing, targeted studies'],
                  ['Stacking', 'Commonly paired with Ipamorelin', 'Commonly paired with CJC-1295'],
                ].map(([attr, cjc, ipa], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-silver'}>
                    <td className="px-4 py-3 font-medium text-navy">{attr}</td>
                    <td className="px-4 py-3 text-gray-dark">{cjc}</td>
                    <td className="px-4 py-3 text-gray-dark">{ipa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* When to Use */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">When Researchers Choose One vs the Other</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-blue-soft rounded-xl p-5">
              <h3 className="font-bold text-navy mb-3">CJC-1295 When Studying:</h3>
              <ul className="text-sm text-gray-dark space-y-2">
                <li>• Sustained GH/IGF-1 elevation models</li>
                <li>• Long-acting GHRH signaling</li>
                <li>• Less frequent dosing protocols</li>
                <li>• Body composition research</li>
              </ul>
            </div>
            <div className="bg-green-soft rounded-xl p-5">
              <h3 className="font-bold text-navy mb-3">Ipamorelin When Studying:</h3>
              <ul className="text-sm text-gray-dark space-y-2">
                <li>• Selective GH pulsing without side hormones</li>
                <li>• Minimal cortisol/prolactin models</li>
                <li>• Natural GH rhythm mimicry</li>
                <li>• Targeted acute GH release studies</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 bg-silver rounded-xl p-5">
            <h3 className="font-bold text-navy mb-2">Use Both (GH Stack) When:</h3>
            <p className="text-sm text-gray-dark">Research aims for maximum synergistic GH stimulation — sustained baseline (CJC-1295) plus selective pulsing (Ipamorelin). <Link href="/research/stacks/gh-stack" className="text-blue hover:underline font-medium">See full GH Stack Guide →</Link></p>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">Frequently Asked Questions</h2>
          <div className="divide-y divide-border">
            {[
              { q: 'Is CJC-1295 or Ipamorelin more effective for GH research?', a: 'They work through different mechanisms. CJC-1295 provides sustained GH elevation; Ipamorelin provides selective pulsatile release. Most researchers study them in combination for synergistic effects.' },
              { q: 'What is CJC-1295 without DAC?', a: 'Also called Mod GRF 1-29, it has a much shorter half-life (~30 minutes vs 6-8 days). It requires more frequent administration but provides more controlled GH pulses.' },
              { q: 'Does Ipamorelin increase appetite?', a: 'Unlike GHRP-6, Ipamorelin does not significantly stimulate appetite in preclinical models, making it more selective for GH research.' },
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
          <h2 className="text-xl font-bold text-white mb-4">Start Your GH Research</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop/cjc-1295-dac" className="bg-white text-navy px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all">Shop CJC-1295</Link>
            <Link href="/shop/ipamorelin" className="bg-blue text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-all">Shop Ipamorelin</Link>
            <Link href="/research/stacks/gh-stack" className="border border-white/30 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all">GH Stack Guide</Link>
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: 'CJC-1295 vs Ipamorelin — Research Peptide Comparison', author: { '@type': 'Organization', name: 'NovaPure Labs' }, publisher: { '@type': 'Organization', name: 'NovaPure Labs', url: 'https://peptidelifewellness.com' }, datePublished: '2026-05-08', dateModified: '2026-05-08' })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'Is CJC-1295 or Ipamorelin more effective?', acceptedAnswer: { '@type': 'Answer', text: 'They work through different mechanisms and most researchers study them in combination for synergistic GH effects.' } }] })}} />
    </div>
  );
}
