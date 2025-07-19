// app/transacciones/AddMovementModal.tsx
'use client';

import { useState } from 'react';
import { createMovementAction } from '../transacciones/actions';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMovementCreated?: () => void; // Para refrescar tabla al éxito
  maestroId: string;
  maestroNombre: string;
}

export default function AddMovementModal({
  isOpen,
  onClose,
  onMovementCreated,
  maestroId,
  maestroNombre,
}: ModalProps) {
  const [tipo, setTipo] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
  const [cantidad, setCantidad] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a cero.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const result = await createMovementAction({
      maestroId,
      tipo,
      cantidad,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccessMessage('Movimiento creado exitosamente.');
      if (onMovementCreated) onMovementCreated(); // Refrescar tabla
      setTimeout(() => {
        onClose();
      }, 1000);
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-1">Agregar Movimiento</h2>
        <p className="text-gray-600 mb-4">
          Para: <span className="font-semibold">{maestroNombre}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de movimiento */}
          <div>
            <label className="block font-medium mb-1">Tipo de movimiento:</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'ENTRADA' | 'SALIDA')}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="ENTRADA">Entrada</option>
              <option value="SALIDA">Salida</option>
            </select>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block font-medium mb-1">Cantidad:</label>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Mensajes */}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

          {/* Acciones */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              {isLoading ? 'Guardando...' : 'Crear Movimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
