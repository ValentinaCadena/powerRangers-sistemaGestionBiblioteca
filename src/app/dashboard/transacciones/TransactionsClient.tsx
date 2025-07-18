// app/transacciones/TransactionsClient.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { type MovimientoConUsuario } from "@/lib/types";
import AddMovementModal from "../transacciones/AddMovementModal";
import BalanceChart from "../transacciones/BalanceChart";

// Definimos la interfaz para los maestros que recibimos como prop
interface MaestroSimple {
  id: string;
  nombre: string;
}

export default function TransactionsClient({
  maestros,
}: {
  maestros: MaestroSimple[];
}) {
  const [selectedMaestroId, setSelectedMaestroId] = useState<string | null>(
    maestros[0]?.id || null
  );
  const [movements, setMovements] = useState<MovimientoConUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchMovements = async () => {
      if (!selectedMaestroId) return;

      setIsLoading(true);
      const { data } = await supabase
        .from("Movimiento")
        .select(
          `
          id,
          fecha,
          cantidad,
          tipo,
          ejecutadoPor:User ( email )
        `
        )
        .eq("maestroId", selectedMaestroId)
        .order("fecha", { ascending: false });

      if (data) {
        setMovements(data as MovimientoConUsuario[]);
      }
      setIsLoading(false);
    };

    fetchMovements();
  }, [selectedMaestroId, supabase]); // Se ejecuta cada vez que cambia el maestro seleccionado

  const selectedMaestroNombre =
    maestros.find((m) => m.id === selectedMaestroId)?.nombre || "";

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        {/* Dropdown para seleccionar el Maestro */}
        <select
          value={selectedMaestroId || ""}
          onChange={(e) => setSelectedMaestroId(e.target.value)}
          className="p-2 border rounded-lg shadow-sm"
        >
          {maestros.map((maestro) => (
            <option key={maestro.id} value={maestro.id}>
              {maestro.nombre}
            </option>
          ))}
        </select>
        {/* Botón para agregar movimiento */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          disabled={!selectedMaestroId}
        >
          Agregar Movimiento
        </button>
      </div>

      {/* Gráfica de Saldos */}
      {movements.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-4">
            Evolución de Saldos Diarios
          </h3>
          <BalanceChart movements={movements} />
        </div>
      )}

      {/* Tabla de Movimientos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-4">Cargando movimientos...</div>
        ) : (
          <table className="min-w-full leading-normal">
            {/* ... (código de la tabla similar a la de maestros) ... */}
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left">
                  Fecha
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left">
                  Cantidad
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left">
                  Tipo
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left">
                  Ejecutado Por
                </th>
              </tr>
            </thead>
            <tbody>
              {movements.map((movement) => (
                <tr
                  key={movement.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="px-5 py-4 text-sm">
                    {new Date(movement.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-sm">{movement.cantidad}</td>
                  <td className="px-5 py-4 text-sm">{movement.tipo}</td>
                  <td className="px-5 py-4 text-sm">
                    {movement.ejecutadoPor
                      ?.map((user) => user.email)
                      .join(", ") || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para agregar movimiento */}
      {selectedMaestroId && (
        <AddMovementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          maestroId={selectedMaestroId}
          maestroNombre={selectedMaestroNombre}
        />
      )}
    </div>
  );
}
