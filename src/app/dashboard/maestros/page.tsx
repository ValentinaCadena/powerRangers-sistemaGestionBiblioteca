"use client";

import { useEffect, useState } from "react";
import AddMasterClient from "./AddMasterClient";
import { createClient } from "@/lib/supabase/client";

const shortId = (id: string) => id.substring(0, 8);

interface Maestro {
  id: string;
  nombre: string;
  saldo: number;
  creadoPor: {
    email: string;
  }[];
}

const supabase = createClient();

export default function MaestrosPage() {
  const [maestros, setMaestros] = useState<Maestro[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaestros = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: userData } = await supabase
        .from("User")
        .select("role")
        .eq("id", user.id)
        .single();

      setUserRole(userData?.role || null);

      const { data: maestrosData, error } = await supabase.from("Maestro").select(`
        id,
        nombre,
        saldo,
        creadoPor:User ( email )
      `);

      if (!error) {
        setMaestros(maestrosData || []);
      } else {
        console.error("Error fetching maestros:", error);
      }
    };

    fetchMaestros();
  }, []);

  const handleMasterCreated = async () => {
    const { data: updatedMaestros, error } = await supabase.from("Maestro").select(`
      id,
      nombre,
      saldo,
      creadoPor:User ( email )
    `);

    if (!error) {
      setMaestros(updatedMaestros || []);
    }
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Gestión de Maestros
        </h1>
        {userRole === "ADMIN" && (
          <AddMasterClient onMasterCreated={handleMasterCreated} />
        )}
      </div>

      {/* Tabla de Maestros */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
        <table className="min-w-full leading-normal">
          <thead className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 uppercase text-sm font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Nombre</th>
              <th className="px-6 py-4 text-left">Saldo Actual</th>
              <th className="px-6 py-4 text-left">Creado Por</th>
            </tr>
          </thead>
          <tbody>
            {maestros.map((maestro) => (
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
