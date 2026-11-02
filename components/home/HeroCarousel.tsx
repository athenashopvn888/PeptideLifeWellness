'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calculator, FlaskConical, Pause, Play, ShieldCheck } from 'lucide-react';

const slides = [
  {
    image: '/images/nova-arctic/arctic-lab-wide.png',
    imageAlt: 'Arctic laboratory with glassware and research equipment',
    imageClass: 'object-cover object-center',
    eyebrow: 'Nova Pure Labs',
    title: 'Precision in every detail.',
    description: 'A modern research catalogue built around clear product identification, sourced scientific context, and transparent listing status.',
    primary: { href: '/products', label: 'View Products' },
    secondary: { href: '/guides', label: 'Research Guides' },
  },
  {
    image: '/images/nova-arctic/blank-vials-square.png',
    imageAlt: 'Unlabelled laboratory vials on a reflective surface',
    imageClass: 'object-cover object-[68%_center]',
    eyebrow: 'Research Catalogue',
    title: '18 products. Clearly presented.',
    description: 'Each listing pairs the supplied identity and strength with a dedicated detail page, research context, and an honest documentation status.',
    primary: { href: '/products', label: 'Browse Catalogue' },
    secondary: { href: '/safety-canada', label: 'Safety Information' },
  },
  {
    image: '/images/nova-arctic/molecular-structure-square.png',
    imageAlt: 'Arctic blue molecular structure visualization',
    imageClass: 'object-cover object-center',
    eyebrow: 'Research Resources',
    title: 'Context before conclusions.',
    description: 'Explore sourced research summaries, educational guides, calculation tools, and clear research-use boundaries in one place.',
    primary: { href: '/research', label: 'Explore Research' },
    secondary: { href: '/calculator', label: 'Open Calculator' },
  },
] as const;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (interactionPaused || userPaused || reducedMotion) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [interactionPaused, userPaused, reducedMotion]);

  const show = (index: number) => setActive((index + slides.length) % slides.length);

  return (
    <section
      className="relative isolate min-h-[620px] overflow-hidden border-b border-[#8fb6c5] bg-[#061b3a] sm:min-h-[570px]"
      aria-label="Nova Pure Labs highlights"
      aria-roledescription="carousel"
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setInteractionPaused(false);
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${index === active ? 'z-0 opacity-100' : 'pointer-events-none -z-10 opacity-0'}`}
          aria-hidden={index !== active}
        >
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            sizes="100vw"
            priority={index === 0}
            className={slide.imageClass}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-[rgba(4,21,48,.8)] sm:bg-[linear-gradient(90deg,rgba(4,21,48,.94)_0%,rgba(4,35,65,.82)_40%,rgba(5,45,72,.3)_72%,rgba(255,255,255,.04)_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.18)_0,rgba(255,255,255,.18)_1px,transparent_1px,transparent_12px)]" />

      <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-4 pb-28 pt-16 sm:min-h-[570px] sm:px-6 sm:pb-24 lg:px-8">
        <div className="max-w-2xl text-white" aria-live="polite">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e0e5]/45 bg-[#061b3a]/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#dce5ea] shadow-sm backdrop-blur sm:text-xs">
            <FlaskConical size={14} /> {slides[active].eyebrow}
          </div>
          <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[0.96] tracking-[-0.05em] sm:text-7xl">{slides[active].title}</h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{slides[active].description}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={slides[active].primary.href} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#061b3a] shadow-lg shadow-black/20 transition hover:bg-[#dce7ec]">
              {slides[active].primary.label} <ArrowRight size={17} />
            </Link>
            <Link href={slides[active].secondary.href} className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-[#061b3a]/35 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white hover:bg-[#061b3a]/60">
              {slides[active].secondary.label}
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-3 border-t border-white/25 pt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#d1dce2]">
            {active === 2 ? <Calculator size={16} /> : <ShieldCheck size={16} />} For research use only
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 sm:bottom-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2" aria-label={`Slide ${active + 1} of ${slides.length}`}>
            {slides.map((slide, index) => (
              <button
                key={slide.eyebrow}
                type="button"
                onClick={() => show(index)}
                className={`h-2.5 rounded-full border border-white/70 transition-all ${index === active ? 'w-10 bg-white' : 'w-2.5 bg-white/25 hover:bg-white/60'}`}
                aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`}
                aria-current={index === active ? 'true' : undefined}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setUserPaused((current) => !current)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-[#061b3a]/45 text-white backdrop-blur transition hover:border-white hover:bg-[#061b3a]/70" aria-label={userPaused ? 'Resume automatic slide rotation' : 'Pause automatic slide rotation'}>
              {userPaused ? <Play size={17} /> : <Pause size={17} />}
            </button>
            <button type="button" onClick={() => show(active - 1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-[#061b3a]/45 text-white backdrop-blur transition hover:border-white hover:bg-[#061b3a]/70" aria-label="Previous slide">
              <ArrowLeft size={18} />
            </button>
            <button type="button" onClick={() => show(active + 1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-[#061b3a]/45 text-white backdrop-blur transition hover:border-white hover:bg-[#061b3a]/70" aria-label="Next slide">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
