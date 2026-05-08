import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'novapure2026';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('x-admin-password');
  if (auth !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    urlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20) + '...'
      : 'MISSING',
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    keyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + '...'
      : 'MISSING',
    hasAdminPw: !!process.env.ADMIN_PASSWORD,
    nodeEnv: process.env.NODE_ENV,
  });
}
