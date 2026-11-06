export const CART_STORAGE_KEY = 'npl-catalogue-cart:v1';

export const MAX_QUANTITY = 99;

export const MAX_NOTES_LENGTH = 2000;

export const PRICE_TBA_NOTE = 'Price TBA - quote sent by email';

export const PAYMENT_NOTICE =
  'Payment is by Interac e-Transfer only. We will email a quote with e-Transfer instructions after reviewing the order.';

export const NO_CARD_NOTICE = 'No card payment is taken on this site.';

export const RESEARCH_USE_LABEL =
  'I confirm these products are for laboratory research use only, not for human or animal consumption';

export const ORDER_REFERENCE_PATTERN = /^NPL-\d{8}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/;

export const CANADIAN_PROVINCES = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Northwest Territories',
  'Nunavut',
  'Yukon',
] as const;

export type CanadianProvince = (typeof CANADIAN_PROVINCES)[number];
