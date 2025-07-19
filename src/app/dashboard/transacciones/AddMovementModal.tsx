// app/transacciones/AddMovementModal.tsx
'use client'

import { useState } from 'react';
import { createMovementAction } from '../transacciones/actions';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    maestroId: string;
    maestroNombre: string;
}

export default function AddMovementModal({ isOpen, onClose, maestroId, maestroNombre }: ModalProps) {
    const [tipo, ] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
    const [cantidad, ] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const result = await createMovementAction({
            maestroId,
            tipo,
            cantidad
        });

        if (result.error) {
            setError(result.error);
        } else {
            // Éxito
            onClose(); // Cierra el modal desde el padre
        }
        setIsLoading(false);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-1">Agregar Movimiento</h2>
            <p className="text-gray-600 mb-4">Para: <span className="font-semibold">{maestroNombre}</span></p>
            <form onSubmit={handleSubmit}>
                {/* Inputs para tipo y cantidad */}
                {/* ... */}
                <div className="flex items-center justify-end gap-4">
                  <button type="button" onClick={onClose}>Cancelar</button>
                  <button type="submit" disabled={isLoading}>{isLoading ? 'Guardando...' : 'Crear Movimiento'}</button>
                </div>
            </form>
          </div>
        </div>
    );
}