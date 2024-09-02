import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { deleteCookie, getCookie } from 'cookies-next'

export function middleware(req: NextRequest) {
  const token = getCookie('accessToken', { req })
  const expires = getCookie('expires', { req })

  if (expires) {
    const expiresDate = new Date(expires as string)
    const currentDate = new Date()

    if (expiresDate <= currentDate) {
      // Token has expired, delete the cookie and redirect to login
      deleteCookie('accessToken', { req })
      deleteCookie('expires', { req })

      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  if (token && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/register', '/home', '/about', '/']
}
