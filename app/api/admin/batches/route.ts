import { NextRequest, NextResponse } from 'next/server';
import { listBatches, getBatchById, createBatch, signOffBatch, merchandiseBatch, publishBatchLive } from '@/lib/supabase/batchService';
import { getCurrentAdminProfile } from '@/lib/supabase/authService';

export async function GET(req: NextRequest) {
  const caller = await getCurrentAdminProfile();
  if (!caller || !caller.isActive) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const batch = await getBatchById(id);
    if (!batch) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(batch);
  }

  const status = searchParams.get('status') || undefined;
  const productId = searchParams.get('product_id') || undefined;
  const batches = await listBatches({ status, productId });
  return NextResponse.json(batches);
}

export async function POST(req: NextRequest) {
  const caller = await getCurrentAdminProfile();
  if (!caller || !caller.isActive) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  try {
    const batch = await createBatch({
      poId: body.poId,
      productId: body.productId,
      receivedQty: body.receivedQty,
      batchNumber: body.batchNumber,
      lotNumber: body.lotNumber,
      expiryDate: body.expiryDate,
      packingSlipPhotoUrl: body.packingSlipPhotoUrl,
      receivedByUserId: caller.userId,
    });
    return NextResponse.json(batch, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const caller = await getCurrentAdminProfile();
  if (!caller || !caller.isActive) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { action, batchId } = body;

  try {
    let result;
    switch (action) {
      case 'sign_off':
        result = await signOffBatch(batchId, caller.userId);
        break;
      case 'merchandise':
        result = await merchandiseBatch(batchId, caller.userId);
        break;
      case 'publish_live':
        result = await publishBatchLive(batchId);
        break;
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
