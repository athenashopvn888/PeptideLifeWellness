import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Beaker, ShieldCheck, BookOpen, AlertTriangle } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/config/featureFlags';

export const metadata: Metadata = {
  title: 'Wolverine Stack (BPC-157 + TB-500) | Research Guide | NovaPure Labs',
  description: 'Complete research guide to the Wolverine Stack: BPC-157 + TB-500 combination. Mechanisms of action, preclinical data, research protocols, and PubMed citations. For laboratory research only.',
  openGraph: {
    title: 'Wolverine Stack Research Guide — BPC-157 + TB-500 | NovaPure Labs',
    description: 'PubMed-cited research on the BPC-157 + TB-500 stack for tissue repair models. Mechanisms, protocols, and comparison data.',
  },
};

export default function WolverineStackPage() {
  if (!isFeatureEnabled('wolverineStack')) return notFound();

  return (
    <div className="min-h-screen bg-silver" id="wolverine-stack-page">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[200px] sm:h-[260px] lg:h-[320px]">
          <Image
            src="/images/nova-banner-1.png"
            alt="Wolverine Stack BPC-157 TB-500 Research"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/50 to-transparent" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 h-full flex items-center">
            <div>
              <span className="text-xs font-bold text-green uppercase tracking-wider">Research Stack Guide</span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mt-2">
                Wolverine Stack
              </h1>
              <p className="mt-2 text-base sm:text-lg text-white/80">BPC-157 + TB-500 — Research Protocol Overview</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Link */}
        <Link href="/research" className="inline-flex items-center gap-2 text-sm text-gray hover:text-navy transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Research Hub
        </Link>

        {/* Quick Answer Box */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Beaker size={18} className="text-blue" />
            <span className="text-xs font-bold text-blue uppercase tracking-wider">Quick Answer</span>
          </div>
          <p className="text-sm sm:text-base text-gray-dark leading-relaxed">
            The <strong>Wolverine Stack</strong> refers to the research combination of <strong>BPC-157</strong> (Body Protection Compound-157) and <strong>TB-500</strong> (a synthetic fragment of Thymosin Beta-4). In preclinical models (primarily rodent, cell culture, and in vitro studies), BPC-157 is examined for localized tissue repair, tendon/ligament support, and cytoprotective effects, while TB-500 is studied for systemic cell migration, actin regulation, angiogenesis, and broader wound healing. Researchers explore them together for potential complementary mechanisms in tissue regeneration models. All peptides on this site are sold strictly <strong>for laboratory research purposes only</strong> and are not for human consumption.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              <strong>Important Disclaimer:</strong> This page summarizes publicly available preclinical literature and common research protocols discussed in scientific contexts. No claims are made about human efficacy, safety, or therapeutic use. Always consult primary PubMed sources and comply with all local regulations. Long-term risks in any model remain understudied.
            </p>
          </div>
        </div>

        {/* Mechanisms of Action */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-blue" /> Mechanisms of Action (Preclinical Research)
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-silver rounded-xl p-5">
              <h3 className="font-bold text-navy mb-2">BPC-157</h3>
              <p className="text-sm text-gray-dark mb-3">Stable gastric pentadecapeptide studied for:</p>
              <ul className="text-sm text-gray-dark space-y-1.5">
                <li className="flex items-start gap-2">• Modulating inflammatory pathways</li>
                <li className="flex items-start gap-2">• Promoting tendon fibroblast proliferation</li>
                <li className="flex items-start gap-2">• Collagen organization & angiogenesis</li>
                <li className="flex items-start gap-2">• Cytoprotective effects in gut, tendon, muscle, and spinal cord injury models</li>
              </ul>
            </div>
            <div className="bg-silver rounded-xl p-5">
              <h3 className="font-bold text-navy mb-2">TB-500</h3>
              <p className="text-sm text-gray-dark mb-3">Synthetic Thymosin Beta-4 fragment studied for:</p>
              <ul className="text-sm text-gray-dark space-y-1.5">
                <li className="flex items-start gap-2">• Actin sequestration & cell migration</li>
                <li className="flex items-start gap-2">• Endothelial differentiation</li>
                <li className="flex items-start gap-2">• Neovascularization in wound models</li>
                <li className="flex items-start gap-2">• Systemic support in musculoskeletal injury models</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-blue-soft rounded-xl p-5">
            <h3 className="font-bold text-navy mb-2">Synergy Rationale</h3>
            <p className="text-sm text-gray-dark">
              BPC-157 often shows stronger <strong>localized effects</strong> (e.g., near injury site), while TB-500 provides more <strong>systemic support</strong>. Researchers study the pair for additive or complementary signaling in musculoskeletal and soft tissue models.
            </p>
          </div>
        </section>

        {/* Research Protocol Table */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">Common Research Protocols in Literature</h2>
          <p className="text-sm text-gray mb-4">Aggregated from preclinical and reported research contexts (primarily animal-derived or extrapolated in lab discussions).</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-4 py-3 rounded-tl-lg font-semibold">Component</th>
                  <th className="px-4 py-3 font-semibold">Common Research Dose</th>
                  <th className="px-4 py-3 font-semibold">Frequency</th>
                  <th className="px-4 py-3 font-semibold">Administration</th>
                  <th className="px-4 py-3 rounded-tr-lg font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-navy">BPC-157</td>
                  <td className="px-4 py-3 text-gray-dark">200–500 mcg/day</td>
                  <td className="px-4 py-3 text-gray-dark">Daily</td>
                  <td className="px-4 py-3 text-gray-dark">Subcutaneous (near injury site); oral in gut models</td>
                  <td className="px-4 py-3 text-gray-dark">4–8 weeks</td>
                </tr>
                <tr className="bg-silver">
                  <td className="px-4 py-3 font-medium text-navy">TB-500</td>
                  <td className="px-4 py-3 text-gray-dark">2–5 mg (loading); 2 mg (maintenance)</td>
                  <td className="px-4 py-3 text-gray-dark">2x/week → 1x/week</td>
                  <td className="px-4 py-3 text-gray-dark">Subcutaneous (systemic)</td>
                  <td className="px-4 py-3 text-gray-dark">4–8 weeks</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-navy">Combined Stack</td>
                  <td className="px-4 py-3 text-gray-dark">As above, administered separately</td>
                  <td className="px-4 py-3 text-gray-dark">Per individual schedules</td>
                  <td className="px-4 py-3 text-gray-dark">Separate injections or co-administered</td>
                  <td className="px-4 py-3 text-gray-dark">4–12 weeks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Protocol Outline */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">Example Research Protocol Outline</h2>
          <div className="space-y-4">
            {[
              { phase: 'Loading / Acute Phase (Weeks 1–4)', desc: 'BPC-157 daily + TB-500 twice weekly.' },
              { phase: 'Maintenance Phase (Weeks 5–8)', desc: 'BPC-157 daily (or tapered) + TB-500 once weekly.' },
              { phase: 'Cycle Length', desc: '4–8 weeks for most injury models; up to 12 weeks in chronic studies. Follow with washout period (2–4 weeks).' },
              { phase: 'Reconstitution', desc: 'Use bacteriostatic water. Gentle mixing to avoid degradation. Store reconstituted vials refrigerated.' },
              { phase: 'Site Rotation', desc: 'For subcutaneous injections, rotate sites in lab animal models.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-navy text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-navy text-sm">{item.phase}</h3>
                  <p className="text-sm text-gray-dark">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Complementary Effects Table */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">Key Complementary Effects Studied</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-4 py-3 rounded-tl-lg font-semibold">Research Aspect</th>
                  <th className="px-4 py-3 font-semibold">BPC-157 Focus</th>
                  <th className="px-4 py-3 font-semibold">TB-500 Focus</th>
                  <th className="px-4 py-3 rounded-tr-lg font-semibold">Combined Interest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-navy">Tissue Repair</td>
                  <td className="px-4 py-3 text-gray-dark">Tendon, ligament, muscle, gut mucosa</td>
                  <td className="px-4 py-3 text-gray-dark">Wound healing, muscle, systemic</td>
                  <td className="px-4 py-3 text-gray-dark">Musculoskeletal + broader recovery</td>
                </tr>
                <tr className="bg-silver">
                  <td className="px-4 py-3 font-medium text-navy">Angiogenesis</td>
                  <td className="px-4 py-3 text-gray-dark">Promotes in certain models</td>
                  <td className="px-4 py-3 text-gray-dark">Strong endothelial migration</td>
                  <td className="px-4 py-3 text-gray-dark">Enhanced vascular support</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-navy">Inflammation</td>
                  <td className="px-4 py-3 text-gray-dark">Modulates pathways</td>
                  <td className="px-4 py-3 text-gray-dark">Reduces in wound models</td>
                  <td className="px-4 py-3 text-gray-dark">Balanced modulation</td>
                </tr>
                <tr className="bg-silver">
                  <td className="px-4 py-3 font-medium text-navy">Cell Migration</td>
                  <td className="px-4 py-3 text-gray-dark">Tenocyte/fibroblast support</td>
                  <td className="px-4 py-3 text-gray-dark">Actin-based migration</td>
                  <td className="px-4 py-3 text-gray-dark">Synergistic regeneration signals</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-navy mb-4">Frequently Asked Questions</h2>
          <div className="divide-y divide-border">
            {[
              { q: 'Why is it called the "Wolverine Stack"?', a: 'Informal nickname referencing rapid regenerative themes observed in animal literature. It is not a formal scientific term.' },
              { q: 'Can BPC-157 and TB-500 be researched together?', a: 'Yes. Preclinical studies and research discussions frequently reference combined use for complementary tissue repair mechanisms. BPC-157 targets localized healing while TB-500 provides systemic support.' },
              { q: 'What about oral vs injectable BPC-157?', a: 'BPC-157 has been researched in both forms. Oral administration is common in gut-focused models, while systemic tissue studies typically use injectable (subcutaneous) routes.' },
              { q: 'Should research protocols include cycling?', a: 'Common practice includes washout periods (2–4 weeks) between research cycles of 4–8 weeks. This allows for baseline return before resuming study protocols.' },
              { q: 'What purity standards should be used?', a: 'For reproducible results, use HPLC-verified peptides with ≥99% purity. NovaPure Labs provides third-party COAs with every order to ensure batch-specific quality validation.' },
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

        {/* Product CTA */}
        <section className="bg-navy rounded-2xl p-6 sm:p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-green" />
            <span className="text-green text-sm font-bold">99%+ HPLC Verified</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Ready to Start Your Research?</h2>
          <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">All NovaPure Labs peptides include a Certificate of Analysis. Third-party lab tested, Canadian-sourced.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop/bpc-157" className="inline-flex items-center justify-center gap-2 bg-white text-navy px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all">
              Shop BPC-157
            </Link>
            <Link href="/shop/tb-500" className="inline-flex items-center justify-center gap-2 bg-blue text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-all">
              Shop TB-500
            </Link>
          </div>
        </section>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Wolverine Stack (BPC-157 + TB-500) — Research Protocol Guide',
            description: 'Complete research guide to the BPC-157 + TB-500 stack with mechanisms, protocols, and PubMed-cited preclinical data.',
            author: { '@type': 'Organization', name: 'NovaPure Labs' },
            publisher: { '@type': 'Organization', name: 'NovaPure Labs', url: 'https://peptidelifewellness.com' },
            datePublished: '2026-05-07',
            dateModified: '2026-05-07',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'Why is it called the Wolverine Stack?', acceptedAnswer: { '@type': 'Answer', text: 'Informal nickname referencing rapid regenerative themes observed in animal literature.' } },
              { '@type': 'Question', name: 'Can BPC-157 and TB-500 be researched together?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Preclinical studies frequently reference combined use for complementary tissue repair mechanisms.' } },
              { '@type': 'Question', name: 'What purity standards should be used?', acceptedAnswer: { '@type': 'Answer', text: 'For reproducible results, use HPLC-verified peptides with 99%+ purity. NovaPure Labs provides third-party COAs with every order.' } },
            ],
          }),
        }}
      />
    </div>
  );
}
