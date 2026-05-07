import { FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'NovaPure Labs terms of use. Review the terms and conditions for using our website, tools, and educational content.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-silver py-12 sm:py-20 px-4" id="terms-page">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-soft mb-4">
            <FileText size={28} className="text-blue" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy">Terms of Use</h1>
          <p className="mt-3 text-sm text-gray">Last updated: May 2025</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Acceptance of Terms</h2>
            <p className="text-gray leading-relaxed">By accessing and using NovaPure Labs (novapurelabs.ca), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use the website.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Educational Purpose</h2>
            <p className="text-gray leading-relaxed">All content on this website is provided for educational and informational purposes only. Nothing on this site constitutes medical advice, diagnosis, treatment recommendations, or prescription guidance. You acknowledge that you will consult a licensed healthcare professional before making any health-related decisions.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">User Accounts</h2>
            <p className="text-gray leading-relaxed">When you create an account, you are responsible for maintaining the security of your account credentials and for all activities under your account. You must provide accurate information and keep it up to date.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Acceptable Use</h2>
            <p className="text-gray leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-gray">
              <li>Use the website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the website</li>
              <li>Upload malicious code or interfere with the website operation</li>
              <li>Scrape, copy, or redistribute content without permission</li>
              <li>Use the tools for purposes other than personal wellness tracking</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Intellectual Property</h2>
            <p className="text-gray leading-relaxed">All content, design, and functionality on NovaPure Labs are the property of the site operators and are protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without express permission.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Calculator & Tracker Tools</h2>
            <p className="text-gray leading-relaxed">The calculator and tracker tools are provided as-is for educational and personal tracking purposes. We make no guarantees about the accuracy of calculations. You accept full responsibility for how you use these tools and any decisions you make based on their output.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Limitation of Liability</h2>
            <p className="text-gray leading-relaxed">NovaPure Labs shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the website or its content.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Changes to Terms</h2>
            <p className="text-gray leading-relaxed">We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">Governing Law</h2>
            <p className="text-gray leading-relaxed">These terms are governed by and construed in accordance with the laws of Canada.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
