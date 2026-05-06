import Link from 'next/link';
import Image from 'next/image';
import {
  FlaskConical, Bell, CalendarCheck, BarChart3, Download,
  Smartphone, CheckCircle, ArrowRight, TrendingUp, Moon,
  Zap, Smile, Heart, Droplets, Scale
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peptide Tracker App | Daily Wellness Reminders & Logs',
  description:
    'Free peptide wellness tracker app with daily logs, reminders, wellness ratings, weekly summaries, and CSV export. Install as a PWA on your phone.',
  openGraph: {
    title: 'Peptide Tracker App | Daily Wellness Reminders & Logs',
    description: 'Free peptide wellness tracker app with daily logs, reminders, and wellness pattern tracking.',
  },
};

const trackingFeatures = [
  { icon: Moon, label: 'Sleep Rating', color: 'text-indigo-500' },
  { icon: Zap, label: 'Energy Level', color: 'text-amber-500' },
  { icon: Smile, label: 'Mood Rating', color: 'text-green' },
  { icon: Heart, label: 'Recovery', color: 'text-red-400' },
  { icon: Droplets, label: 'Skin Rating', color: 'text-blue' },
  { icon: Scale, label: 'Weight', color: 'text-gray' },
];

export default function TrackerPage() {
  return (
    <div className="min-h-screen" id="tracker-page">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light text-white py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium mb-6">
              <Smartphone size={14} />
              FREE PWA APP
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Your Daily <span className="text-green">Wellness</span> Tracker
            </h1>
            <p className="mt-5 text-white/70 text-lg leading-relaxed">
              Build a simple daily routine, set reminders, log notes, and track wellness patterns over time.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 bg-green text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md" id="tracker-signup-cta">
                <FlaskConical size={18} />
                Start Free Tracker
              </Link>
              <button className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all" id="tracker-install-cta">
                <Download size={18} />
                Install Free App
              </button>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 w-full max-w-xs border border-white/10">
              <div className="text-center mb-4">
                <p className="text-xs text-white/50">Today&apos;s Check-In</p>
                <p className="text-lg font-bold">Wednesday, May 7</p>
              </div>
              <div className="space-y-3">
                {trackingFeatures.map((f) => (
                  <div key={f.label} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <f.icon size={16} className={f.color} />
                      <span className="text-sm">{f.label}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((n) => (
                        <div key={n} className={`w-2 h-2 rounded-full ${n <= 3 ? 'bg-green' : 'bg-white/20'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-green text-white py-3 rounded-xl text-sm font-semibold">
                <CheckCircle size={16} className="inline mr-1" />
                Complete Check-In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy">Everything You Need to Stay Consistent</h2>
            <p className="mt-3 text-gray max-w-lg mx-auto">Simple tools designed for daily wellness tracking — not medical dosing.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FlaskConical, title: 'Add Routine Items', desc: 'Create your personal wellness routine with custom items, categories, and notes.' },
              { icon: Bell, title: 'Smart Reminders', desc: 'Set daily or weekly reminders to stay consistent with your routine.' },
              { icon: CalendarCheck, title: 'Daily Check-In', desc: 'Quick wellness ratings for sleep, energy, mood, recovery, skin, and weight.' },
              { icon: BarChart3, title: 'Weekly Summary', desc: 'See your wellness patterns at a glance with visual weekly summaries.' },
              { icon: Download, title: 'Export as CSV', desc: 'Download your complete history to share with healthcare providers.' },
              { icon: Smartphone, title: 'Install as PWA', desc: 'Add to your phone home screen for instant access — no app store needed.' },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-border bg-white hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-soft flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-blue" />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">{f.title}</h3>
                <p className="text-sm text-gray leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-silver px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">Ready to Start Tracking?</h2>
          <p className="text-gray mb-8 max-w-lg mx-auto">Create your free account and start building consistent wellness habits today.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-blue text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-blue-dark transition-all shadow-md">
            Start Free Tracker <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* WebApplication Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication',
        name: 'Peptide Life Wellness Tracker', url: 'https://peptidelifewellness.com/tracker',
        description: 'Free peptide wellness tracker app with daily logs, reminders, and wellness pattern tracking.',
        applicationCategory: 'HealthApplication', operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
      })}} />
    </div>
  );
}
