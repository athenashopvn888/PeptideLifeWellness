'use client';

export default function AnnouncementBar() {
  return (
    <div className="border-b border-white/10 bg-[#061b3a] text-white" id="announcement-bar">
      <p className="whitespace-nowrap px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#d6dde1] sm:px-4 sm:py-2.5 sm:text-xs sm:tracking-[0.22em]">
        <span className="sm:hidden">Research catalogue · Pricing TBA</span>
        <span className="hidden sm:inline">New research catalogue · Product details available · Pricing TBA</span>
      </p>
    </div>
  );
}
