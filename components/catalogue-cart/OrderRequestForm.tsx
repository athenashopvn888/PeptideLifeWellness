'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CANADIAN_PROVINCES, NO_CARD_NOTICE, ORDER_REFERENCE_PATTERN, PAYMENT_NOTICE, PRICE_TBA_NOTE, RESEARCH_USE_LABEL } from '@/lib/order-request/constants';
import { validateOrderRequest, type OrderField, type OrderFieldErrors } from '@/lib/order-request/validate';
import { useCatalogueCart } from '@/components/catalogue-cart/CatalogueCartProvider';
import CartLineList from '@/components/catalogue-cart/CartLineList';

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  notes: string;
  researchUseConfirmed: boolean;
};

const INITIAL_FORM: FormState = {
  fullName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  province: '',
  postalCode: '',
  country: 'Canada',
  notes: '',
  researchUseConfirmed: false,
};

const FIELD_IDS: Record<OrderField, string> = {
  fullName: 'order-full-name',
  email: 'order-email',
  phone: 'order-phone',
  street: 'order-street',
  city: 'order-city',
  province: 'order-province',
  postalCode: 'order-postal-code',
  country: 'order-country',
  items: 'order-items',
  notes: 'order-notes',
  researchUseConfirmed: 'order-research-use',
  form: 'order-form-error',
};

const controlClass = 'mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#13283b] outline-none transition focus:border-[#123d63] focus:ring-2 focus:ring-[#123d63]/20';

function isSuccess(value: unknown): value is { ok: true; reference: string } {
  if (!value || typeof value !== 'object') return false;
  const record = value as { ok?: unknown; reference?: unknown };
  return record.ok === true && typeof record.reference === 'string';
}

function isFailure(value: unknown): value is { ok: false; errors: OrderFieldErrors } {
  if (!value || typeof value !== 'object') return false;
  const record = value as { ok?: unknown; errors?: unknown };
  return record.ok === false && !!record.errors && typeof record.errors === 'object';
}

