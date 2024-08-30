import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getCookie } from 'cookies-next'

export function middleware(req: NextRequest) {
  const token = getCookie('token', { req })

  if (!token && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (token && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/register']
}
