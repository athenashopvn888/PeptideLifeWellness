import { NextRequest, NextResponse } from 'next/server';
import {
  getCustomers, getCustomerById, updateCustomer,
  addCRMNote, resolveCRMNote, deleteCRMNote, getPendingFollowUps
} from '@/lib/supabase/crmService';
import { getCurrentAdminProfile } from '@/lib/supabase/authService';

async function checkAuth() {
  const profile = await getCurrentAdminProfile();
  return profile?.isActive ? profile : null;
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const search = searchParams.get('search') || undefined;
  const vip = searchParams.get('vip') === 'true';
  const action = searchParams.get('action');

  try {
    if (action === 'followups') return NextResponse.json(await getPendingFollowUps());
    if (id) return NextResponse.json(await getCustomerById(id));
    return NextResponse.json(await getCustomers({ search, vip }));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    return NextResponse.json(await updateCustomer(id, updates));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  try {
    const body = await req.json();
    if (action === 'resolve') return NextResponse.json(await resolveCRMNote(body.noteId));
    if (action === 'delete') { await deleteCRMNote(body.noteId); return NextResponse.json({ ok: true }); }
    return NextResponse.json(await addCRMNote(body));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
