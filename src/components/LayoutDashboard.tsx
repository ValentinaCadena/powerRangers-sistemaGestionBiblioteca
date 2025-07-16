'use client'

import Sidebar from './Sidebar'

const LayoutDashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-8 w-full bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default LayoutDashboard
