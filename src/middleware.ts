import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token-client')?.value
  const tokenData = token ? JSON.parse(token) : null
  const accessToken = tokenData ? tokenData.access.token : null

  if (!accessToken && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (accessToken && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile', '/login', '/dashboard']
}
