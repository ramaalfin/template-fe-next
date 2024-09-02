import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getCookie } from 'cookies-next'

export function middleware(req: NextRequest) {
  const token = getCookie('accessToken', { req })

  // user can access login page and register page without token

  if (!token && req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/register') {
    return
  }

  if (token && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/login', '/register', '/dashboard', '/about', '/']
}
