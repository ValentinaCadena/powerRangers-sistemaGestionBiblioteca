// app/usuarios/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UsersClient from "../usuarios/UsersClient";
import { UserProfile } from "@/lib/types";

export default async function UsuariosPage() {
  const supabase = await createClient();

  // 1. Obtener el usuario actual
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Verificar el ROL del usuario. ¡Este es el paso de seguridad clave!
  const { data: adminProfile } = await supabase
    .from("User")
    .select("role")
    .eq("id", user.id)
    .single();

  // Si el perfil no existe o el rol no es ADMIN, se redirige al dashboard principal.
  if (!adminProfile || adminProfile.role !== "ADMIN") {
    redirect("/transacciones"); // O a una página de "acceso denegado"
  }

  // 3. Si es ADMIN, obtener la lista de todos los usuarios del sistema.
  const { data: users, error } = await supabase
    .from("User")
    .select("id, createdAt, email, role")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return <div>Error al cargar la lista de usuarios.</div>;
  }

  // 4. Pasar los datos al componente cliente que manejará la interacción.
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
      </div>
      <UsersClient initialUsers={users as UserProfile[]} />
    </div>
  );
}
