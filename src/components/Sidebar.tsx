// app/components/Sidebar.tsx (CON LOGS DE DEPURACIÓN)
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function Sidebar() {
  console.log("--- RENDERIZANDO SIDEBAR ---");
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error("Error en supabase.auth.getUser():", authError.message);
    return <div>Error de autenticación. Revisa la consola del servidor.</div>;
  }
  
  if (!user) {
    console.log("No hay usuario, redirigiendo a /login");
    redirect("/login");
  }

  console.log("Usuario autenticado encontrado:", user.email);

  const { data: userData, error: profileError } = await supabase
    .from("User")
    .select("email, role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error al obtener el perfil de la tabla 'User':", profileError.message);
    // Este podría ser el error: el usuario existe en 'auth' pero no en 'public.User'
    return <div>Error al cargar perfil. Revisa la consola del servidor.</div>
  }
  
  if (!userData) {
    console.error("El perfil del usuario no fue encontrado en la tabla 'User' para el ID:", user.id);
    return <div>Perfil de usuario no encontrado.</div>
  }

  console.log("Perfil de usuario cargado:", userData);

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col h-screen">
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-gray-500 mb-2 mx-auto"></div>
        <p className="text-center font-bold">{userData.email}</p>
      </div>

      <nav className="flex-grow">
        <ul>
          <li className="mb-2"><Link href="/transacciones" className="block p-2 rounded hover:bg-gray-700">Transacciones</Link></li>
          <li className="mb-2"><Link href="/maestros" className="block p-2 rounded hover:bg-gray-700">Maestros</Link></li>
          {userData.role === 'ADMIN' && (
            <li className="mb-2"><Link href="/usuarios" className="block p-2 rounded hover:bg-gray-700">Usuarios</Link></li>
          )}
        </ul>
      </nav>

      <div><LogoutButton /></div>
    </aside>
  );
}