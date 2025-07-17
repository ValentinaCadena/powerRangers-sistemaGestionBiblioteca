// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si el usuario no está logueado y trata de acceder a una ruta protegida (que no sea /login)
  if (!session && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Si el usuario YA está logueado y trata de acceder a /login, redirigirlo al dashboard
  if (session && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/transacciones', req.url))
  }

  return res
}

// Configura el middleware para que se ejecute en las rutas relevantes
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de petición excepto por las siguientes:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (archivo de icono)
     * El objetivo es ejecutarlo en todas las páginas de la app.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}