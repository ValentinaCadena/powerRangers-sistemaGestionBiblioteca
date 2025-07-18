import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession() // Esta línea es crucial, refresca la sesión
  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login|auth/callback).*)',
  ],
}