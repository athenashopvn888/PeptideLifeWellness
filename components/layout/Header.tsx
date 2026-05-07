'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/lab-testing', label: 'Lab Testing' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/guides', label: 'Guides' },
  { href: '/research', label: 'Research' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, setIsOpen: setCartOpen } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0" id="header-logo">
            <Image
              src="/images/novapure-circle.png"
              alt="NovaPure Labs"
              width={56}
              height={56}
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
            />
            <span className="text-navy font-bold text-base sm:text-lg leading-tight">
              NovaPure Labs
            </span>
          </Link>

          {/* Desktop Search Bar — center */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search peptides..."
                className="w-full pl-4 pr-12 py-2.5 rounded-full border border-border bg-silver text-sm text-navy placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center hover:bg-navy-light transition-colors"
              >
                <Search size={14} />
              </button>
            </div>
          </form>

          {/* Right side: Search(mobile) + Cart + Menu */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-dark hover:bg-silver transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg text-gray-dark hover:bg-silver transition-colors"
              aria-label="Open cart"
              id="header-cart"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-green text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
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

      {/* Desktop nav bar — second row */}
      <nav className="hidden lg:block bg-navy" id="desktop-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop')) || (link.href === '/research' && pathname.startsWith('/research'))
                    ? 'text-white bg-white/15 rounded'
                    : 'text-white/80 hover:text-white hover:bg-white/10 rounded'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile search bar (expandable) */}
      {searchOpen && (
        <div className="lg:hidden border-t border-border bg-white px-4 py-3 animate-fade-in">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search peptides..."
              autoFocus
              className="w-full pl-4 pr-12 py-3 rounded-full border border-border bg-silver text-sm text-navy placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-navy text-white rounded-full flex items-center justify-center"
            >
              <Search size={16} />
            </button>
          </form>
        </div>
      )}

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
                  pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop')) || (link.href === '/research' && pathname.startsWith('/research'))
                    ? 'text-blue bg-blue-soft'
                    : 'text-gray-dark hover:bg-silver'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
