'use client'

import { useState } from "react";
import { createMasterAction } from "../maestros/actions";

export default function AddMasterClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
    setError(null); // Limpiar error previo
    setNombre('');
    setSaldoInicial(0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await createMasterAction(nombre, saldoInicial);

    if (result.error) {
      setError(result.error);
    } else {
      setIsModalOpen(false);
      setNombre('');
      setSaldoInicial(0);
    }

    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300 font-semibold"
      >
        ➕ Agregar Maestro
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform scale-95 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Agregar Nuevo Maestro
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="nombre" className="block text-gray-700 font-medium mb-2">
                  Nombre del Maestro
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="saldo" className="block text-gray-700 font-medium mb-2">
                  Saldo Inicial
                </label>
                <input
                  type="number"
                  id="saldo"
                  value={saldoInicial}
                  onChange={(e) => setSaldoInicial(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              )}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-300 disabled:bg-gray-400"
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
