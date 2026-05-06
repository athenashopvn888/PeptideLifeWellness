import Link from 'next/link';
import { articles } from '@/lib/data/articles';
import { Newspaper, Clock, ArrowRight, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wellness News | Peptide Research Updates & Education',
  description: 'Stay updated with safety-first wellness news, peptide research summaries, and practical education written in clear language.',
};

export default function NewsPage() {
  const newsArticles = articles.filter((a) => a.category === 'Wellness News' || a.category === 'Safety and Regulations');

  return (
    <div className="min-h-screen bg-silver" id="news-page">
      <section className="bg-white border-b border-border py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-soft mb-4">
            <Newspaper size={28} className="text-green" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy">Wellness News</h1>
          <p className="mt-3 text-gray max-w-lg mx-auto">Safety-first updates, research summaries, and practical education written in clear language.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article) => (
            <Link key={article.slug} href={`/guides/${article.slug}`} className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border">
              <div className="h-36 bg-gradient-to-br from-green-soft to-blue-soft flex items-center justify-center">
                <Newspaper size={36} className="text-green/30" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-green bg-green-soft px-2 py-0.5 rounded-full">{article.category}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-light"><Clock size={12} />{article.readTime}</span>
                </div>
                <h2 className="text-base font-semibold text-navy group-hover:text-blue transition-colors leading-snug">{article.title}</h2>
                <p className="mt-2 text-sm text-gray leading-relaxed line-clamp-2">{article.excerpt}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue">Read More <ArrowRight size={14} /></div>
              </div>
            </Link>
          ))}
        </div>

        {newsArticles.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={40} className="text-gray-light mx-auto mb-4" />
            <p className="text-gray">Wellness news articles coming soon. Check back for updates!</p>
          </div>
        )}
      </section>
    </div>
  );
}
