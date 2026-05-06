import type { Metadata } from 'next';
import PeptideCalculator from '@/components/calculator/PeptideCalculator';
import { Calculator } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Peptide Calculator | Educational Peptide Unit & Concentration Tool',
  description:
    'Free educational peptide calculator for understanding units, concentration, and reconstitution. Use our tool to learn about peptide math — always confirm with a licensed professional.',
  openGraph: {
    title: 'Peptide Calculator | Educational Peptide Unit & Concentration Tool',
    description:
      'Free educational peptide calculator for understanding units, concentration, and reconstitution.',
  },
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-silver py-12 sm:py-20 px-4" id="calculator-page">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-soft mb-4">
            <Calculator size={28} className="text-green" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy">
            Peptide Calculator
          </h1>
          <p className="mt-3 text-gray max-w-md mx-auto">
            Use our educational calculator to better understand units, concentration, and tracking.
          </p>
        </div>
        <PeptideCalculator />
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How does the peptide calculator work?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Enter the vial amount in mg, the liquid volume added in mL, and the desired amount in mcg. The calculator estimates the units needed based on your syringe size. This is for educational purposes only.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is the peptide calculator medical advice?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No. This calculator is for educational tracking purposes only and is not medical advice. Always confirm any health decisions with a licensed healthcare professional.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is peptide reconstitution?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Reconstitution is the process of adding liquid to a lyophilized (freeze-dried) peptide to prepare it for use. The concentration depends on the amount of liquid added to the vial. This is an educational explanation only.',
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
