// app/transacciones/page.tsx
export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TransactionsClient from "../transacciones/TransactionsClient";

export default async function TransaccionesPage() {
  const supabase = await createClient();

  // 1. Proteger la ruta
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Obtener maestros para el dropdown
  const { data: maestros, error } = await supabase
    .from("Maestro")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error fetching maestros:", error);
    return (
      <div className="p-6 text-red-600 bg-red-100 rounded-lg shadow-md">
        Error al cargar los datos.
      </div>
    );
  }

  // 3. Renderizar componente cliente
  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Gestión de Transacciones
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 transition-shadow duration-300 hover:shadow-2xl">
        <TransactionsClient maestros={maestros || []} />
      </div>
    </div>
  );
}
