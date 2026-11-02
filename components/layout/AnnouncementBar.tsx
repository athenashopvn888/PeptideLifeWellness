'use client';

export default function AnnouncementBar() {
  return (
    <div className="overflow-hidden border-b border-white/10 bg-black py-2.5 text-white" id="announcement-bar">
      <div className="flex items-center justify-center px-4 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-white/65 sm:text-xs">
        New research catalogue · Product details available · Pricing TBA
      </div>
    </div>
  );
}
