import { NextResponse } from 'next/server';

// Temporary diagnostic endpoint — remove after setup
export async function GET() {
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
    adminPwPreview: process.env.ADMIN_PASSWORD
      ? process.env.ADMIN_PASSWORD.substring(0, 4) + '...'
      : 'MISSING (using default)',
    nodeEnv: process.env.NODE_ENV,
  });
}
