import type { Metadata } from 'next';
import QuizFlow from '@/components/quiz/QuizFlow';
import { ClipboardList } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Peptide Wellness Quiz | Find Your Wellness Focus',
  description:
    'Answer a few simple questions and get a personalized educational wellness focus based on your goals, experience level, and tracking needs.',
  openGraph: {
    title: 'Peptide Wellness Quiz | Find Your Wellness Focus',
    description:
      'Answer a few simple questions and get a personalized educational wellness focus based on your goals, experience level, and tracking needs.',
  },
};

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-silver py-12 sm:py-20 px-4" id="quiz-page">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-soft mb-4">
            <ClipboardList size={28} className="text-blue" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy">
            Find Your Peptide Wellness Focus
          </h1>
          <p className="mt-3 text-gray max-w-md mx-auto">
            Answer a few simple questions and get a personalized educational wellness focus.
          </p>
        </div>
        <QuizFlow />
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
                name: 'What is the Peptide Wellness Quiz?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The Peptide Wellness Quiz is a free educational assessment that helps you identify your wellness focus areas based on your goals, experience level, and tracking preferences.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is the quiz free?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, the quiz is completely free. You can optionally create an account to save your results and access the wellness tracker.',
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
