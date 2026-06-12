'use client';

import { usePathname } from 'next/navigation';

/**
 * Wraps the root layout's public chrome (Header, Footer, etc.).
 * Hides them entirely when the user is on /admin/* routes.
 */
export default function PublicChromeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return null;
  return <>{children}</>;
}
