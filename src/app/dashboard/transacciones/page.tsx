// app/transacciones/page.tsx
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

  // 2. Obtener todos los maestros para el dropdown
  // Solo necesitamos el id y el nombre
  const { data: maestros, error } = await supabase
    .from("Maestro")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error fetching maestros:", error);
    // Puedes manejar el error como prefieras
    return <div>Error al cargar los datos.</div>;
  }

  // 3. Renderizar el componente cliente, pasándole los maestros
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Transacciones</h1>
      </div>
      <TransactionsClient maestros={maestros || []} />
    </div>
  );
}
