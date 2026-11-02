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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#bfc6cb] bg-[#f8f9f9] shadow-[0_-2px_10px_rgba(32,35,39,0.10)] sm:hidden" id="mobile-bottom-nav">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? 'text-[#526f82]' : 'text-black/40'
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
