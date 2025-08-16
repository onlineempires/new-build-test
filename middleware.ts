import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware to admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for admin session in cookies or headers
    // Note: In a client-side app, we'll rely on the React components for protection
    // This middleware is primarily for additional security and API protection
    
    // For now, we'll let the React components handle the redirect logic
    // In a full production app with server-side authentication, 
    // you would validate the session here and redirect if invalid
    
    // Example of how you might check authentication:
    // const adminSession = request.cookies.get('adminSession');
    // const adminLoginTime = request.cookies.get('adminLoginTime');
    
    // if (!adminSession || !adminLoginTime) {
    //   return NextResponse.redirect(new URL('/admin/login', request.url));
    // }
    
    // For our current localStorage-based approach, we'll pass through
    // and let the client-side components handle authentication
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};