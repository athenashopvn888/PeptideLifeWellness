import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
  'Product': [
    { href: '/products', label: 'All Products' },
    { href: '/coa', label: 'COA Library' },
    { href: '/calculator', label: 'Research Calculator' },
    { href: '/quiz', label: 'Research Quiz' },
  ],
  'Education': [
    { href: '/guides', label: 'Guide Library' },
    { href: '/news', label: 'Wellness News' },
    { href: '/safety-canada', label: 'Safety (Canada)' },
    { href: '/about', label: 'About Us' },
  ],
  'Legal': [
    { href: '/track', label: 'Track Order' },
    { href: '/contact', label: 'Contact' },
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Use' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#061b3a] pb-[calc(4rem+env(safe-area-inset-bottom,0px))] text-white sm:pb-0" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-5 block">
              <Image
                src="/images/nova-arctic/logo-horizontal-white.png"
                alt="Nova Pure Labs"
                width={680}
                height={245}
                className="h-auto w-52 rounded-sm"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/55">
              A clear, research-only product catalogue. Pricing and ordering information will be posted when confirmed.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/45">
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
              <strong className="text-white/70">Disclaimer:</strong> Nova Pure Labs provides research catalogue information and educational tools. This platform does not provide medical advice, diagnosis, treatment, prescription guidance, or dosing instructions. Catalogue products are for research use only and are not for human consumption.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Nova Pure Labs. All rights reserved.
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Research use only</p>
        </div>
      </div>
    </footer>
  );
}
