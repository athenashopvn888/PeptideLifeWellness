'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    image: '/images/nova-banner-main.png',
    title: 'Pharmaceutical Grade Peptides for Scientific Research',
    subtitle: 'Canadian-Sourced · Independently Verified · For Lab Use Only',
    cta: 'Browse Peptides',
    ctaHref: '/shop',
  },
  {
    image: '/images/nova-banner-5.png',
    title: '99.5% Purity. Every Batch HPLC Tested.',
    subtitle: 'Certificate of Analysis included with every order',
    cta: 'View Lab Results',
    ctaHref: '/lab-testing',
  },
  {
    image: '/images/nova-banner-3.png',
    title: 'Trusted by Researchers Across Canada',
    subtitle: 'Free shipping on orders over $199 · Discreet packaging',
    cta: 'Shop Now',
    ctaHref: '/shop',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + slides.length) % slides.length);
  }, [current, goToSlide]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative overflow-hidden" id="hero-carousel">
      <div className="relative min-h-[400px] sm:min-h-[480px] lg:min-h-[540px]">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-600 ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy/75 via-navy/50 to-transparent" />

            {/* Slide content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 h-full flex items-center min-h-[400px] sm:min-h-[480px] lg:min-h-[540px]">
              <div className={`max-w-lg transition-all duration-500 ${
                index === current ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-[1.15] tracking-tight">
                  {slide.title}
                </h1>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/80 leading-relaxed">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.ctaHref}
                  className="mt-5 sm:mt-6 inline-flex items-center justify-center bg-white text-navy px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold hover:bg-silver transition-all duration-200 shadow-lg"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
          aria-label="Previous slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
          aria-label="Next slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === current
                  ? 'w-8 h-3 bg-white'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
