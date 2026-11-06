import type { ReactNode } from 'react';

export default function CompactPageHeader({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <header className="border-b border-[#b7d3de] bg-[linear-gradient(180deg,#f7fcfe_0%,#e7f3f8_100%)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 sm:py-7 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#526f82]">{eyebrow}</p>
          <h1 className="mt-1.5 text-3xl font-black tracking-tight text-[#13283b] sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#566169] sm:text-base">{description}</p>
        </div>
        {aside}
      </div>
    </header>
  );
}
