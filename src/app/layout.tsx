// app/layout.tsx
import { createClient } from "@/lib/supabase/server";
import Sidebar from "../components/Sidebar";
import '../styles/globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="es">
      <body>
        <div className="flex">
          {session && <Sidebar />}
          <main className="flex-1 p-8 bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}