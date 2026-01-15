import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle Docusaurus docs routes
  // If path is /docs/PageName (no trailing slash, no extension), serve index.html
  if (pathname.startsWith('/docs/') && !pathname.endsWith('/') && !pathname.match(/\.[^/]+$/)) {
    // Check if this is a directory (has index.html)
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = `${pathname}/index.html`;
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/docs/:path*',
};









