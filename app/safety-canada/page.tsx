import Link from 'next/link';
import { ShieldCheck, AlertTriangle, ExternalLink, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peptide Safety Canada | Educational Wellness Guide',
  description: 'Educational guide about peptide safety considerations for Canadian consumers. Learn about Health Canada regulations, sourcing safety, and informed decision-making.',
  openGraph: {
    title: 'Peptide Safety Canada | Educational Wellness Guide',
    description: 'Educational guide about peptide safety considerations for Canadian consumers.',
  },
};

export default function SafetyCanadaPage() {
  return (
    <div className="min-h-screen bg-silver" id="safety-canada-page">
      <section className="bg-navy text-white py-14 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
            <ShieldCheck size={32} className="text-green" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Peptide Safety in Canada</h1>
          <p className="mt-4 text-white/70 max-w-lg mx-auto">Educational guide about safety considerations, regulations, and informed decision-making for Canadian consumers.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
          <h2 className="text-2xl font-bold text-navy mb-4">Health Canada & Peptide Regulation</h2>
          <p className="text-gray leading-relaxed mb-4">Health Canada regulates prescription drugs, natural health products, and medical devices. Many peptides fall under prescription drug regulations, meaning they require a prescription from a licensed healthcare provider.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">Some peptides are classified as prescription drugs in Canada. Always verify the legal status of any product and consult with a healthcare professional.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
          <h2 className="text-2xl font-bold text-navy mb-4">Questions to Ask Before Purchasing</h2>
          <ol className="space-y-3">
            {[
              'Is this product legal to purchase in Canada?',
              'Does it require a prescription?',
              'What is the source and manufacturing quality?',
              'Has it been tested by a third party?',
              'Have I discussed this with my healthcare provider?',
            ].map((q, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-soft text-blue text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-gray-dark text-sm">{q}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
          <h2 className="text-2xl font-bold text-navy mb-4">Working With Healthcare Professionals</h2>
          <p className="text-gray leading-relaxed">The safest approach to any health decision is to work with licensed professionals who understand your individual health situation. A doctor, pharmacist, or naturopath can provide personalized guidance that no website can replace.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
          <h2 className="text-2xl font-bold text-navy mb-4">Reporting Concerns</h2>
          <p className="text-gray leading-relaxed mb-4">If you believe a product is unsafe or improperly marketed, you can report it to Health Canada through their online reporting system.</p>
          <a href="https://www.canada.ca/en/health-canada.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue font-medium hover:underline">
            Visit Health Canada <ExternalLink size={14} />
          </a>
        </div>

        <div className="bg-silver rounded-2xl p-6 sm:p-8 border border-border">
          <h3 className="text-lg font-semibold text-navy mb-4">Continue Your Education</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/quiz" className="bg-white p-4 rounded-xl border border-border hover:shadow-md transition-all flex items-center gap-3 group">
              <span className="text-sm font-medium text-navy group-hover:text-blue transition-colors">Take the Wellness Quiz</span>
              <ArrowRight size={14} className="text-gray-light ml-auto" />
            </Link>
            <Link href="/calculator" className="bg-white p-4 rounded-xl border border-border hover:shadow-md transition-all flex items-center gap-3 group">
              <span className="text-sm font-medium text-navy group-hover:text-blue transition-colors">Use Peptide Calculator</span>
              <ArrowRight size={14} className="text-gray-light ml-auto" />
            </Link>
            <Link href="/tracker" className="bg-white p-4 rounded-xl border border-border hover:shadow-md transition-all flex items-center gap-3 group">
              <span className="text-sm font-medium text-navy group-hover:text-blue transition-colors">Start Free Tracker</span>
              <ArrowRight size={14} className="text-gray-light ml-auto" />
            </Link>
            <Link href="/guides" className="bg-white p-4 rounded-xl border border-border hover:shadow-md transition-all flex items-center gap-3 group">
              <span className="text-sm font-medium text-navy group-hover:text-blue transition-colors">Browse Guide Library</span>
              <ArrowRight size={14} className="text-gray-light ml-auto" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-border">
          <p className="text-xs text-gray leading-relaxed"><strong className="text-navy">Disclaimer:</strong> This page is for educational purposes only and does not constitute legal or medical advice. Regulations change over time. Always verify current regulations with official government sources and consult a licensed healthcare professional for health decisions.</p>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Are peptides legal in Canada?', acceptedAnswer: { '@type': 'Answer', text: 'Many peptides are classified as prescription drugs in Canada and require a prescription from a licensed healthcare provider. Some topical peptide products may have different regulatory requirements. Always verify the legal status of any product.' }},
          { '@type': 'Question', name: 'Where can I report unsafe peptide products in Canada?', acceptedAnswer: { '@type': 'Answer', text: 'You can report unsafe or improperly marketed products to Health Canada through their online reporting system at canada.ca/en/health-canada.' }},
        ],
      })}} />
    </div>
  );
}
