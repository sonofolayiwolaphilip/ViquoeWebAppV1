import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Next.js 16 expects a named or default export function called 'proxy'
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Route protection guard rails
  if (!user && (path.startsWith('/buyer') || path.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user) {
    // Query their profile type role attribute to lock down partitions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile) {
      if (path.startsWith('/buyer') && profile.role !== 'buyer_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (path.startsWith('/dashboard') && profile.role !== 'supplier_admin') {
        return NextResponse.redirect(new URL('/buyer/rfq/new', request.url));
      }
    }
  }

  return response;
}

// Keep the same path matcher configuration
export const config = {
  matcher: ['/buyer/:path*', '/dashboard/:path*'],
};