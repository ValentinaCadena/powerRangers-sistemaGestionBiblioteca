// app/components/LogoutButton.tsx
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
    }

    return (
        <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
        >
            Cerrar Sesión
        </button>
    )
}