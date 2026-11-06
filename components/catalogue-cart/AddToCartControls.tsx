'use client';

import { useEffect, useRef, useState } from 'react';
import { MAX_QUANTITY } from '@/lib/order-request/constants';
import { useCatalogueCart } from '@/components/catalogue-cart/CatalogueCartProvider';
import QuantityStepper from '@/components/catalogue-cart/QuantityStepper';

type CartProduct = {
  slug: string;
  name: string;
  strength: string;
};

export default function AddToCartControls({
  product,
  variant,
}: {
  product: CartProduct;
  variant: 'card' | 'detail';
}) {
  const { addItem } = useCatalogueCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<number | null>(null);
  const label = `${product.name} ${product.strength}`;

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  const onAdd = () => {
    const result = addItem(product.slug, quantity);
    const nextMessage = !result
      ? 'This listing could not be added.'
      : result.added === 0
        ? `${label} is already at the maximum quantity of ${MAX_QUANTITY}.`
        : result.capped
          ? `Added ${label}. Cart quantity is limited to ${MAX_QUANTITY}.`
          : `Added ${result.added} × ${label} to the cart.`;
    setMessage(nextMessage);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className={variant === 'card' ? 'mt-3' : 'mt-4'}>
      <div className={variant === 'detail' ? 'flex flex-col gap-3 sm:flex-row sm:items-center' : 'space-y-2'}>
        <QuantityStepper
          id={`add-qty-${product.slug}`}
          label={`Quantity for ${label}`}
          value={quantity}
          onChange={setQuantity}
          fullWidth={variant === 'card'}
        />
        <button
          type="button"
          id={`add-to-cart-${product.slug}`}
          onClick={onAdd}
          className={`inline-flex h-11 items-center justify-center rounded-full bg-[#123d63] px-4 text-sm font-bold text-white transition hover:bg-[#061b3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123d63] ${variant === 'detail' ? 'w-full sm:w-auto sm:min-w-40' : 'w-full'}`}
        >
          Add to cart
        </button>
      </div>
      <p className="mt-2 min-h-5 text-xs font-semibold text-[#123d63]" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
