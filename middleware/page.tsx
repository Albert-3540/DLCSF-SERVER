// middleware.ts (in the root of your project - same level as package.json)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/images',
  '/styles',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
  
  // Check if user is authenticated (check both cookie and localStorage)
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;
  
  // For testing: Also check if there's a user in localStorage (client-side)
  // This is a simplified version - in production, you'd use proper session management
  
  // If path is not public and user is not authenticated, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If user is authenticated and tries to access login/register, redirect to home
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};