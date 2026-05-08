import { notFound } from 'next/navigation';
import { products } from '@/lib/data/products';
import { getProductBySlug as getDBProduct, getPublishedProducts } from '@/lib/supabase/productService';
import ProductDetail from '@/components/shop/ProductDetail';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getDBProduct(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | ${product.subtitle}`,
    description: product.description,
    openGraph: {
      title: `${product.name} - ${product.subtitle} | NovaPure Labs`,
      description: product.description,
      images: [{ url: product.image, width: 600, height: 800, alt: product.name }],
    },
    alternates: {
      canonical: `https://novapurelabs.ca/shop/${slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getDBProduct(slug);
  if (!product) notFound();

  const allProducts = await getPublishedProducts();
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <ProductDetail product={product} relatedProducts={related} />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://peptidelifewellness.com' },
              { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://peptidelifewellness.com/shop' },
              { '@type': 'ListItem', position: 3, name: product.name, item: `https://peptidelifewellness.com/shop/${product.slug}` },
            ],
          }),
        }}
      />

      {/* Enhanced Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: `https://peptidelifewellness.com${product.image}`,
            brand: { '@type': 'Brand', name: 'NovaPure Labs' },
            category: product.category,
            sku: product.id,
            ...(product.purity && { additionalProperty: [
              { '@type': 'PropertyValue', name: 'Purity', value: product.purity },
              { '@type': 'PropertyValue', name: 'Testing Method', value: 'HPLC' },
              { '@type': 'PropertyValue', name: 'COA Included', value: 'Yes' },
              ...(product.volume ? [{ '@type': 'PropertyValue', name: 'Volume', value: product.volume }] : []),
            ]}),
            offers: {
              '@type': 'Offer',
              price: product.price.toFixed(2),
              priceCurrency: 'CAD',
              availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              url: `https://peptidelifewellness.com/shop/${product.slug}`,
              seller: { '@type': 'Organization', name: 'NovaPure Labs' },
              priceValidUntil: '2027-12-31',
            },
            ...(product.reviewCount > 0 && {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating.toString(),
                reviewCount: product.reviewCount.toString(),
              },
            }),
          }),
        }}
      />

      {/* Product FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `What is ${product.name}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: product.description,
                },
              },
              {
                '@type': 'Question',
                name: `What purity is ${product.name}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `${product.name} from NovaPure Labs is HPLC tested at ${product.purity || '99%+'} purity. A Certificate of Analysis (COA) is included with every order.`,
                },
              },
              {
                '@type': 'Question',
                name: `How should ${product.name} be stored?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Store lyophilized peptides at -20°C for long-term storage. Once reconstituted with bacteriostatic water, store at 2-8°C (refrigerated) and use within 30 days. Avoid direct sunlight and repeated freeze-thaw cycles.',
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
