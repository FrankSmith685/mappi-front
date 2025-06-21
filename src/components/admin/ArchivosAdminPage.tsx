/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, JSX } from "react";
import {
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaDownload,
  FaTrash,
  FaBuilding,
  FaUser,
  FaTools,
  FaPlus,
  FaEye,
  FaTimes,
  FaSyncAlt,
  FaFolderOpen,
} from "react-icons/fa";
// import { format } from "date-fns";
import { useArchives } from "../../hooks/useArchives";
import CustomModal from "../ui/CustomModal";
import CustomInput from "../ui/CustomInput";
import { dataResponse } from "../../interfaces/Archive";
import CustomButton from "../ui/CustomButtom";
import CustomImage from "../ui/CustomImage";

const iconosCategoria: Record<string, JSX.Element> = {
  Mappi: <CustomImage
                  name="logo_01"
                  alt="mappi"
                  className="!w-auto !h-[45px] cursor-pointer"
                />,
  Innovacorp: <CustomImage
                  name="logo_01_innovacorp"
                  alt="innovacorp"
                  className="!w-auto !h-[67px] cursor-pointer"
                />,
  Usuarios: <FaUser className="text-2xl text-blue-600" />,
  Empresas: <FaBuilding className="text-2xl text-green-600" />,
  Servicios: <FaTools className="text-2xl text-purple-600" />,
  Resena: <FaFileAlt className="text-2xl text-pink-600" />,
};

const getIconByMime = (mime: string) => {
  if (mime.includes("pdf")) return <FaFilePdf className="text-red-500 text-lg" />;
  if (mime.includes("image")) return <FaFileImage className="text-blue-500 text-lg" />;
  return <FaFileAlt className="text-gray-500 text-lg" />;
};

const formatBytes = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB"];
  let l = 0, n = bytes;
  while (n >= 1024 && ++l) n = n / 1024;
  return `${n.toFixed(1)} ${units[l]}`;
};

const tabs = ["Mappi","Innovacorp", "Usuarios", "Empresas", "Servicios", "Resena"];

const ArchivosAdminPage = () => {
  const [selectedTab, setSelectedTab] = useState("Mappi");
  const [archivosPorCategoria, setArchivosPorCategoria] = useState<Record<string, dataResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const { getAllArchive, postArchives, updateArchive, deleteArchive } = useArchives();
  const [showModalUpdate,setShowModalUpdate] = useState<boolean>(false);
const [modoModal, setModoModal] = useState<'crear' | 'actualizar'>('crear');


  const [archivoSeleccionado, setArchivoSeleccionado] = useState< dataResponse | null>(null);
    const [nuevoArchivo, setNuevoArchivo] = useState<File | null>(null);
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [previewNuevaImagen, setPreviewNuevaImagen] = useState<string | null>(null);
    const [extensionOriginal, setExtensionOriginal] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [archivoAEliminar, setArchivoAEliminar] = useState<dataResponse | null>(null);


  useEffect(() => {
    getAllArchive((success, data) => {
      if (success) {
        const lista = data.archivos as dataResponse[];

        // Agrupar archivos por archTabla
        const agrupados: Record<string, dataResponse[]> = {};
        lista.forEach((archivo) => {
          const key = archivo.archTabla;
          if (!agrupados[key]) agrupados[key] = [];
          agrupados[key].push(archivo);
        });

        setArchivosPorCategoria(agrupados);
      } else {
        console.error("Error al obtener archivos:", data);
      }
      setLoading(false);
    });
  }, []);

  const archivos = archivosPorCategoria[selectedTab == "Mappi" ? selectedTab.toLowerCase() : selectedTab] || [];

  const getCustomId = (tabla: string, id: number) => {
  const prefixMap: Record<string, string> = {
    Usuarios: "usua",
    Innovacorp: "inno",
    Servicios: "serv",
    Empresas: "empr",
    mappi: "mapp",
    Resena: "rese",
  };
  return `${prefixMap[tabla] || "id"}_${id}`;
};

const [selectedImage, setSelectedImage] = useState<string | null>(null);
const [selectedVideo, setSelectedVideo] = useState<string | null>(null);



const handleClickUpdate = (archivo: dataResponse) => {
  setModoModal('actualizar');
  setArchivoSeleccionado(archivo);

  const partes = (archivo.archNombre || "").split(".");
  const nombreSinExt = partes.slice(0, -1).join(".");
  const ext = partes.pop() || "";

  setNuevoNombre(nombreSinExt);
  setExtensionOriginal(ext);
  setNuevoArchivo(null);
  setShowModalUpdate(true);
};


const handleClickCrear = () => {
  setModoModal('crear');
  setArchivoSeleccionado(null);
  setNuevoNombre('');
  setNuevoArchivo(null);
  setShowModalUpdate(true);
};



const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const partes = file.name.split('.');
    const nombreSinExt = partes.slice(0, -1).join('.');
    const extension = partes.pop() || "";

    setNuevoArchivo(file);
    setNuevoNombre(nombreSinExt);
    setExtensionOriginal(extension);

    // Preview para imágenes, videos o PDFs
    const fileURL = URL.createObjectURL(file);
    setPreviewNuevaImagen(fileURL);
  }
};




