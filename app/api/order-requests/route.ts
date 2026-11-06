import { NextResponse } from 'next/server';
import { buildOrderRequest, createOrderReference, type BuiltOrderRequest } from '@/lib/order-request/build';
import { validateOrderRequest, type OrderFieldErrors } from '@/lib/order-request/validate';

export const runtime = 'nodejs';

/**
 * TODO: Email delivery is not wired yet.
 *
 * Recipient address: not configured.
 * Provider: not configured.
 *
 * Do not add an email address, API key, environment variable, secret, or provider
 * SDK in this placeholder. The built order is accepted so the request flow can
 * finish, and it is intentionally not sent or stored.
 *
 * When this is replaced, deliver the built order to the operations recipient and
 * send the customer a note that a quote is coming. Interac e-Transfer instructions
 * belong in that later email, after review. This file must not contain an
 * e-Transfer address.
 */
async function sendOrderRequestEmailPlaceholder(order: BuiltOrderRequest): Promise<void> {
  // TODO: recipient address and provider go here.
  void order.reference;
}

function errorResponse(errors: OrderFieldErrors, status: number) {
  return NextResponse.json({ ok: false, errors }, { status });
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return errorResponse({ form: 'Submit the order request as JSON.' }, 415);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse({ form: 'The order request could not be read.' }, 400);
  }

  const validated = validateOrderRequest(payload);
  if (!validated.ok) return errorResponse(validated.errors, 400);

  const reference = createOrderReference();
  const order = buildOrderRequest(validated.value, reference);
  await sendOrderRequestEmailPlaceholder(order);

  console.info(`Order request built: ${order.reference}`);
  return NextResponse.json({ ok: true, reference: order.reference }, { status: 201 });
}
