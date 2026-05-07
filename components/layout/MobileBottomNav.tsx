'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, List, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, setIsOpen } = useCart();

  const navItems = [
    { href: '/shop', label: 'Shop', icon: LayoutGrid },
    { href: '/guides', label: 'Guides', icon: List },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.08)]" id="mobile-bottom-nav">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? 'text-navy' : 'text-gray'
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Cart button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-gray relative"
        >
          <ShoppingCart size={22} strokeWidth={1.5} />
          {itemCount > 0 && (
            <span className="absolute top-2 right-1/4 bg-green text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="text-[10px] font-medium">Cart</span>
        </button>
      </div>
    </nav>
  );
}
