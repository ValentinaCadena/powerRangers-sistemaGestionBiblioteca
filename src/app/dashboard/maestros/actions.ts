// app/maestros/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createMasterAction(nombre: string, saldoInicial: number) {
  const supabase = await createClient();

  // 1. Obtener la sesión del usuario para saber quién está creando el maestro
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autorizado: Debes iniciar sesión." };
  }

  // Opcional: Podrías volver a verificar si el rol es ADMIN para seguridad adicional en el backend
  const { data: userData } = await supabase
    .from("User")
    .select("role")
    .eq("id", user.id)
    .single();
  if (userData?.role !== "ADMIN") {
    return { error: "Acción no permitida." };
  }

  // 2. Insertar los datos en la tabla 'Maestro'
  const { error } = await supabase.from("Maestro").insert({
    nombre: nombre,
    saldo: saldoInicial,
    creadoPorId: user.id, // Asignamos el ID del usuario logueado
  });

  if (error) {
    console.error("Error en Server Action:", error);
    return { error: "No se pudo crear el maestro. Inténtalo de nuevo." };
  }

  // 3. Invalidar el caché de la ruta '/maestros'
  // Esto le dice a Next.js que la próxima vez que alguien visite esta página,
  // debe volver a obtener los datos (re-renderizar el Server Component).
  // ¡Así es como la tabla se actualiza automáticamente!
  revalidatePath("/maestros");

  return { success: true };
}
