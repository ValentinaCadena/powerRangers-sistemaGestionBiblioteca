import "../../styles/globals.css";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  return (
    <div className="flex">
      {/* Solo muestra el Sidebar si hay una sesión activa */}
      {session && <Sidebar />}
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
