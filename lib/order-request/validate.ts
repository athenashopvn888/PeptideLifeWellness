import { getDraftProduct } from '@/lib/data/draftProducts';
import {
  CANADIAN_PROVINCES,
  MAX_NOTES_LENGTH,
  MAX_QUANTITY,
  type CanadianProvince,
} from '@/lib/order-request/constants';

export type OrderField =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'street'
  | 'city'
  | 'province'
  | 'postalCode'
  | 'country'
  | 'items'
  | 'notes'
  | 'researchUseConfirmed'
  | 'form';

export type OrderFieldErrors = Partial<Record<OrderField, string>>;

export type ValidatedOrderRequest = {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  items: { slug: string; quantity: number }[];
  notes: string;
  researchUseConfirmed: true;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_PATTERN = /^[\p{L}][\p{L}\p{M} .'-]{1,119}$/u;
const CANADA_POSTAL_PATTERN = /^[A-Z]\d[A-Z]\d[A-Z]\d$/;

function asRecord(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  return input as Record<string, unknown>;
}

function collapse(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function readString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function canonicalProvince(value: string): CanadianProvince | null {
  const match = CANADIAN_PROVINCES.find((province) => province.toLowerCase() === value.toLowerCase());
  return match ?? null;
}

function normalizePostalCode(value: string, canada: boolean) {
  const compact = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!canada) return collapse(value);
  if (!CANADA_POSTAL_PATTERN.test(compact)) return collapse(value).toUpperCase();
  return `${compact.slice(0, 3)} ${compact.slice(3)}`;
}

export function validateOrderRequest(
  input: unknown,
): { ok: true; value: ValidatedOrderRequest } | { ok: false; errors: OrderFieldErrors } {
  const record = asRecord(input);
  if (!record) {
    return { ok: false, errors: { form: 'The order request could not be read.' } };
  }

  const errors: OrderFieldErrors = {};
  const fullName = collapse(readString(record.fullName));
  const email = collapse(readString(record.email)).toLowerCase();
  const phone = collapse(readString(record.phone));
  const street = collapse(readString(record.street));
  const city = collapse(readString(record.city));
  const provinceInput = collapse(readString(record.province));
  const countryInput = collapse(readString(record.country));
  const country = countryInput.toLowerCase() === 'canada' ? 'Canada' : countryInput;
  const canada = country === 'Canada';
  const postalCode = normalizePostalCode(readString(record.postalCode), canada);
  const notes = readString(record.notes).trim();

  if (!NAME_PATTERN.test(fullName)) {
    errors.fullName = 'Enter the full name for this order request.';
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    errors.email = 'Enter a valid email address.';
  }
  if (/[A-Za-z]/.test(phone) || phone.replace(/\D/g, '').length < 10 || phone.replace(/\D/g, '').length > 15) {
    errors.phone = 'Enter a phone number with 10 to 15 digits.';
  }
  if (street.length < 5 || street.length > 120) {
    errors.street = 'Enter the street address.';
  }
  if (city.length < 2 || city.length > 80) {
    errors.city = 'Enter the city.';
  }
  if (country.length < 2 || country.length > 60) {
    errors.country = 'Enter the country.';
  }

  const province = canada ? canonicalProvince(provinceInput) : provinceInput;
  if (canada && !province) {
    errors.province = 'Select a Canadian province or territory.';
  } else if (!canada && (provinceInput.length < 2 || provinceInput.length > 80)) {
    errors.province = 'Enter the province, state, or region.';
  }

  if (canada && !CANADA_POSTAL_PATTERN.test(postalCode.replace(' ', ''))) {
    errors.postalCode = 'Enter a Canadian postal code, such as A1A 1A1.';
  } else if (!canada && (postalCode.length < 2 || postalCode.length > 16)) {
    errors.postalCode = 'Enter the postal code.';
  }

  if (typeof record.notes !== 'string' && typeof record.notes !== 'undefined') {
    errors.notes = 'Notes must be text.';
  } else if (notes.length > MAX_NOTES_LENGTH) {
    errors.notes = `Notes must be ${MAX_NOTES_LENGTH} characters or fewer.`;
  }

  const items = readItems(record.items, errors);

  if (record.researchUseConfirmed !== true) {
    errors.researchUseConfirmed = 'Confirm that these products are for laboratory research use only.';
  }

  if (Object.keys(errors).length > 0 || !items) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      fullName,
      email,
      phone,
      street,
      city,
      province: province ?? provinceInput,
      postalCode,
      country,
      items,
      notes,
      researchUseConfirmed: true,
    },
  };
}

function readItems(value: unknown, errors: OrderFieldErrors) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.items = 'Add at least one catalogue product.';
    return null;
  }

  const items: { slug: string; quantity: number }[] = [];
  const seen = new Set<string>();

  for (const entry of value) {
    const record = asRecord(entry);
    const slug = record ? readString(record.slug) : '';
    const quantity = record?.quantity;
    if (!getDraftProduct(slug)) {
      errors.items = 'One or more products are not in the catalogue.';
      return null;
    }
    if (seen.has(slug)) {
      errors.items = 'Each product can appear only once.';
      return null;
    }
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      errors.items = `Quantity must be a whole number from 1 to ${MAX_QUANTITY}.`;
      return null;
    }
    seen.add(slug);
    items.push({ slug, quantity });
  }

  return items;
}
