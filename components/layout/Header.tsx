'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useCatalogueCart } from '@/components/catalogue-cart/CatalogueCartProvider';

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/coa', label: 'COA Library' },
  { href: '/guides', label: 'Guides' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/research', label: 'Research' },
  { href: '/safety-canada', label: 'Safety' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-[#b9d4df] bg-white/95 text-[#061b3a] shadow-[0_8px_25px_rgba(6,27,58,.08)] backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="flex items-center" id="header-logo" aria-label="Nova Pure Labs home">
          <Image
            src="/images/nova-arctic/logo-black-transparent.png"
            alt="Nova Pure Labs"
            width={2191}
            height={718}
            priority
            className="h-auto w-48 sm:w-56"
          />
        </Link>

        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive(link.href) ? 'bg-[#123d63] text-white shadow-sm' : 'text-[#40586b] hover:bg-[#d8edf4] hover:text-[#061b3a]'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <CartMenuLink />
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="rounded-full border border-[#a9c6d1] bg-white/65 p-2.5 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            id="mobile-menu-toggle"
          >
            {isOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="border-t border-[#bed7e0] bg-[#eaf8fc] px-4 py-4 lg:hidden" id="mobile-menu" aria-label="Mobile navigation">
          <div className="mx-auto max-w-7xl space-y-1">
            <Link href="/cart" onClick={() => setIsOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#40586b] hover:bg-[#d8edf4] hover:text-[#061b3a]">Cart</Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold ${isActive(link.href) ? 'bg-[#123d63] text-white' : 'text-[#40586b] hover:bg-[#d8edf4] hover:text-[#061b3a]'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function CartMenuLink() {
  const { itemCount, ready } = useCatalogueCart();
  const count = ready ? itemCount : 0;
  const label = ready ? `Cart, ${count} ${count === 1 ? 'item' : 'items'}` : 'Cart';

  return (
    <Link
      href="/cart"
      id="header-cart-link"
      aria-label={label}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#a9c6d1] bg-white/65 text-[#061b3a] transition hover:bg-[#d8edf4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123d63]"
    >
      <ShoppingBag size={20} aria-hidden="true" />
      {ready ? (
        <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#123d63] px-1 text-[10px] font-bold text-white">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </Link>
  );
}
