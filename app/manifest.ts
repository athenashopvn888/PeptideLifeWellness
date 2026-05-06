import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Peptide Life Wellness',
    short_name: 'PLW Tracker',
    description:
      'Peptide education, daily wellness tracking, reminders, and safety-first guidance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f1b2d',
    orientation: 'portrait',
    categories: ['health', 'education', 'lifestyle'],
    icons: [
      {
        src: '/images/square logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/square logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/images/square logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
