import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NovaPure Labs',
    short_name: 'NovaPure',
    description:
      'Lab-tested research peptides, 99%+ purity. Free peptide calculator, research guides, and wellness tracker.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f1b2d',
    orientation: 'portrait',
    categories: ['health', 'education', 'lifestyle'],
    icons: [
      {
        src: '/images/novapure-circle.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/novapure-circle.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/images/novapure-circle.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
