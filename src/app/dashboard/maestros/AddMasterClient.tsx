// app/maestros/AddMasterClient.tsx
'use client'

import { useState } from "react";
import { createMasterAction } from "../maestros/actions";

export default function AddMasterClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await createMasterAction(nombre, saldoInicial);

    if (result.error) {
      setError(result.error);
    } else {
      // Éxito: cerrar modal y resetear formulario
      setIsModalOpen(false);
      setNombre('');
      setSaldoInicial(0);
    }
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Agregar Maestro
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Maestro</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">Nombre del Maestro</label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="saldo" className="block text-gray-700 text-sm font-bold mb-2">Saldo Inicial</label>
                <input
                  type="number"
                  id="saldo"
                  value={saldoInicial}
                  onChange={(e) => setSaldoInicial(parseInt(e.target.value, 10))}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creando...' : 'Crear Maestro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}