const handleSubmitArchivo = () => {
  if (!nuevoNombre || !extensionOriginal) return;

  const formData = new FormData();
const nombreFinal = `${nuevoNombre}.${extensionOriginal}`;

// Solo si se subió un nuevo archivo
if (nuevoArchivo) {
  const updatedFile = new File([nuevoArchivo], nombreFinal, {
    type: nuevoArchivo.type,
  });
  formData.append("FormFile", updatedFile);
}

formData.append("Tabla", selectedTab === "Mappi" ? "mappi" : selectedTab);
formData.append("Tipo", "");
formData.append("NuevoNombre", nombreFinal);


  setLoading(true);

  // Crear el callback que usaremos en ambos casos
  const handleCallback = (message: string, success: boolean, res: dataResponse) => {
    if (!success) {
      console.error("Error:", message);
      setLoading(false);
      return;
    }

    let fileUrl = res.archContenido;

if (res.archTipo === "otro" && res.archContenido) {
  try {
    const byteCharacters = atob(res.archContenido);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteNumbers], { type: res.archContenidoTipo });
    fileUrl = URL.createObjectURL(blob);
  } catch (error) {
    console.warn("Error decoding Base64:", error);
  }
} else {
  // 👇 Aquí añadimos esto si es URL directa como S3
  fileUrl = `${fileUrl}?v=${new Date().getTime()}`;
}


    const nuevoArchivoFormateado: dataResponse = {
      archInterno: res.archInterno,
      archNombre: res.archNombre,
      archTipo: res.archTipo,
      archTabla: res.archTabla,
      archContenidoTipo: res.archContenidoTipo,
      archTamaño: res.archTamaño,
      archContenido: fileUrl,
    };

    const categoria = res.archTabla;

    setArchivosPorCategoria((prev) => {
  const prevArchivos = prev[categoria] || [];

  let actualizados: dataResponse[];

  if (modoModal === "crear") {
    // Agregamos nuevo al inicio
    actualizados = [nuevoArchivoFormateado, ...prevArchivos];
  } else {
    // Eliminamos el anterior (por ID) y agregamos el actualizado al inicio
    const filtrados = prevArchivos.filter(
      (a) => a.archInterno !== archivoSeleccionado?.archInterno
    );
    actualizados = [nuevoArchivoFormateado, ...filtrados];
  }

  return { ...prev, [categoria]: actualizados };
});


    setShowModalUpdate(false);
    setPreviewNuevaImagen(null);
    setLoading(false);
  };

  // Condicional según modoModal
  if (modoModal === "actualizar" && archivoSeleccionado) {
    updateArchive(
      archivoSeleccionado.archInterno,
      formData,
      nombreFinal,
      handleCallback
    );
  } else {
    postArchives(formData, handleCallback);
  }
};

