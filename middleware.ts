import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Force Node.js runtime for bcrypt and postgres compatibility
  runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - file extensions (png, jpg, jpeg, gif, svg, webp, ico, css, js)
     */
    '/((?!api|_next/static|_next/image|.*\\.(png|jpg|jpeg|gif|svg|webp|ico|css|js)$|favicon.ico|public).*)'
  ],
};