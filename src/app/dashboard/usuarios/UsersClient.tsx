// app/usuarios/UsersClient.tsx
'use client'

import { useState } from "react";
import { UserProfile } from "@/lib/types";
import { updateUserRoleAction } from "../usuarios/actions";

export default function UsersClient({ initialUsers }: { initialUsers: UserProfile[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState<'ADMIN' | 'USER'>('USER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = (user: UserProfile) => {
    setSelectedUser(user);
    setNewRole(user.role); // Pre-seleccionar el rol actual del usuario
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsLoading(true);
    setError(null);

    const result = await updateUserRoleAction(selectedUser.id, newRole);

    if (result.error) {
      setError(result.error);
    } else {
      handleCloseModal(); // Éxito, cerrar el modal
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Tabla de Usuarios */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-5 py-3 border-b-2 text-left">Email</th>
              <th className="px-5 py-3 border-b-2 text-left">Fecha Creación</th>
              <th className="px-5 py-3 border-b-2 text-left">Rol</th>
              <th className="px-5 py-3 border-b-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {initialUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="px-5 py-4 font-semibold">{user.email}</td>
                <td className="px-5 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => handleOpenModal(user)} className="text-blue-600 hover:underline">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edición */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Editar Rol de Usuario</h2>
            <p className="text-gray-600 mb-6">Usuario: <span className="font-semibold">{selectedUser.email}</span></p>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="role" className="block text-gray-700 font-bold mb-2">Rol</label>
                <select
                  id="role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'ADMIN' | 'USER')}
                  className="shadow border rounded w-full py-2 px-3"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex items-center justify-end gap-4">
                <button type="button" onClick={handleCloseModal} disabled={isLoading} className="text-gray-600">Cancelar</button>
                <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
                  {isLoading ? 'Actualizando...' : 'Actualizar Rol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}