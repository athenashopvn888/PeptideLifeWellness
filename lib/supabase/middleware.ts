import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Skip if Supabase not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // Refresh session
  const allCookies = request.cookies.getAll();
  const sbCookies = allCookies.filter(c => c.name.startsWith('sb-'));
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin')) {
    console.log(`[PROXY DEBUG] ${pathname} | sb-cookies: ${sbCookies.length} (${sbCookies.map(c => c.name).join(', ')}) | user: ${user?.id || 'NULL'} | error: ${userError?.message || 'none'}`);
  }

  // ── Admin route protection ──────────────────────────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin_roles — user must have an active role
    const { data: roleData } = await supabase
      .from('admin_roles')
      .select('role, is_active, department')
      .eq('user_id', user.id)
      .single();

    if (!roleData || !roleData.is_active) {
      // Authenticated but not an admin — redirect to login with error
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(loginUrl);
    }

    // Attach role info to headers for server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-role', roleData.role);
    requestHeaders.set('x-admin-department', roleData.department || '');
    requestHeaders.set('x-admin-user-id', user.id);

    response = NextResponse.next({ request: { headers: requestHeaders } });

    // Re-set cookies on the new response
    const cookiesToSet = request.cookies.getAll();
    cookiesToSet.forEach(({ name, value }) => response.cookies.set(name, value));
  }

  // ── Redirect logged-in admin away from login page ──────────────────
  if (pathname === '/admin/login' && user) {
    const { data: roleData } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (roleData) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // ── Legacy /app route protection ───────────────────────────────────
  if (pathname.startsWith('/app') && !user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/auth/') && user && !pathname.includes('callback')) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return response;
}
