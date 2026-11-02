import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nova Pure Labs',
    short_name: 'Nova Pure',
    description:
      'Research product catalogue, educational guides, calculator, and safety information.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    categories: ['health', 'education', 'lifestyle'],
    icons: [
      {
        src: '/images/novapure-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/novapure-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/images/novapure-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
