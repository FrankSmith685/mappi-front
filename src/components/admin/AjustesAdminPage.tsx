import { useState } from "react";
import { FaUserCog, FaBell, FaLock, FaSave, FaCheckCircle } from "react-icons/fa";

const AjustesAdminPage = () => {
  const [nombre, setNombre] = useState("Administrador");
  const [correo, setCorreo] = useState("admin@correo.com");
  const [notificaciones, setNotificaciones] = useState(true);
  const [mensajeGuardado, setMensajeGuardado] = useState("");

  const handleGuardar = () => {
    setMensajeGuardado("Cambios guardados correctamente ✔️");
    setTimeout(() => setMensajeGuardado(""), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Título */}
      <div className="flex items-center gap-3 mb-4">
        <FaUserCog className="text-2xl text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-800">Ajustes del Administrador</h1>
      </div>

      {/* Configuración de perfil */}
      <div className="bg-white shadow-md rounded-2xl p-6 space-y-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FaLock className="text-gray-400" />
          Perfil
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 font-medium">Nombre</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium">Correo electrónico</label>
            <input
              type="email"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      <div className="bg-white shadow-md rounded-2xl p-6 space-y-4 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FaBell className="text-gray-400" />
          Notificaciones
        </h2>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Recibir notificaciones por correo</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notificaciones}
              onChange={() => setNotificaciones(!notificaciones)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-400 rounded-full peer dark:bg-gray-300 peer-checked:bg-orange-500 transition-all"></div>
          </label>
        </div>
      </div>

      {/* Guardar cambios */}
      <div className="text-right">
        <button
          onClick={handleGuardar}
          className="bg-orange-500 hover:bg-orange-600 transition text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <FaSave /> Guardar Cambios
        </button>
        {mensajeGuardado && (
          <p className="mt-2 text-green-600 text-sm flex items-center gap-1">
            <FaCheckCircle /> {mensajeGuardado}
          </p>
        )}
      </div>
    </div>
  );
};

export default AjustesAdminPage;
