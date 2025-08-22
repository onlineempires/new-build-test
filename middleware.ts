import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Session configuration
export const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long_for_production',
  cookieName: 'admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24, // 24 hours
  },
};

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Special handling for logout route
  if (pathname === '/logout') {
    // Allow access to logout page always
    return NextResponse.next();
  }

  // Special handling for logout API
  if (pathname === '/api/auth/logout') {
    // Always allow logout API calls
    return NextResponse.next();
  }

  // Special handling for login page
  if (pathname === '/admin/login') {
    const adminSession = request.cookies.get('admin_session');
    const adminLoginTime = request.cookies.get('admin_login_time');
    
    // Check if coming from logout or with forceLogin flag
    const isFromLogout = searchParams.get('logout') === 'true';
    const isForceLogin = searchParams.get('forceLogin') === 'true';
    const isExpired = searchParams.get('expired') === 'true';
    
    // If coming from logout or forcing login, clear any existing cookies
    if (isFromLogout || isForceLogin || isExpired) {
      const response = NextResponse.next();
      response.cookies.delete('admin_session');
      response.cookies.delete('admin_login_time');
      response.cookies.delete('auth_token');
      
      // Add header to prevent caching
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      
      console.log('[Middleware] Clearing cookies for login page due to logout/forceLogin/expired flag');
      return response;
    }
    
    // If there's a valid session and not forcing login, let the page handle redirect
    if (adminSession && adminLoginTime) {
      const loginTime = parseInt(adminLoginTime.value);
      const currentTime = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000;
      
      // Check if session is expired
      if (currentTime - loginTime > sessionDuration) {
        console.log('[Middleware] Expired session detected on login page, clearing cookies');
        const response = NextResponse.next();
        response.cookies.delete('admin_session');
        response.cookies.delete('admin_login_time');
        response.cookies.delete('auth_token');
        return response;
      }
    }
    
    // Allow access to login page
    return NextResponse.next();
  }

  // Check if user is trying to access protected admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for admin session in cookies
    const adminSession = request.cookies.get('admin_session');
    const adminLoginTime = request.cookies.get('admin_login_time');
    
    // Validate session exists
    if (!adminSession || !adminLoginTime) {
      console.log('[Middleware] No admin session found, redirecting to login');
      // Clear any stale cookies when redirecting
      const response = NextResponse.redirect(new URL('/admin/login?expired=true', request.url));
      response.cookies.delete('admin_session');
      response.cookies.delete('admin_login_time');
      response.cookies.delete('auth_token');
      return response;
    }
    
    // Check session expiry (24 hours)
    const loginTime = parseInt(adminLoginTime.value);
    const currentTime = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (currentTime - loginTime > sessionDuration) {
      console.log('[Middleware] Admin session expired, redirecting to login');
      const response = NextResponse.redirect(new URL('/admin/login?expired=true', request.url));
      // Clear expired session cookies
      response.cookies.delete('admin_session');
      response.cookies.delete('admin_login_time');
      response.cookies.delete('auth_token');
      return response;
    }
    
    // Valid session - add security headers for admin routes
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    
    // Log admin access for audit purposes
    console.log(`[Audit] Admin access: ${pathname} at ${new Date().toISOString()}`);
    
    return response;
  }
  
  // Apply security headers to API routes
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    
    // For API routes that modify data (except auth routes), check for session
    if (request.method !== 'GET' && 
        pathname.startsWith('/api/admin/') && 
        !pathname.startsWith('/api/auth/')) {
      const adminSession = request.cookies.get('admin_session');
      if (!adminSession) {
        return NextResponse.json(
          { error: 'Unauthorized: Admin session required' },
          { status: 401 }
        );
      }
    }
    
    return response;
  }

  // For the root path, check if there's an expired or invalid session
  if (pathname === '/') {
    const adminSession = request.cookies.get('admin_session');
    const adminLoginTime = request.cookies.get('admin_login_time');
    
    // If there are session cookies but they're invalid/expired, clear them
    if (adminSession || adminLoginTime) {
      const loginTime = adminLoginTime ? parseInt(adminLoginTime.value) : 0;
      const currentTime = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000;
      
      if (!loginTime || (currentTime - loginTime > sessionDuration)) {
        console.log('[Middleware] Clearing expired session cookies on dashboard access');
        const response = NextResponse.next();
        response.cookies.delete('admin_session');
        response.cookies.delete('admin_login_time');
        response.cookies.delete('auth_token');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/logout',
    '/admin/:path*',
    '/api/:path*',
  ],
};