const handleDelete = (archivo: dataResponse) => {
  setArchivoAEliminar(archivo);
  setShowDeleteModal(true);
};
const confirmarEliminacion = () => {
  if (!archivoAEliminar) return;

  deleteArchive(archivoAEliminar.archInterno, (mensaje, success, deletedId) => {
    if (success && deletedId !== undefined) {
      // Eliminamos del estado
      setArchivosPorCategoria((prev) => {
        const actualizados = (prev[archivoAEliminar.archTabla] || []).filter(
          (a) => a.archInterno !== deletedId
        );
        return {
          ...prev,
          [archivoAEliminar.archTabla]: actualizados,
        };
      });
    } else {
      console.error("Error al eliminar archivo:", mensaje);
    }

    // Cerrar modal y limpiar
    setShowDeleteModal(false);
    setArchivoAEliminar(null);
  });
};







  return (
    <>
        <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
             <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <FaFolderOpen className="text-2xl text-orange-500" />
                      <h1 className="text-2xl font-bold text-gray-800">Gestión de Archivos</h1>
                    </div>
                     <p className="text-sm text-gray-500 mb-4">Visualiza y organiza los archivos por tipo de entidad.</p>
                </div>
               
           
            <CustomButton
                variantType="primary"
                type="submit"
                size="medium"
                className="!w-auto gap-2"
                disabled={selectedTab != "Mappi" && selectedTab != "Innovacorp"}
                onClick={handleClickCrear}
            >
                 <FaPlus />
                Agregar Archivo
            </CustomButton>

        </div>

        {/* Submenú estilo tarjetas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8 w-full">
  {tabs.map((tab) => (
    <button
      key={tab}
      onClick={() => setSelectedTab(tab)}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl shadow-md transition-all border-2 w-full text-sm font-medium text-center
        ${
          selectedTab === tab
            ? "border-orange-500 bg-orange-50 scale-[1.03]"
            : "border-transparent bg-white hover:bg-gray-100"
        }`}
    >
      <div className="text-2xl h-[40px] overflow-hidden">
        {iconosCategoria[tab]}
      </div>
      <span
        className={`${
          selectedTab === tab ? "text-orange-600" : "text-gray-700"
        }`}
      >
        {tab}
      </span>
    </button>
  ))}
</div>


        {/* Tabla de archivos */}
        <div className="w-full">
  {loading ? (
    <div className="text-center py-6 text-gray-500 italic">Cargando archivos...</div>
  ) : (
    <>
      {/* Tabla para pantallas grandes */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-orange-100 text-gray-700">
            <tr>
              <th className="px-5 py-3 text-left">Archivo</th>
              <th className="px-5 py-3 text-left">Tipo</th>
              <th className="px-5 py-3 text-left">Tamaño</th>
              <th className="px-5 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {archivos.length > 0 ? (
              archivos.map((archivo) => (
                <tr key={archivo.archInterno} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 flex items-center gap-4">
                    {archivo.archContenidoTipo.includes("image") ? (
                      <div className="w-[60px] h-[60px] rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white flex items-center justify-center">
                        <img
                          src={archivo.archContenido}
                          alt={archivo.archNombre}
                          className="!w-full !h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-[40px] h-[40px] flex items-center justify-center bg-gray-100 rounded-md">
                        {getIconByMime(archivo.archContenidoTipo)}
                      </div>
                    )}

                    <div className="flex flex-col justify-center">
                      <span className="font-medium text-gray-800 line-clamp-1 max-w-[200px]">{archivo.archNombre}</span>
                      <span className="text-xs text-gray-500 italic">
                        ID: {getCustomId(archivo.archTabla, archivo.archInterno)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{archivo.archContenidoTipo}</td>
                  <td className="px-5 py-4 text-gray-600">{formatBytes(archivo.archTamaño)}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-4 text-gray-700 text-lg items-center">
                      {archivo.archContenidoTipo.includes("image") && (
                        <button onClick={() => setSelectedImage(archivo.archContenido || "")} title="Ver imagen" className="hover:text-blue-600 transition">
                          <FaEye />
                        </button>
                      )}
                        {
                            (selectedTab === "Mappi" || selectedTab === "Innovacorp") && (
                                <>
                                    {!archivo.archContenidoTipo.includes("image") && !archivo.archContenidoTipo.includes("pdf") && (
                                        <a href={archivo.archContenido} download title="Descargar" className="hover:text-green-600 transition">
                                        <FaDownload />
                                        </a>
                                    )}

                                    <button
                                        onClick={() => handleClickUpdate(archivo)}
                                        title={`Actualizar ${archivo.archNombre}`}
                                        className="hover:text-orange-500 transition"
                                    >
                                        <FaSyncAlt />
                                    </button>

                                    <button title="Eliminar" className="hover:text-red-600 transition" onClick={() => handleDelete(archivo)}>
                                        <FaTrash />
                                    </button>
                                </>
                            )
                        }
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500 italic">
                  No hay archivos disponibles en esta categoría.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards para móviles */}
      <div className="block md:hidden space-y-4">
            {archivos.length > 0 ? (
                archivos.map((archivo) => (
                <div
                    key={archivo.archInterno}
                    className="bg-white rounded-2xl shadow-lg p-4 space-y-3 border border-gray-100"
                >
                    {/* Header del archivo */}
                    <div className="flex  gap-4 items-center sm:items-start">
                    {/* Imagen o ícono */}
                    {archivo.archContenidoTipo.includes("image") ? (
                        <div className="w-[60px] h-[60px] rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                        <img
                            src={archivo.archContenido}
                            alt={archivo.archNombre}
                            className="w-full h-full object-contain"
                        />
                        </div>
                    ) : (
                        <div className="w-[50px] h-[50px] flex items-center justify-center bg-gray-100 rounded-md shadow-inner text-xl">
                        {getIconByMime(archivo.archContenidoTipo)}
                        </div>
                    )}

                    {/* Nombre e ID */}
                    <div className="flex flex-col flex-1 overflow-hidden h-full">
                        <span className="font-semibold text-gray-800 text-sm line-clamp-1 break-words w-full hidden sm:flex">
                            {archivo.archNombre}
                        </span>
                        <span className="text-xs text-gray-500 italic">
                        ID: {getCustomId(archivo.archTabla, archivo.archInterno)}
                        </span>
                    </div>
                    </div>

                    {/* Info tipo y tamaño */}
                    <div className="text-sm text-gray-600 px-1">
                    <span className="font-semibold text-gray-800 text-sm line-clamp-1 break-words max-w-[250px] sm:hidden">
                        {archivo.archNombre}
                    </span>
                    <p>
                        <span className="font-medium text-gray-700">Tipo:</span>{" "}
                        {archivo.archContenidoTipo}
                    </p>
                    <p>
                        <span className="font-medium text-gray-700">Tamaño:</span>{" "}
                        {formatBytes(archivo.archTamaño)}
                    </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex justify-start flex-wrap gap-4 text-gray-700 text-xl pt-2 border-t border-gray-100 mt-2">
                    {/* Ver imagen */}
                    {archivo.archContenidoTipo.includes("image") && (
                        <button
                        onClick={() => setSelectedImage(archivo?.archContenido || "")}
                        title="Ver imagen"
                        className="hover:text-blue-600 transition"
                        >
                        <FaEye />
                        </button>
                    )}
                    {archivo.archContenidoTipo.includes("video") && (
                        <button
                        onClick={() => setSelectedVideo(archivo?.archContenido || "")}
                        title="Ver video"
                        className="hover:text-blue-600 transition"
                        >
                        <FaEye />
                        </button>
                    )}
                        {
                           (selectedTab === "Mappi" || selectedTab === "Innovacorp") && (
                                <>
                                    {/* Descargar */}
                                        {!archivo.archContenidoTipo.includes("image") &&
                                            !archivo.archContenidoTipo.includes("pdf") && (
                                            <a
                                                href={archivo.archContenido}
                                                download
                                                title="Descargar"
                                                className="hover:text-green-600 transition"
                                            >
                                                <FaDownload />
                                            </a>
                                            )}

                                        {/* Actualizar */}
                                        
                                        <button
                                            onClick={() => handleClickUpdate(archivo)}
                                            title={`Actualizar ${archivo.archNombre}`}
                                            className="hover:text-orange-500 transition"
                                        >
                                            <FaSyncAlt />
                                        </button>

                                        {/* Eliminar */}
                                        <button
                                            title="Eliminar"
                                            className="hover:text-red-600 transition"
                                            onClick={() => handleDelete(archivo)}
                                        >
                                            <FaTrash />
                                        </button>
                                </>
                            )
                        }
                    
                    </div>
                </div>
                ))
            ) : (
                <div className="text-center py-6 text-gray-500 italic">
                No hay archivos disponibles en esta categoría.
                </div>
            )}
            </div>

                </>
            )}
            </div>


            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <button
                    onClick={() => setSelectedImage(null)}
                    className="fixed top-4 right-4 text-white hover:text-red-500 text-2xl z-50"
                    title="Cerrar vista"
                    >
                    <FaTimes />
                    </button>

                    <div className="bg-white rounded-lg shadow-xl p-4 max-w-3xl w-full relative">
                    <img
                        src={selectedImage}
                        alt="Vista previa"
                        className="w-full h-auto rounded-md object-contain"
                    />
                    </div>
                </div>
            )}

            {selectedVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <button
                    onClick={() => setSelectedVideo(null)}
                    className="fixed top-4 right-4 text-white hover:text-red-500 text-2xl z-50"
                    title="Cerrar vista"
                    >
                    <FaTimes />
                    </button>

                    <div className="bg-white rounded-lg shadow-xl p-4 max-w-3xl w-full relative">
                    <video
                        src={selectedVideo}
                        controls
                        autoPlay
                        className="w-full h-auto rounded-md object-contain"
                    />
                    </div>
                </div>
            )}

        </div>
        <CustomModal
            open={showModalUpdate}
            typeSection="null"
            title={modoModal === 'crear' ? 'Agregar Archivo' : 'Actualizar Archivo'}
            onClose={() => {
                setShowModalUpdate(false);
                setPreviewNuevaImagen(null);
            }}
            onContinue={handleSubmitArchivo}
            continueText={modoModal === 'crear' ? 'Subir Archivo' : 'Actualizar'}
        >
        <div className="flex flex-col gap-4">

            <CustomInput
            name="nuevoNombre"
            label="Nombre del archivo"
            placeholder="Ej: documento.pdf"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            required
            />

            {/* Vista previa archivo anterior solo en modo actualizar */}
              <div className="w-full flex flex-col items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                <span className="text-sm font-medium text-gray-700">
                    {previewNuevaImagen ? 'Vista previa del nuevo archivo' : 'Vista previa del archivo actual'}
                </span>

                <div className="relative w-full h-auto rounded-xl overflow-hidden border-2 border-gray-300 shadow-md flex items-center justify-center p-4 bg-white">
                    {/* NUEVO ARCHIVO */}
                    {previewNuevaImagen ? (
                    nuevoArchivo?.type.includes("image") ? (
                        <img
                        src={previewNuevaImagen}
                        alt="Vista previa nueva"
                        className="w-full h-auto max-h-[400px] object-contain"
                        />
                    ) : nuevoArchivo?.type === "application/pdf" ? (
                        <div className="flex flex-col items-center justify-center gap-2">
                        <FaFilePdf className="text-5xl text-red-500" />
                        <span className="text-sm text-gray-600 font-medium text-center">
                            {nuevoArchivo?.name}
                        </span>
                        </div>
                    ) : nuevoArchivo?.type.includes("video") ? (
                        <video
                        controls
                        src={previewNuevaImagen}
                        className="w-full h-auto max-h-[400px] rounded-md"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                        <FaFileAlt className="text-5xl text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium text-center">
                            {nuevoArchivo?.name}
                        </span>
                        </div>
                    )
                    ) : archivoSeleccionado?.archContenidoTipo.includes("image") ? (
                    <img
                        src={archivoSeleccionado.archContenido}
                        alt={archivoSeleccionado.archNombre}
                        className="w-full h-auto max-h-[400px] object-contain"
                    />
                    ) : archivoSeleccionado?.archContenidoTipo.includes("pdf") ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <FaFilePdf className="text-5xl text-red-500" />
                        <span className="text-sm text-gray-600 font-medium text-center">
                        {archivoSeleccionado?.archNombre}
                        </span>
                    </div>
                    ) : archivoSeleccionado?.archContenidoTipo.includes("video") ? (
                    <video
                        controls
                        src={archivoSeleccionado.archContenido}
                        className="w-full h-auto max-h-[400px] rounded-md"
                    />
                    ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <FaFileAlt className="text-5xl text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium text-center">
                        {archivoSeleccionado?.archNombre}
                        </span>
                    </div>
                    )}
                </div>

                <span className="text-xs text-gray-500 italic max-w-[200px] text-center truncate">
                    {previewNuevaImagen ? nuevoArchivo?.name : archivoSeleccionado?.archNombre}
                </span>
                </div>
                    <label
                        htmlFor="archivoNuevo"
                        className="mt-6 flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 cursor-pointer"
                    >
                    <input
                        id="archivoNuevo"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleArchivoChange}
                        className="hidden"
                    />

                    <div className="flex flex-col items-center gap-2 text-gray-500">
                        <FaSyncAlt className="text-3xl text-orange-400" />
                        <p className="text-sm font-medium text-center">
                        Arrastra y suelta tu archivo aquí<br />
                        <span className="text-gray-600">o haz clic para seleccionar</span>
                        </p>

                        {nuevoArchivo && (
                        <span className="text-sm text-green-600 font-semibold mt-1">
                            {nuevoArchivo.name}
                        </span>
                        )}
                    </div>
                </label>
            </div>
        </CustomModal>
        <CustomModal
            open={showDeleteModal}
            typeSection="null"
            title="¿Eliminar archivo?"
            onClose={() => {
                setShowDeleteModal(false);
                setArchivoAEliminar(null);
            }}
            onContinue={confirmarEliminacion}
            continueText="Eliminar"
            >
            <div className="text-center text-gray-700">
                <p>¿Estás seguro de que deseas eliminar el archivo:</p>
                <p className="font-semibold mt-2 text-red-500">
                {archivoAEliminar?.archNombre}
                </p>
            </div>
            </CustomModal>

    </>
  );
};

export default ArchivosAdminPage;
