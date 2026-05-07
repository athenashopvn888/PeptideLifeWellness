import Link from 'next/link';
import { BookOpen, TrendingUp, CalendarCheck, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wellness Journal | Track Your Daily Wellness Patterns',
  description: 'Use the NovaPure Labs Journal to track sleep, energy, mood, recovery, and skin patterns over time. Build better wellness habits with daily logging.',
};

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-silver py-12 sm:py-20 px-4" id="journal-page">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-soft mb-4">
            <BookOpen size={28} className="text-blue" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy">Wellness Journal</h1>
          <p className="mt-3 text-gray max-w-md mx-auto">Track your daily wellness patterns and build awareness of what supports your wellbeing.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg border border-border space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">What Is the Wellness Journal?</h2>
            <p className="text-gray leading-relaxed">The Wellness Journal is part of the NovaPure Labs Tracker. It allows you to log daily ratings for sleep, energy, mood, recovery, and skin — along with notes about your day. Over time, these entries create a picture of your wellness patterns.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: TrendingUp, title: 'Daily Ratings', desc: 'Rate sleep, energy, mood, recovery, and skin from 1-5 each day.' },
              { icon: CalendarCheck, title: 'Weekly Summaries', desc: 'See your patterns at a glance with automated weekly summaries.' },
            ].map((f) => (
              <div key={f.title} className="p-5 rounded-xl bg-silver border border-border">
                <f.icon size={20} className="text-blue mb-2" />
                <h3 className="font-semibold text-navy text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link href="/tracker" className="inline-flex items-center gap-2 bg-blue text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-all shadow-md">
              Start Free Tracker <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
