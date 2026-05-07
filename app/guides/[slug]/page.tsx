import { notFound } from 'next/navigation';
import Link from 'next/link';
import { articles, getArticleBySlug } from '@/lib/data/articles';
import { ArrowLeft, Clock, BookOpen, Calculator, FlaskConical, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      type: 'article',
      publishedTime: article.publishedDate,
      authors: ['NovaPure Labs'],
    },
    alternates: {
      canonical: `https://novapurelabs.ca/guides/${slug}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  // Simple markdown-like rendering (headings, paragraphs, lists, links, bold)
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let key = 0;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={key++} className="list-disc pl-6 space-y-2 text-gray-dark leading-relaxed">
            {listItems.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: processInline(item) }} />
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const processInline = (text: string): string => {
      return text
        .replace(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g, '<a href="$2" class="text-blue font-semibold hover:underline">$1</a>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue hover:underline">$1</a>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-navy">$1</strong>');
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList();
        continue;
      }

      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={key++} className="text-2xl font-bold text-navy mt-10 mb-4">
            {trimmed.slice(3)}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={key++} className="text-xl font-semibold text-navy mt-8 mb-3">
            {trimmed.slice(4)}
          </h3>
        );
      } else if (trimmed.startsWith('- ')) {
        listItems.push(trimmed.slice(2));
      } else if (/^\d+\.\s/.test(trimmed)) {
        listItems.push(trimmed.replace(/^\d+\.\s/, ''));
      } else {
        flushList();
        elements.push(
          <p
            key={key++}
            className="text-gray-dark leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processInline(trimmed) }}
          />
        );
      }
    }
    flushList();
    return elements;
  };

  const relatedArticles = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white" id={`article-${slug}`}>
      {/* Article Header */}
      <section className="bg-silver border-b border-border py-10 sm:py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-gray hover:text-navy transition-colors mb-6">
            <ArrowLeft size={16} />
            Back to Guide Library
          </Link>
          <span className="block text-xs font-medium text-blue bg-blue-soft px-2.5 py-1 rounded-full w-fit mb-4">
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy leading-tight">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {article.readTime}
            </span>
            <span>Published {new Date(article.publishedDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-4 py-10 sm:py-14 space-y-4">
        {renderContent(article.content)}

        {/* Internal Links CTA */}
        <div className="mt-12 bg-silver rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-navy mb-4">Continue Your Wellness Education</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/quiz', label: 'Take the Wellness Quiz', icon: BookOpen },
              { href: '/calculator', label: 'Use Peptide Calculator', icon: Calculator },
              { href: '/tracker', label: 'Start Free Tracker', icon: FlaskConical },
              { href: '/safety-canada', label: 'Read Safety Guide', icon: ShieldCheck },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-border hover:shadow-md transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-soft flex items-center justify-center shrink-0">
                  <link.icon size={16} className="text-blue" />
                </div>
                <span className="text-sm font-medium text-navy group-hover:text-blue transition-colors">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="bg-silver border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-navy mb-6">Related Guides</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {relatedArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/guides/${a.slug}`}
                className="bg-white rounded-xl p-5 border border-border hover:shadow-md transition-all group"
              >
                <span className="text-xs font-medium text-blue">{a.category}</span>
                <h3 className="mt-2 text-sm font-semibold text-navy group-hover:text-blue transition-colors leading-snug">
                  {a.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.seoDescription,
            datePublished: article.publishedDate,
            author: {
              '@type': 'Organization',
              name: 'NovaPure Labs',
            },
            publisher: {
              '@type': 'Organization',
              name: 'NovaPure Labs',
              logo: {
                '@type': 'ImageObject',
                url: 'https://novapurelabs.ca/images/novapure-circle.png',
              },
            },
            mainEntityOfPage: `https://novapurelabs.ca/guides/${slug}`,
          }),
        }}
      />
    </div>
  );
}
