'use client'

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out hover:bg-red-700 hover:shadow-lg hover:scale-105 active:scale-95"
    >
      🔒 Cerrar Sesión
    </button>
  );
}
