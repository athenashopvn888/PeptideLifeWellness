import { notFound } from 'next/navigation';
import { products, getProductBySlug } from '@/lib/data/products';
import ProductDetail from '@/components/shop/ProductDetail';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | ${product.subtitle}`,
    description: product.description,
    openGraph: {
      title: `${product.name} - ${product.subtitle} | Peptide Life Wellness`,
      description: product.description,
      images: [{ url: product.image, width: 600, height: 800, alt: product.name }],
    },
    alternates: {
      canonical: `https://peptidelifewellness.com/shop/${slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <ProductDetail product={product} relatedProducts={related} />

      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: `https://peptidelifewellness.com${product.image}`,
            brand: { '@type': 'Brand', name: 'Peptide Life Wellness' },
            offers: {
              '@type': 'Offer',
              price: product.price.toFixed(2),
              priceCurrency: 'CAD',
              availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              url: `https://peptidelifewellness.com/shop/${product.slug}`,
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating.toString(),
              reviewCount: product.reviewCount.toString(),
            },
          }),
        }}
      />
    </>
  );
}
