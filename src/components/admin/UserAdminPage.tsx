import { useEffect, useState } from "react";
import {
  FaSearch,
  FaUserCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";

interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
}

const fakeUsers: User[] = [
  { id: 1, nombre: "Juan Pérez", correo: "juan@mail.com", rol: "Admin", activo: true },
  { id: 2, nombre: "María López", correo: "maria@mail.com", rol: "Usuario", activo: false },
  { id: 3, nombre: "Pedro Gómez", correo: "pedro@mail.com", rol: "Editor", activo: true },
  { id: 4, nombre: "Ana Torres", correo: "ana@mail.com", rol: "Usuario", activo: true },
];

const UserAdminPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(fakeUsers);
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
            <FaUser className="text-2xl text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-800 ">Gestión de Usuarios</h1>
        </div>
    </div>

      {/* Buscador */}
      <div className="flex items-center gap-2 bg-white border rounded-md shadow-sm px-3 py-2 mb-6 max-w-md">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          className="outline-none w-full text-sm"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla para escritorio */}
      <div className="hidden sm:block overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-orange-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Correo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Rol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FaUserCircle className="text-2xl text-gray-500" />
                    <span className="text-sm font-medium">{user.nombre}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.correo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.rol}</td>
                  <td className="px-4 py-3">
                    {user.activo ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                        <FaCheckCircle /> Activo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm font-semibold">
                        <FaTimesCircle /> Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-sm text-blue-500 hover:underline mr-2">Editar</button>
                    <button className="text-sm text-red-500 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500 text-sm">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tarjetas para móvil */}
      <div className="block sm:hidden space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className="bg-white shadow rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-3xl text-gray-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">{user.nombre}</span>
                  <span className="text-xs text-gray-500">{user.correo}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Rol:</strong> {user.rol}</p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {user.activo ? (
                    <span className="text-green-600 font-medium">Activo</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactivo</span>
                  )}
                </p>
              </div>
              <div className="flex gap-4 text-sm pt-2 border-t mt-2">
                <button className="text-blue-500 hover:underline">Editar</button>
                <button className="text-red-500 hover:underline">Eliminar</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm">
            No se encontraron usuarios.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAdminPage;
