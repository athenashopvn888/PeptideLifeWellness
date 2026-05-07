'use client';

export default function AnnouncementBar() {
  return (
    <div className="bg-navy text-white overflow-hidden py-2 border-b border-white/10" id="announcement-bar">
      <div className="animate-marquee flex whitespace-nowrap gap-12">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wide">
            <span className="text-green">⚡</span> Free Shipping On All Orders Over $199
            <span className="text-white/30 mx-4">|</span>
            <span className="text-green">🔬</span> Every Batch HPLC Tested
            <span className="text-white/30 mx-4">|</span>
            <span className="text-green">📋</span> COA Included With Every Order
            <span className="text-white/30 mx-4">|</span>
            <span className="text-green">🇨🇦</span> Canadian-Sourced &amp; Shipped
          </span>
        ))}
      </div>
    </div>
  );
}
