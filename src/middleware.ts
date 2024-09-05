import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getCookie } from 'cookies-next'

export function middleware(req: NextRequest) {
  const token = getCookie('accessToken', { req })

  // Redirect to login if no token
  if (!token && req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/register') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect to dashboard if token exists on login page
  if (token && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/login', '/register', '/dashboard', '/about']
}
