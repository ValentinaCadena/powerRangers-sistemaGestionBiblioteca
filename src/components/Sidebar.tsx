'use client'

import Link from 'next/link'
import { useSession } from '@supabase/auth-helpers-react'

const Sidebar = () => {
  const session = useSession()
  const user = session?.user
  const role = session?.user?.user_metadata?.role || 'USER'

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4 fixed">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <img
            src={user?.user_metadata?.avatar_url || '/default-avatar.png'}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">{user?.user_metadata?.name || 'Usuario'}</p>
            <p className="text-sm text-gray-400">{role}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <Link href="/dashboard/transacciones" className="hover:text-yellow-300">Transacciones</Link>
        <Link href="/dashboard/maestros" className="hover:text-yellow-300">Maestros</Link>

        {role === 'ADMIN' && (
          <Link href="/dashboard/usuarios" className="hover:text-yellow-300">Usuarios</Link>
        )}
      </nav>
    </aside>
  )
}

export default Sidebar
