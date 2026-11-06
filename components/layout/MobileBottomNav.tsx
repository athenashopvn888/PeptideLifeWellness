'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, List, Home } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: LayoutGrid },
    { href: '/guides', label: 'Guides', icon: List },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#b9d4df] bg-[#effafd]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(6,27,58,0.10)] backdrop-blur-md sm:hidden" id="mobile-bottom-nav">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? 'text-[#123d63]' : 'text-[#617887]'
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

      </div>
    </nav>
  );
}
