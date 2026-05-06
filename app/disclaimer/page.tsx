import { ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Peptide Life Wellness disclaimer. This platform provides educational content and wellness tracking tools only — not medical advice.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-silver py-12 sm:py-20 px-4" id="disclaimer-page">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-soft mb-4">
            <ShieldCheck size={28} className="text-green" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy">Disclaimer</h1>
          <p className="mt-3 text-sm text-gray">Last updated: May 2025</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border prose-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Educational Content Only</h2>
            <p className="text-gray leading-relaxed">Peptide Life Wellness provides educational content and wellness tracking tools only. This platform does not provide medical advice, diagnosis, treatment, prescription guidance, or dosing instructions.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">No Medical Claims</h2>
            <p className="text-gray leading-relaxed">We do not make claims about the effectiveness of any peptide for treating, curing, preventing, or diagnosing any medical condition. No content on this website should be interpreted as a health claim, medical recommendation, or therapeutic promise.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Consult a Healthcare Professional</h2>
            <p className="text-gray leading-relaxed">Always speak with a licensed healthcare professional before using prescription, injectable, or regulated health products. Do not start, stop, or modify any health regimen based solely on information found on this website.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Calculator Disclaimer</h2>
            <p className="text-gray leading-relaxed">The Peptide Calculator provided on this website is for educational tracking purposes only and is not medical advice. Always confirm any health decisions with a licensed healthcare professional. We are not responsible for any errors in calculation or misuse of the tool.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Tracker App Disclaimer</h2>
            <p className="text-gray leading-relaxed">The Wellness Tracker is a habit-tracking and journaling tool. It does not replace professional medical monitoring, diagnosis, or treatment planning. Data entered into the tracker is for personal use only.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">No Guarantee of Accuracy</h2>
            <p className="text-gray leading-relaxed">While we strive to provide accurate and up-to-date information, we make no warranties or guarantees about the completeness, reliability, or accuracy of any content on this site. Regulations, research findings, and best practices change over time.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Limitation of Liability</h2>
            <p className="text-gray leading-relaxed">Peptide Life Wellness and its operators shall not be held liable for any damages arising from the use of this website, its tools, or its content. Use of this website is at your own risk.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
