import { Lock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'NovaPure Labs privacy policy. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-silver py-12 sm:py-20 px-4" id="privacy-page">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-soft mb-4">
            <Lock size={28} className="text-blue" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy">Privacy Policy</h1>
          <p className="mt-3 text-sm text-gray">Last updated: May 2025</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Information We Collect</h2>
            <p className="text-gray leading-relaxed mb-3">When you use NovaPure Labs, we may collect the following information:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-gray">
              <li><strong className="text-navy">Account Information:</strong> Email address and name when you create an account</li>
              <li><strong className="text-navy">Quiz Responses:</strong> Your answers to the wellness quiz, used to provide personalized educational focus</li>
              <li><strong className="text-navy">Tracker Data:</strong> Wellness ratings, notes, and routine items you voluntarily enter</li>
              <li><strong className="text-navy">Contact Information:</strong> Name, email, and message content when you use the contact form</li>
              <li><strong className="text-navy">Usage Data:</strong> Anonymous analytics about how you use the website</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm text-gray">
              <li>To provide and maintain the wellness tracker and calculator tools</li>
              <li>To personalize your educational experience based on quiz results</li>
              <li>To send wellness updates if you opt in</li>
              <li>To respond to your contact form submissions</li>
              <li>To improve our website and services</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Data Storage & Security</h2>
            <p className="text-gray leading-relaxed">Your data is stored securely using Supabase, which provides enterprise-grade security including encryption at rest and in transit. We implement Row Level Security (RLS) to ensure users can only access their own data.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Data Sharing</h2>
            <p className="text-gray leading-relaxed">We do not sell, trade, or share your personal information with third parties for marketing purposes. We may share data with service providers (e.g., hosting, analytics) who assist in operating our website, subject to confidentiality agreements.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm text-gray">
              <li>Access your personal data at any time through your account</li>
              <li>Export your tracker data as CSV</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Cookies</h2>
            <p className="text-gray leading-relaxed">We use essential cookies for authentication and session management. We may use analytics cookies to understand website usage. You can control cookie preferences through your browser settings.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Contact</h2>
            <p className="text-gray leading-relaxed">For privacy-related questions, contact us at info@novapurelabs.ca.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
