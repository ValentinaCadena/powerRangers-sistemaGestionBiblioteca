// app/components/Sidebar.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function Sidebar() {
  console.log("--- RENDERIZANDO SIDEBAR ---");
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await (await supabase).auth.getUser();

  if (authError) {
    console.error("Error en supabase.auth.getUser():", authError.message);
    return <div>Error de autenticación. Revisa la consola del servidor.</div>;
  }

  if (!user) {
    console.log("No hay usuario, redirigiendo a /login");
    redirect("/login");
  }

  console.log("Usuario autenticado encontrado:", user.email);

  const { data: userData, error: profileError } = await (await supabase)
    .from("User")
    .select("email, role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error al obtener perfil:", profileError.message);
    return <div>Error al cargar perfil. Revisa la consola del servidor.</div>;
  }

  if (!userData) {
    console.error("Perfil no encontrado para el ID:", user.id);
    return <div>Perfil de usuario no encontrado.</div>;
  }

  console.log("Perfil de usuario cargado:", userData);

  return (
    <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col h-screen shadow-xl transition-all duration-500 ease-in-out">
      {/* Avatar y correo */}
      <div className="mb-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-500 mb-3 animate-pulse hover:scale-105 transition-transform duration-300 shadow-lg" />
        <p className="text-center font-semibold text-lg">{userData.email}</p>
        <span className="text-sm text-gray-400">{userData.role}</span>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-grow">
        <ul className="space-y-3">
          <li>
            <Link
              href="/dashboard/transacciones"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 ease-in-out hover:pl-6"
            >
              📊 Transacciones
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/maestros"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 ease-in-out hover:pl-6"
            >
              📁 Maestros
            </Link>
          </li>
          {userData.role === "ADMIN" && (
            <li>
              <Link
                href="/dashboard/usuarios"
                className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 ease-in-out hover:pl-6"
              >
                👥 Usuarios
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Botón de logout */}
      <div className="mt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}

