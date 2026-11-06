'use client';

import { Minus, Plus } from 'lucide-react';
import { MAX_QUANTITY } from '@/lib/order-request/constants';

export default function QuantityStepper({
  id,
  label,
  value,
  onChange,
  min = 1,
  max = MAX_QUANTITY,
  fullWidth = false,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  fullWidth?: boolean;
}) {
  const apply = (next: number) => {
    if (!Number.isInteger(next)) return;
    onChange(Math.min(max, Math.max(min, next)));
  };

  return (
    <div className={`inline-flex h-11 items-center rounded-full border border-[#a9c6d1] bg-white ${fullWidth ? 'flex w-full' : ''}`}>
      <button
        type="button"
        className={`inline-flex h-11 shrink-0 items-center justify-center rounded-full text-[#123d63] transition hover:bg-[#d8edf4] disabled:cursor-not-allowed disabled:text-[#9aafba] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123d63] ${fullWidth ? 'w-9' : 'w-11'}`}
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => apply(value - 1)}
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <label htmlFor={id} className="sr-only">{label}</label>
      <input
        id={id}
        value={value}
        inputMode="numeric"
        pattern="[0-9]*"
        onChange={(event) => {
          if (event.target.value.trim() === '') return;
          const next = Number.parseInt(event.target.value, 10);
          apply(next);
        }}
        className={`border-0 bg-transparent text-center text-sm font-bold text-[#13283b] outline-none ${fullWidth ? 'min-w-0 flex-1' : 'w-12'}`}
      />
      <button
        type="button"
        className={`inline-flex h-11 shrink-0 items-center justify-center rounded-full text-[#123d63] transition hover:bg-[#d8edf4] disabled:cursor-not-allowed disabled:text-[#9aafba] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123d63] ${fullWidth ? 'w-9' : 'w-11'}`}
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => apply(value + 1)}
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
