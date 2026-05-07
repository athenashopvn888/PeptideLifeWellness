import { Mail, MapPin, Send } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact NovaPure Labs',
  description: 'Get in touch with NovaPure Labs. Questions about our educational content, wellness tracker, or peptide calculator? We are here to help.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-silver py-12 sm:py-20 px-4" id="contact-page">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-soft mb-4">
            <Mail size={28} className="text-blue" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy">Contact Us</h1>
          <p className="mt-3 text-gray max-w-md mx-auto">Have questions about our educational content, wellness tracker, or calculator? We would love to hear from you.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-border">
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-navy mb-1.5">Name</label>
                  <input id="contact-name" type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-navy mb-1.5">Email</label>
                  <input id="contact-email" type="email" placeholder="you@email.com" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-navy mb-1.5">Subject</label>
                <input id="contact-subject" type="text" placeholder="What is this about?" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-navy mb-1.5">Message</label>
                <textarea id="contact-message" rows={5} placeholder="Your message..." className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none" />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-blue text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-all shadow-md" id="contact-submit">
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-border">
              <Mail size={20} className="text-blue mb-2" />
              <h3 className="font-semibold text-navy text-sm">Email</h3>
              <p className="text-sm text-gray mt-1">info@novapurelabs.ca</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-border">
              <MapPin size={20} className="text-blue mb-2" />
              <h3 className="font-semibold text-navy text-sm">Location</h3>
              <p className="text-sm text-gray mt-1">Canada</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-border">
              <p className="text-xs text-gray leading-relaxed"><strong className="text-navy">Note:</strong> We provide educational content and wellness tools only. We cannot provide medical advice, prescriptions, or product recommendations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
