'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/tracker', label: 'Tracker' },
  { href: '/guides', label: 'Guides' },
  { href: '/safety-canada', label: 'Safety' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, setIsOpen: setCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" id="header-logo">
            <Image
              src="/images/square logo.png"
              alt="Peptide Life Wellness"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="hidden sm:inline text-navy font-bold text-lg">
              Peptide Life Wellness
            </span>
            <span className="sm:hidden text-navy font-bold text-sm">
              PLW
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" id="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'))
                    ? 'text-blue bg-blue-soft'
                    : 'text-gray-dark hover:text-blue hover:bg-silver'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Cart + Mobile menu */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-lg text-gray-dark hover:bg-silver transition-colors"
              aria-label="Open cart"
              id="header-cart"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Shop CTA */}
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center gap-2 bg-blue text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-dark transition-colors duration-200 shadow-sm"
              id="header-cta"
            >
              <ShoppingBag size={16} />
              Shop Now
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-dark hover:bg-silver transition-colors"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-white animate-fade-in" id="mobile-menu">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'))
                    ? 'text-blue bg-blue-soft'
                    : 'text-gray-dark hover:bg-silver'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border">
              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-blue text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-colors"
              >
                <ShoppingBag size={16} />
                Shop Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
