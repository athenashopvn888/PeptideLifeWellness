import Link from 'next/link';
import { articles, categories } from '@/lib/data/articles';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peptide Education Guide Library',
  description:
    'Browse our library of educational peptide guides covering beginner education, calculator guides, wellness tracking, safety, skin care, and healthy aging.',
  openGraph: {
    title: 'Peptide Education Guide Library | Peptide Life Wellness',
    description:
      'Browse our library of educational peptide guides covering beginner education, calculator guides, wellness tracking, safety, and more.',
  },
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-silver" id="guides-page">
      {/* Header */}
      <section className="bg-white border-b border-border py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-soft mb-4">
            <BookOpen size={28} className="text-blue" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy">
            Peptide Education Guide Library
          </h1>
          <p className="mt-3 text-gray max-w-lg mx-auto">
            Safety-first educational content on peptide wellness, calculators, tracking, and research.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-border text-gray-dark hover:border-blue hover:text-blue transition-colors cursor-pointer"
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/guides/${article.slug}`}
              className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border"
              id={`guide-${article.slug}`}
            >
              <div className="h-36 bg-gradient-to-br from-blue-soft to-green-soft flex items-center justify-center">
                <BookOpen size={36} className="text-blue/30" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-blue bg-blue-soft px-2 py-0.5 rounded-full">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-light">
                    <Clock size={12} />
                    {article.readTime}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-navy group-hover:text-blue transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm text-gray leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue">
                  Read Guide <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
