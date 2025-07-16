import '../styles/globals.css'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ClientProvider from '@/components/ClientProvider'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="es">
      <body>
        <ClientProvider initialSession={session}>
          {children}
        </ClientProvider>
      </body>
    </html>
  )
}
