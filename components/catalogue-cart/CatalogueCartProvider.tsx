'use client';

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { getDraftProduct } from '@/lib/data/draftProducts';
import { CART_STORAGE_KEY, MAX_QUANTITY } from '@/lib/order-request/constants';

export type CatalogueCartLine = {
  slug: string;
  name: string;
  strength: string;
  image: string;
  quantity: number;
};

type StoredItem = { slug: string; quantity: number };

type AddResult = { added: number; total: number; capped: boolean };

type CatalogueCartContextValue = {
  lines: CatalogueCartLine[];
  itemCount: number;
  ready: boolean;
  addItem: (slug: string, quantity?: number) => AddResult | null;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CatalogueCartContext = createContext<CatalogueCartContextValue | undefined>(undefined);
const CART_CHANGE_EVENT = 'npl-catalogue-cart-change';
const EMPTY_SNAPSHOT = '[]';

function sanitize(value: unknown): StoredItem[] {
  if (!Array.isArray(value)) return [];
  const merged = new Map<string, number>();
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue;
    const slug = (entry as { slug?: unknown }).slug;
    const quantity = (entry as { quantity?: unknown }).quantity;
    if (typeof slug !== 'string' || !getDraftProduct(slug)) continue;
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) continue;
    merged.set(slug, Math.min(MAX_QUANTITY, (merged.get(slug) ?? 0) + quantity));
  }
  return [...merged.entries()].map(([slug, quantity]) => ({ slug, quantity }));
}

function readSnapshot() {
  try {
    return localStorage.getItem(CART_STORAGE_KEY) ?? EMPTY_SNAPSHOT;
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

function readItems() {
  try {
    return sanitize(JSON.parse(readSnapshot()));
  } catch {
    return [];
  }
}

function writeItems(items: StoredItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Private browsing or a full quota should not block the page.
  }
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(CART_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(CART_CHANGE_EVENT, onStoreChange);
  };
}

function subscribeHydration() {
  return () => {};
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

function getHydratedSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

function resolveLines(items: StoredItem[]): CatalogueCartLine[] {
  return items.flatMap((item) => {
    const product = getDraftProduct(item.slug);
    if (!product) return [];
    return [{
      slug: product.slug,
      name: product.name,
      strength: product.strength,
      image: product.image,
      quantity: item.quantity,
    }];
  });
}

export function CatalogueCartProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(subscribeHydration, getHydratedSnapshot, getServerHydrationSnapshot);
  const items = useMemo(() => {
    try {
      return sanitize(JSON.parse(snapshot));
    } catch {
      return [];
    }
  }, [snapshot]);

  const addItem = useCallback((slug: string, quantity = 1) => {
    if (!getDraftProduct(slug)) return null;
    const requested = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
    const prev = readItems();
    const current = prev.find((item) => item.slug === slug)?.quantity ?? 0;
    const total = Math.min(MAX_QUANTITY, current + requested);
    const next = current === 0
      ? [...prev, { slug, quantity: total }]
      : prev.map((item) => (item.slug === slug ? { slug, quantity: total } : item));
    writeItems(next);
    return { added: total - current, total, capped: current + requested > MAX_QUANTITY };
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    const prev = readItems();
    if (!Number.isInteger(quantity) || quantity < 1) {
      writeItems(prev.filter((item) => item.slug !== slug));
      return;
    }
    const next = Math.min(MAX_QUANTITY, quantity);
    writeItems(prev.map((item) => (item.slug === slug ? { slug, quantity: next } : item)));
  }, []);

  const removeItem = useCallback((slug: string) => {
    writeItems(readItems().filter((item) => item.slug !== slug));
  }, []);

  const clearCart = useCallback(() => writeItems([]), []);

  const lines = useMemo(() => resolveLines(items), [items]);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  const value = useMemo(
    () => ({ lines, itemCount, ready, addItem, updateQuantity, removeItem, clearCart }),
    [lines, itemCount, ready, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CatalogueCartContext.Provider value={value}>{children}</CatalogueCartContext.Provider>;
}

export function useCatalogueCart() {
  const context = useContext(CatalogueCartContext);
  if (!context) throw new Error('useCatalogueCart must be used within CatalogueCartProvider');
  return context;
}
