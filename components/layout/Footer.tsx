import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

const footerLinks = {
  'Product': [
    { href: '/quiz', label: 'Wellness Quiz' },
    { href: '/calculator', label: 'Peptide Calculator' },
    { href: '/tracker', label: 'Tracker App' },
    { href: '/journal', label: 'Wellness Journal' },
  ],
  'Education': [
    { href: '/guides', label: 'Guide Library' },
    { href: '/news', label: 'Wellness News' },
    { href: '/safety-canada', label: 'Safety (Canada)' },
    { href: '/about', label: 'About Us' },
  ],
  'Legal': [
    { href: '/contact', label: 'Contact' },
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Use' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy text-white" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/novapure-circle.png"
                alt="NovaPure Labs"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="font-bold text-lg">NovaPure Labs</span>
            </Link>
            <p className="text-sm text-gray-light leading-relaxed">
              Pharmaceutical-grade research peptides. Third-party tested. COA with every order.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-light mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-6">
            <p className="text-xs text-white/50 leading-relaxed">
              <strong className="text-white/70">Disclaimer:</strong> NovaPure Labs provides educational content, research tools, and lab-tested research compounds. This platform does not provide medical advice, diagnosis, treatment, prescription guidance, or dosing instructions. All products are for research purposes only. Always speak with a licensed healthcare professional before using prescription, injectable, or regulated health products.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} NovaPure Labs. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-white/40">
            Built with <Heart size={12} className="text-green" /> for precision research
          </p>
        </div>
      </div>
    </footer>
  );
}
