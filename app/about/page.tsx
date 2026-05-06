import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, BookOpen, Heart, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Peptide Life Wellness',
  description: 'Learn about Peptide Life Wellness — our mission to provide safety-first peptide education, wellness tracking tools, and research summaries for informed consumers.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white" id="about-page">
      <section className="bg-silver py-14 sm:py-20 px-4 border-b border-border">
        <div className="max-w-3xl mx-auto text-center">
          <Image src="/images/circle logo.png" alt="Peptide Life Wellness" width={80} height={80} className="rounded-full mx-auto mb-6" />
          <h1 className="text-3xl sm:text-4xl font-bold text-navy">About Peptide Life Wellness</h1>
          <p className="mt-4 text-gray max-w-lg mx-auto">Safety-first peptide education, wellness tracking, and informed guidance for consumers who value transparency.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-navy mb-4">Our Mission</h2>
          <p className="text-gray leading-relaxed">Peptide Life Wellness exists to provide clear, accessible, and compliant educational content about peptides. We believe that everyone deserves access to well-organized information — without the hype, misinformation, or aggressive marketing that is common in this space.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, title: 'Education First', desc: 'Clear, accessible content written for real people — not researchers or salespeople.' },
            { icon: ShieldCheck, title: 'Safety Always', desc: 'We never make medical claims and always recommend consulting licensed professionals.' },
            { icon: Heart, title: 'Built With Care', desc: 'Every feature is designed to support informed decision-making and consistent wellness habits.' },
          ].map((v) => (
            <div key={v.title} className="p-5 rounded-2xl bg-silver border border-border text-center">
              <v.icon size={24} className="text-blue mx-auto mb-3" />
              <h3 className="font-semibold text-navy text-sm mb-1">{v.title}</h3>
              <p className="text-xs text-gray">{v.desc}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-navy mb-4">What We Offer</h2>
          <ul className="space-y-3">
            {[
              'Free Peptide Wellness Quiz to identify your educational focus',
              'Educational Peptide Calculator for understanding units and concentration',
              'Daily Wellness Tracker with reminders, ratings, and CSV export',
              'Guide Library with safety-first educational articles',
              'Canadian safety information and regulatory guidance',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-dark">
                <div className="w-5 h-5 rounded-full bg-green-soft flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-navy mb-4">Our Commitment to Compliance</h2>
          <p className="text-gray leading-relaxed">We do not make medical claims. We do not prescribe, diagnose, or recommend treatments. Our content is educational, and we encourage every visitor to consult with licensed healthcare professionals before making health decisions.</p>
        </div>

        <div className="text-center pt-4">
          <Link href="/quiz" className="inline-flex items-center gap-2 bg-blue text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-all shadow-md">
            Take the Free Quiz <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
