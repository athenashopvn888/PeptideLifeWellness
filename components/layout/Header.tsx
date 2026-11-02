'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/products', label: 'Products' },
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

      {isOpen && (
        <nav className="border-t border-[#bed7e0] bg-[#eaf8fc] px-4 py-4 lg:hidden" id="mobile-menu" aria-label="Mobile navigation">
          <div className="mx-auto max-w-7xl space-y-1">
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
