import { randomInt } from 'node:crypto';
import { getDraftProduct } from '@/lib/data/draftProducts';
import type { ValidatedOrderRequest } from '@/lib/order-request/validate';

const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export type BuiltOrderItem = {
  slug: string;
  name: string;
  strength: string;
  image: string;
  quantity: number;
};

export type BuiltOrderRequest = {
  reference: string;
  submittedAt: string;
  paymentMethod: 'interac-e-transfer';
  paymentStatus: 'quote-pending';
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  items: BuiltOrderItem[];
  notes: string;
  researchUseConfirmed: true;
};

export function createOrderReference(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const year = parts.find((part) => part.type === 'year')?.value ?? '0000';
  const month = parts.find((part) => part.type === 'month')?.value ?? '00';
  const day = parts.find((part) => part.type === 'day')?.value ?? '00';
  let suffix = '';
  for (let index = 0; index < 4; index += 1) {
    suffix += REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)];
  }
  return `NPL-${year}${month}${day}-${suffix}`;
}

export function buildOrderRequest(
  value: ValidatedOrderRequest,
  reference: string,
  submittedAt = new Date().toISOString(),
): BuiltOrderRequest {
  return {
    reference,
    submittedAt,
    paymentMethod: 'interac-e-transfer',
    paymentStatus: 'quote-pending',
    customer: {
      fullName: value.fullName,
      email: value.email,
      phone: value.phone,
    },
    shippingAddress: {
      street: value.street,
      city: value.city,
      province: value.province,
      postalCode: value.postalCode,
      country: value.country,
    },
    items: value.items.map((item) => {
      const product = getDraftProduct(item.slug);
      if (!product) throw new Error('Catalogue product missing after validation.');
      return {
        slug: product.slug,
        name: product.name,
        strength: product.strength,
        image: product.image,
        quantity: item.quantity,
      };
    }),
    notes: value.notes,
    researchUseConfirmed: true,
  };
}
