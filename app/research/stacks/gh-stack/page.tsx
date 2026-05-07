import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Beaker, ShieldCheck, AlertTriangle, BookOpen } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/config/featureFlags';

export const metadata: Metadata = {
  title: 'GH Stack (CJC-1295 + Ipamorelin) | Research Guide | NovaPure Labs',
  description: 'Research guide to the Growth Hormone stack: CJC-1295 DAC and Ipamorelin combination. Mechanisms, protocols, and PubMed-cited preclinical data. For laboratory research only.',
};

export default function GHStackPage() {
  if (!isFeatureEnabled('stackingGuides')) return notFound();

  return (
    <div className="min-h-screen bg-silver" id="gh-stack-page">
      <section className="relative overflow-hidden">
        <div className="relative h-[200px] sm:h-[260px] lg:h-[320px]">
          <Image src="/images/nova-banner-3.png" alt="GH Stack Research" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/50 to-transparent" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 h-full flex items-center">
            <div>
              <span className="text-xs font-bold text-green uppercase tracking-wider">Research Stack Guide</span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mt-2">GH Stack</h1>
              <p className="mt-2 text-base sm:text-lg text-white/80">CJC-1295 + Ipamorelin — Growth Hormone Research</p>
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
            The <strong>GH Stack</strong> combines <strong>CJC-1295</strong> (a growth hormone-releasing hormone analog) with <strong>Ipamorelin</strong> (a selective growth hormone secretagogue). In preclinical research, CJC-1295 provides sustained GHRH signaling for prolonged GH elevation, while Ipamorelin offers a selective GH pulse without significant cortisol or prolactin release. Researchers study this combination for synergistic GH axis stimulation. All peptides are sold strictly <strong>for laboratory research purposes only</strong>.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800"><strong>Research Disclaimer:</strong> All content summarizes publicly available preclinical literature. No claims are made about human efficacy, safety, or therapeutic use. Not for human consumption.</p>
          </div>
        </div>

        {/* Mechanisms */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-blue" /> Mechanisms of Action
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-silver rounded-xl p-5">
              <h3 className="font-bold text-navy mb-2">CJC-1295 (with DAC)</h3>
              <ul className="text-sm text-gray-dark space-y-1.5">
                <li>• Synthetic GHRH analog with Drug Affinity Complex</li>
                <li>• Extended half-life (~6-8 days vs minutes)</li>
                <li>• Sustained GH release over multiple days</li>
                <li>• Increases IGF-1 levels in animal models</li>
                <li>• Studied for growth, recovery, and body composition</li>
              </ul>
            </div>
            <div className="bg-silver rounded-xl p-5">
              <h3 className="font-bold text-navy mb-2">Ipamorelin</h3>
              <ul className="text-sm text-gray-dark space-y-1.5">
                <li>• Selective GH secretagogue (ghrelin mimetic)</li>
                <li>• Stimulates pulsatile GH release</li>
                <li>• Minimal cortisol/prolactin elevation</li>
                <li>• Shorter acting — mimics natural GH pulses</li>
                <li>• Studied for targeted GH modulation</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 bg-blue-soft rounded-xl p-5">
            <h3 className="font-bold text-navy mb-2">Synergy Rationale</h3>
            <p className="text-sm text-gray-dark">CJC-1295 provides a sustained baseline elevation of GHRH signaling, while Ipamorelin adds targeted pulsatile GH release. Together, researchers study amplified yet more physiologic GH patterns compared to either peptide alone.</p>
          </div>
        </section>

        {/* Protocol Table */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">Common Research Protocols</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-4 py-3 rounded-tl-lg font-semibold">Component</th>
                  <th className="px-4 py-3 font-semibold">Research Dose</th>
                  <th className="px-4 py-3 font-semibold">Frequency</th>
                  <th className="px-4 py-3 font-semibold">Administration</th>
                  <th className="px-4 py-3 rounded-tr-lg font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-navy">CJC-1295 (DAC)</td>
                  <td className="px-4 py-3 text-gray-dark">1–2 mg/week</td>
                  <td className="px-4 py-3 text-gray-dark">1–2x per week</td>
                  <td className="px-4 py-3 text-gray-dark">Subcutaneous</td>
                  <td className="px-4 py-3 text-gray-dark">8–12 weeks</td>
                </tr>
                <tr className="bg-silver">
                  <td className="px-4 py-3 font-medium text-navy">Ipamorelin</td>
                  <td className="px-4 py-3 text-gray-dark">200–300 mcg/dose</td>
                  <td className="px-4 py-3 text-gray-dark">2–3x daily</td>
                  <td className="px-4 py-3 text-gray-dark">Subcutaneous</td>
                  <td className="px-4 py-3 text-gray-dark">8–12 weeks</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-navy">Combined Stack</td>
                  <td className="px-4 py-3 text-gray-dark">As above</td>
                  <td className="px-4 py-3 text-gray-dark">Per individual schedules</td>
                  <td className="px-4 py-3 text-gray-dark">Separate injections</td>
                  <td className="px-4 py-3 text-gray-dark">8–12 weeks + washout</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">Frequently Asked Questions</h2>
          <div className="divide-y divide-border">
            {[
              { q: 'Why combine CJC-1295 with Ipamorelin?', a: 'CJC-1295 provides sustained GHRH signaling for baseline GH elevation, while Ipamorelin adds selective pulsatile GH release. The combination aims to amplify GH output while maintaining physiologic patterns.' },
              { q: 'What is the DAC in CJC-1295?', a: 'Drug Affinity Complex (DAC) extends the half-life from minutes to approximately 6-8 days by binding to serum albumin. CJC-1295 without DAC (also called Mod GRF 1-29) has a much shorter duration.' },
              { q: 'Does Ipamorelin affect cortisol or prolactin?', a: 'Unlike other GH secretagogues (GHRP-6, GHRP-2), Ipamorelin shows minimal cortisol and prolactin elevation in preclinical studies, making it a more selective research compound.' },
              { q: 'What purity is required?', a: 'HPLC-verified ≥99% purity is recommended for reproducible results. NovaPure Labs includes third-party COAs with every peptide order.' },
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
            <span className="text-green text-sm font-bold">99%+ HPLC Verified</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Start Your GH Research</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop/cjc-1295-dac" className="bg-white text-navy px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all">Shop CJC-1295</Link>
            <Link href="/shop/ipamorelin" className="bg-blue text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-all">Shop Ipamorelin</Link>
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: 'GH Stack (CJC-1295 + Ipamorelin) Research Guide',
        description: 'Research guide to the CJC-1295 + Ipamorelin growth hormone stack with protocols and preclinical data.',
        author: { '@type': 'Organization', name: 'NovaPure Labs' },
        publisher: { '@type': 'Organization', name: 'NovaPure Labs', url: 'https://peptidelifewellness.com' },
        datePublished: '2026-05-07', dateModified: '2026-05-07',
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Why combine CJC-1295 with Ipamorelin?', acceptedAnswer: { '@type': 'Answer', text: 'CJC-1295 provides sustained GHRH signaling while Ipamorelin adds selective pulsatile GH release for amplified output.' } },
          { '@type': 'Question', name: 'Does Ipamorelin affect cortisol?', acceptedAnswer: { '@type': 'Answer', text: 'Unlike GHRP-6 or GHRP-2, Ipamorelin shows minimal cortisol and prolactin elevation in preclinical studies.' } },
        ],
      })}} />
    </div>
  );
}
