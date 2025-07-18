// app/maestros/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AddMasterClient from "../maestros/AddMasterClient";

const shortId = (id: string) => id.substring(0, 8);

export default async function MaestrosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("User")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: maestros, error } = await supabase.from("Maestro").select(`
    id,
    nombre,
    saldo,
    creadoPor:User ( email )
  `);

  if (error) {
    console.error("Error fetching maestros:", error);
  }

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Gestión de Maestros
        </h1>
        {userData?.role === "ADMIN" && <AddMasterClient />}
      </div>

      {/* Tabla de Maestros */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
        <table className="min-w-full leading-normal">
          {/* Encabezados */}
          <thead className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 uppercase text-sm font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Nombre</th>
              <th className="px-6 py-4 text-left">Saldo Actual</th>
              <th className="px-6 py-4 text-left">Creado Por</th>
            </tr>
          </thead>

          {/* Cuerpo */}
          <tbody>
            {maestros?.map((maestro: any) => (
              <tr
                key={maestro.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                <td className="px-6 py-4 text-sm">
                  <span className="font-mono bg-gray-200 px-2 py-1 rounded-md text-gray-800 shadow-sm">
                    {shortId(maestro.id)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {maestro.nombre}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {maestro.saldo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {maestro.creadoPor?.[0]?.email || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
