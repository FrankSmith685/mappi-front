import { useEffect, useState } from "react";
import {
  FaChartBar,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const tipos = ["Usuarios", "Archivos", "Proyectos"];

interface Reporte {
  id: number;
  tipo: string;
  nombre: string;
  estado: "completado" | "pendiente";
  fecha: string;
}

const ReportesAdminPage = () => {
  const [selectedTipo, setSelectedTipo] = useState("Usuarios");
  const [reportes, setReportes] = useState<Reporte[]>([]);

  useEffect(() => {
    setReportes([
      {
        id: 1,
        tipo: "Usuarios",
        nombre: "Reporte mensual de usuarios",
        estado: "completado",
        fecha: "2024-08-10",
      },
      {
        id: 2,
        tipo: "Archivos",
        nombre: "Uso de almacenamiento",
        estado: "pendiente",
        fecha: "2024-08-09",
      },
      {
        id: 3,
        tipo: "Proyectos",
        nombre: "Resumen proyectos activos",
        estado: "completado",
        fecha: "2024-08-08",
      },
    ]);
  }, []);

  const reportesFiltrados = reportes.filter((r) => r.tipo === selectedTipo);

  return (
    <div className="w-full">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <FaChartBar className="text-2xl text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-800">Reportes del Sistema</h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tipos.map((tipo) => (
          <button
            key={tipo}
            onClick={() => setSelectedTipo(tipo)}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow transition
              ${
                selectedTipo === tipo
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      {/* Vista tipo CARD para móviles */}
      <div className="block sm:hidden space-y-4 mb-6">
        {reportesFiltrados.length > 0 ? (
          reportesFiltrados.map((reporte) => (
            <div
              key={reporte.id}
              className="bg-white rounded-xl p-4 shadow border border-gray-100 space-y-2"
            >
              <div className="flex items-center gap-2">
                <FaFileAlt className="text-orange-500 text-xl" />
                <h3 className="text-gray-800 font-semibold text-base">
                  {reporte.nombre}
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Fecha:</span>{" "}
                {reporte.fecha}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700">Estado:</span>{" "}
                {reporte.estado === "completado" ? (
                  <span className="text-green-600 flex items-center gap-1 font-medium">
                    <FaCheckCircle /> Completado
                  </span>
                ) : (
                  <span className="text-yellow-500 flex items-center gap-1 font-medium">
                    <FaTimesCircle /> Pendiente
                  </span>
                )}
              </p>
              <div>
                <button className="text-sm text-blue-600 hover:underline">Ver más</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">No hay reportes disponibles.</p>
        )}
      </div>

      {/* Vista tipo TABLA para pantallas grandes */}
      <div className="hidden sm:block overflow-x-auto rounded-xl shadow border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-orange-100 text-xs text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {reportesFiltrados.map((reporte) => (
              <tr key={reporte.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">{reporte.nombre}</td>
                <td className="px-4 py-3">
                  {reporte.estado === "completado" ? (
                    <span className="text-green-600 flex items-center gap-1 font-medium">
                      <FaCheckCircle /> Completado
                    </span>
                  ) : (
                    <span className="text-yellow-500 flex items-center gap-1 font-medium">
                      <FaTimesCircle /> Pendiente
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{reporte.fecha}</td>
                <td className="px-4 py-3">
                  <button className="text-blue-500 hover:underline text-sm">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportesAdminPage;
