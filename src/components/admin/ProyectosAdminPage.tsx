import { useEffect, useState } from "react";
import {
  FaFolderPlus,
  FaClipboardList,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
}

const ProyectosAdminPage = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoProyecto, setNuevoProyecto] = useState({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    // Simulación de proyectos existentes
    setProyectos([
      {
        id: 1,
        nombre: "Rediseño Web Corporativa",
        descripcion: "Proyecto de modernización del sitio principal",
      },
      {
        id: 2,
        nombre: "Sistema Interno de Recursos Humanos",
        descripcion: "Aplicación interna para la gestión de empleados",
      },
    ]);
  }, []);

  const handleCrearProyecto = () => {
    if (!nuevoProyecto.nombre.trim()) return;

    const nuevo = {
      id: Date.now(),
      ...nuevoProyecto,
    };

    setProyectos((prev) => [...prev, nuevo]);
    setNuevoProyecto({ nombre: "", descripcion: "" });
    setShowModal(false);
  };

  const handleEliminar = (id: number) => {
    setProyectos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <FaClipboardList className="text-2xl text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Proyectos</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow transition text-sm font-medium"
        >
          <FaFolderPlus />
          Nuevo Proyecto
        </button>
      </div>

      {/* Lista */}
      {proyectos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((proyecto) => (
            <div
              key={proyecto.id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-100 relative group"
            >
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {proyecto.nombre}
              </h2>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {proyecto.descripcion}
              </p>
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleEliminar(proyecto.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500 text-sm border border-gray-100">
          Aún no hay proyectos registrados.
        </div>
      )}

      {/* Modal Nuevo Proyecto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
              title="Cerrar"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Nuevo Proyecto</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                  value={nuevoProyecto.nombre}
                  onChange={(e) =>
                    setNuevoProyecto((prev) => ({
                      ...prev,
                      nombre: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                  value={nuevoProyecto.descripcion}
                  onChange={(e) =>
                    setNuevoProyecto((prev) => ({
                      ...prev,
                      descripcion: e.target.value,
                    }))
                  }
                />
              </div>
              <button
                onClick={handleCrearProyecto}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium"
              >
                Crear Proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProyectosAdminPage;

