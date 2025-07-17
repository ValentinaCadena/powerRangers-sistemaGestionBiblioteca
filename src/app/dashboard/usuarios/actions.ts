// app/usuarios/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRoleAction(userIdToUpdate: string, newRole: 'ADMIN' | 'USER') {
  const supabase = createClient();

  // 1. Doble verificación de seguridad: Asegurarse de que el usuario que realiza la acción es un ADMIN.
  const { data: { user: adminUser } } = await supabase.auth.getUser();
  if (!adminUser) {
    return { error: "No autorizado." };
  }

  const { data: adminProfile } = await supabase
    .from("User")
    .select("role")
    .eq("id", adminUser.id)
    .single();

  if (!adminProfile || adminProfile.role !== 'ADMIN') {
    return { error: "Acción no permitida. Se requiere rol de administrador." };
  }
  
  // Opcional: Impedir que un admin se quite el rol a sí mismo si es el único.
  // (Esta lógica puede ser más compleja, pero es algo a considerar en una app real)

  // 2. Actualizar el rol del usuario seleccionado en la base de datos.
  const { error } = await supabase
    .from("User")
    .update({ role: newRole })
    .eq("id", userIdToUpdate);

  if (error) {
    console.error("Error updating user role:", error);
    return { error: "No se pudo actualizar el rol del usuario." };
  }

  // 3. Revalidar la ruta para que la tabla se actualice automáticamente.
  revalidatePath("/usuarios");

  return { success: true };
}