export default function OrderRequestForm() {
  const router = useRouter();
  const { lines, clearCart, ready } = useCatalogueCart();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<OrderFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const pendingFocus = useRef<OrderField | null>(null);
  const canada = form.country.trim().toLowerCase() === 'canada';
  const provinceValue = canada && !CANADIAN_PROVINCES.some((province) => province === form.province) ? '' : form.province;

  useEffect(() => {
    if (!pendingFocus.current) return;
    document.getElementById(FIELD_IDS[pendingFocus.current])?.focus();
    pendingFocus.current = null;
  }, [errors]);

  const setField = (key: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const focusFirstError = (nextErrors: OrderFieldErrors) => {
    pendingFocus.current = (Object.keys(nextErrors) as OrderField[]).find((key) => nextErrors[key]) ?? null;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    const payload = {
      ...form,
      items: lines.map((line) => ({ slug: line.slug, quantity: line.quantity })),
    };
    const validated = validateOrderRequest(payload);
    if (!validated.ok) {
      setErrors(validated.errors);
      focusFirstError(validated.errors);
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setErrors({});
    let accepted = false;

    try {
      const response = await fetch('/api/order-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body: unknown = await response.json().catch(() => null);
      if (response.ok && isSuccess(body) && ORDER_REFERENCE_PATTERN.test(body.reference)) {
        accepted = true;
        clearCart();
        router.push(`/order/confirmation?reference=${encodeURIComponent(body.reference)}`);
        return;
      }
      if (isFailure(body)) {
        setErrors(body.errors);
        focusFirstError(body.errors);
      } else {
        const nextErrors: OrderFieldErrors = { form: 'We could not submit the order request. Please try again.' };
        setErrors(nextErrors);
        focusFirstError(nextErrors);
      }
    } catch {
      const nextErrors: OrderFieldErrors = { form: 'We could not submit the order request. Check your connection and try again.' };
      setErrors(nextErrors);
      focusFirstError(nextErrors);
    } finally {
      if (!accepted) {
        submittingRef.current = false;
        setSubmitting(false);
      }
    }
  };

  if (!ready) {
    return <p className="rounded-3xl border border-[#c5d7e0] bg-white px-6 py-12 text-center text-sm font-semibold text-[#526f82]" aria-live="polite">Loading your cart.</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-[#c5d7e0] bg-white px-6 py-12 text-center shadow-[0_12px_35px_rgba(6,27,58,0.06)]">
        <h2 className="text-2xl font-black text-[#13283b]">Your cart is empty</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#566169]">Add catalogue listings before sending an order request. {PRICE_TBA_NOTE}.</p>
        <Link href="/products" className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#123d63] px-6 text-sm font-bold text-white transition hover:bg-[#061b3a]">Browse products</Link>
      </div>
    );
  }

  const errorEntries = Object.entries(errors).filter((entry): entry is [OrderField, string] => Boolean(entry[1]));

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        {errorEntries.length > 0 ? (
          <div id={FIELD_IDS.form} tabIndex={-1} role="alert" className="scroll-mt-28 rounded-2xl border border-[#e4b3be] bg-[#fff6f8] p-4 text-sm text-[#9f1239]">
            <p className="font-bold">{errors.form ?? 'Check the highlighted fields before submitting.'}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errorEntries.filter(([key]) => key !== 'form').map(([key, message]) => <li key={key}>{message}</li>)}
            </ul>
          </div>
        ) : null}

        <section className="rounded-3xl border border-[#c5d7e0] bg-white p-5 shadow-[0_12px_35px_rgba(6,27,58,0.06)] sm:p-7">
          <h2 className="text-lg font-black text-[#13283b]">Contact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" id={FIELD_IDS.fullName} error={errors.fullName} className="sm:col-span-2">
              <input id={FIELD_IDS.fullName} name="name" autoComplete="name" value={form.fullName} onChange={(event) => setField('fullName', event.target.value)} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? `${FIELD_IDS.fullName}-error` : undefined} className={inputClass(errors.fullName)} />
            </Field>
            <Field label="Email" id={FIELD_IDS.email} error={errors.email}>
              <input id={FIELD_IDS.email} name="email" type="email" autoComplete="email" value={form.email} onChange={(event) => setField('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${FIELD_IDS.email}-error` : undefined} className={inputClass(errors.email)} />
            </Field>
            <Field label="Phone" id={FIELD_IDS.phone} error={errors.phone}>
              <input id={FIELD_IDS.phone} name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setField('phone', event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? `${FIELD_IDS.phone}-error` : undefined} className={inputClass(errors.phone)} />
            </Field>
          </div>
        </section>

        <section className="rounded-3xl border border-[#c5d7e0] bg-white p-5 shadow-[0_12px_35px_rgba(6,27,58,0.06)] sm:p-7">
          <h2 className="text-lg font-black text-[#13283b]">Shipping address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Street" id={FIELD_IDS.street} error={errors.street} className="sm:col-span-2">
              <input id={FIELD_IDS.street} name="street-address" autoComplete="street-address" value={form.street} onChange={(event) => setField('street', event.target.value)} aria-invalid={Boolean(errors.street)} aria-describedby={errors.street ? `${FIELD_IDS.street}-error` : undefined} className={inputClass(errors.street)} />
            </Field>
            <Field label="City" id={FIELD_IDS.city} error={errors.city}>
              <input id={FIELD_IDS.city} name="city" autoComplete="address-level2" value={form.city} onChange={(event) => setField('city', event.target.value)} aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? `${FIELD_IDS.city}-error` : undefined} className={inputClass(errors.city)} />
            </Field>
            <Field label="Province" id={FIELD_IDS.province} error={errors.province}>
              {canada ? (
                <select id={FIELD_IDS.province} name="province" autoComplete="address-level1" value={provinceValue} onChange={(event) => setField('province', event.target.value)} aria-invalid={Boolean(errors.province)} aria-describedby={errors.province ? `${FIELD_IDS.province}-error` : undefined} className={inputClass(errors.province)}>
                  <option value="">Select a province</option>
                  {CANADIAN_PROVINCES.map((province) => <option key={province} value={province}>{province}</option>)}
                </select>
              ) : (
                <input id={FIELD_IDS.province} name="province" autoComplete="address-level1" value={form.province} onChange={(event) => setField('province', event.target.value)} aria-invalid={Boolean(errors.province)} aria-describedby={errors.province ? `${FIELD_IDS.province}-error` : undefined} className={inputClass(errors.province)} />
              )}
            </Field>
            <Field label="Postal code" id={FIELD_IDS.postalCode} error={errors.postalCode}>
              <input id={FIELD_IDS.postalCode} name="postal-code" autoComplete="postal-code" value={form.postalCode} onChange={(event) => setField('postalCode', event.target.value)} aria-invalid={Boolean(errors.postalCode)} aria-describedby={errors.postalCode ? `${FIELD_IDS.postalCode}-error` : undefined} className={inputClass(errors.postalCode)} />
            </Field>
            <Field label="Country" id={FIELD_IDS.country} error={errors.country}>
              <input id={FIELD_IDS.country} name="country" autoComplete="country-name" value={form.country} onChange={(event) => setField('country', event.target.value)} aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? `${FIELD_IDS.country}-error` : undefined} className={inputClass(errors.country)} />
            </Field>
          </div>
        </section>

        <section className="rounded-3xl border border-[#c5d7e0] bg-white p-5 shadow-[0_12px_35px_rgba(6,27,58,0.06)] sm:p-7">
          <Field label="Notes" id={FIELD_IDS.notes} error={errors.notes}>
            <textarea id={FIELD_IDS.notes} name="notes" rows={4} value={form.notes} onChange={(event) => setField('notes', event.target.value)} aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? `${FIELD_IDS.notes}-error` : undefined} className={`${inputClass(errors.notes)} resize-y`} />
          </Field>
        </section>
      </div>

      <div className="space-y-6">
        <section className="rounded-3xl border border-[#c5d7e0] bg-white p-5 shadow-[0_12px_35px_rgba(6,27,58,0.06)] sm:p-7">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-lg font-black text-[#13283b]">Cart items</h2>
            <Link href="/products" className="text-sm font-bold text-[#526f82] underline-offset-2 hover:underline">Add another</Link>
          </div>
          <div id={FIELD_IDS.items} tabIndex={-1} className="scroll-mt-28 mt-4">
            <CartLineList />
          </div>
          {errors.items ? <p id={`${FIELD_IDS.items}-error`} className="mt-3 text-sm font-semibold text-[#9f1239]">{errors.items}</p> : null}
          <p className="mt-4 text-sm font-bold text-[#13283b]">{PRICE_TBA_NOTE}</p>
        </section>

        <section className="rounded-3xl border border-[#9bbbc8] bg-[linear-gradient(135deg,#e6f5f9,#ffffff)] p-5 sm:p-7">
          <h2 className="text-lg font-black text-[#13283b]">Payment</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#334450]">{PAYMENT_NOTICE}</p>
          <p className="mt-2 text-sm leading-relaxed text-[#334450]">{NO_CARD_NOTICE}</p>
          <label className="mt-5 flex items-start gap-3 text-sm font-semibold leading-relaxed text-[#13283b]">
            <input
              id={FIELD_IDS.researchUseConfirmed}
              type="checkbox"
              checked={form.researchUseConfirmed}
              onChange={(event) => setField('researchUseConfirmed', event.target.checked)}
              aria-invalid={Boolean(errors.researchUseConfirmed)}
              aria-describedby={errors.researchUseConfirmed ? `${FIELD_IDS.researchUseConfirmed}-error` : undefined}
              className="mt-1 h-5 w-5 shrink-0 accent-[#123d63]"
            />
            <span>{RESEARCH_USE_LABEL}</span>
          </label>
          {errors.researchUseConfirmed ? <p id={`${FIELD_IDS.researchUseConfirmed}-error`} className="mt-2 text-sm font-semibold text-[#9f1239]">{errors.researchUseConfirmed}</p> : null}
          <button
            type="submit"
            id="order-submit"
            disabled={submitting}
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#123d63] px-6 text-sm font-bold text-white transition hover:bg-[#061b3a] disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123d63]"
          >
            {submitting ? 'Submitting request' : 'Submit order request'}
          </button>
        </section>
      </div>
    </form>
  );
}

function inputClass(error?: string) {
  return `${controlClass} ${error ? 'border-[#9f1239]' : 'border-[#c5d5de]'}`;
}

function Field({
  label,
  id,
  error,
  className,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`scroll-mt-28 ${className ?? ''}`}>
      <label htmlFor={id} className="text-sm font-bold text-[#13283b]">{label}</label>
      {children}
      {error ? <p id={`${id}-error`} className="mt-1.5 text-sm font-semibold text-[#9f1239]">{error}</p> : null}
    </div>
  );
}
