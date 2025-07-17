// app/maestros/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AddMasterClient from "../maestros/AddMasterClient";

const shortId = (id: string) => id.substring(0, 8);

export default async function MaestrosPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("User")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: maestros, error } = await supabase
    .from("Maestro")
    .select(`
      id,
      nombre,
      saldo,
      creadoPor:User ( email )
    `);

  if (error) {
    console.error("Error fetching maestros:", error);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Maestros</h1>
        {userData?.role === 'ADMIN' && <AddMasterClient />}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left">ID</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left">Nombre</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left">Saldo Actual</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left">Creado Por</th>
            </tr>
          </thead>
          <tbody>
            {maestros?.map((maestro: any) => ( // Usamos 'any' por simplicidad aquí
              <tr key={maestro.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="px-5 py-4 text-sm">
                  <span className="font-mono bg-gray-200 px-2 py-1 rounded">{shortId(maestro.id)}</span>
                </td>
                <td className="px-5 py-4 text-sm font-semibold">{maestro.nombre}</td>
                <td className="px-5 py-4 text-sm">{maestro.saldo}</td>
                {/* LÍNEA CORREGIDA AQUÍ */}
                <td className="px-5 py-4 text-sm">{maestro.creadoPor?.[0]?.email || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}