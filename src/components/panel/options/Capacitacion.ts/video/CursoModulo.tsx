/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaLock, FaPlayCircle } from "react-icons/fa";
import { useUser } from "../../../../../hooks/useUser";
import { useAppState } from "../../../../../hooks/useAppState";

interface Capitulo {
  id: number;
  titulo: string;
  descripcion: string;
  video: string;
}

interface CursoModuloProps {
  capitulos: Capitulo[];
}

const CursoModuloVideo = ({ capitulos }: CursoModuloProps) => {
  const {updateUser} = useUser();
  const {user} = useAppState();

  const [capituloActivo, setCapituloActivo] = useState<Capitulo | null>(null);
    const [capitulosVistos, setCapitulosVistos] = useState<number[]>([]);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [autoPlayNext, setAutoPlayNext] = useState(false);

    useEffect(() => {
        if (!user || capituloActivo) return;
        const completado = user?.capacitacionCompleto ?? 0;
        const vistosCount = completado > 0
          ? Math.max(1, Math.floor((completado / 100) * capitulos.length))
          : 0;
        const index = Math.min(vistosCount, capitulos.length - 1);
        const capActivo = capitulos[index] ?? capitulos[0];
        setCapituloActivo(capActivo);
        const vistosIds = capitulos.slice(0, vistosCount).map((c) => c.id);
        setCapitulosVistos(vistosIds);
    }, [user, capitulos]);

    const handleAudioEnded = () => {
      setCapitulosVistos((prev) => {
        const nuevosVistos = prev.includes(capituloActivo!.id) ? prev : [...prev, capituloActivo!.id];
        const porcentaje = Math.round((nuevosVistos.length / capitulos.length) * 100);
        let status = "no visto";
        if (porcentaje === 100) status = "visto";
        else if (porcentaje > 0) status = "medio";
        const dataUser = {
          capacitacionEsHabilitado: true,
          capacitacionTipo: "video",
          capacitacionCompleto: porcentaje,
          capacitacionStatus: status,
        };
        updateUser(dataUser);
    
        return nuevosVistos;
      });
    
      const currentIndex = capitulos.findIndex((cap) => cap.id === capituloActivo?.id);
      const nextCapitulo = capitulos[currentIndex + 1];
  
      const isMobile = window.innerWidth < 768;
      if (nextCapitulo) {
        setCapituloActivo(nextCapitulo);
        if(!isMobile){
          setAutoPlayNext(true);
        }
      } else if (!nextCapitulo) {
        console.log("Curso terminado");
      }
    };
  
    useEffect(() => {
      if (autoPlayNext && videoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Error al reproducir automáticamente:", error);
          });
        }
        setAutoPlayNext(false);
      }
    }, [capituloActivo]);


  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 px-4  py-10 bg-gray-50">
      <div className="w-full h-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {capituloActivo ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{capituloActivo.titulo}</h2>
            <video
              ref={videoRef}
              key={capituloActivo.video}
              controls
              className="w-full h-[220px] sm:h-[300px] md:h-[380px] rounded-lg bg-black"
              onEnded={handleAudioEnded}
            >
              <source src={capituloActivo.video} type="video/mp4" />
              Tu navegador no soporta el video.
            </video>
            <p className="mt-5 text-gray-600 text-base">{capituloActivo.descripcion}</p>
          </>
        ) : (
          <p className="text-gray-500 text-center py-8">Selecciona un capítulo para comenzar.</p>
        )}
      </div>
      <div className="w-full lg:w-auto lg:flex-1/2 flex items-center justify-center">
        <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-200 w-full">
            <h3 className="bg-custom-primary text-white px-6 py-3 text-lg font-bold tracking-wide">
            Capítulos del curso
            </h3>
            <ul className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-gray-100">
            {capitulos.map((cap,index) => {
                const isActive = capituloActivo?.id === cap.id;
                const isSeen = capitulosVistos.includes(cap.id);
                const canPlay = isSeen || index === 0 || capitulosVistos.includes(capitulos[index - 1]?.id);
                return (
                  <li
                  key={cap.id}
                  className={`group transition-all duration-200 px-6 py-4 flex items-start gap-4 rounded-md
                    ${canPlay ? "cursor-pointer hover:bg-gray-100" : "cursor-not-allowed bg-gray-100/50"}
                    ${isActive ? "bg-red-50 border-l-4 border-orange-500" : ""}
                  `}
                  onClick={() => {
                    if (canPlay) setCapituloActivo(cap);
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-custom-primary text-xs font-bold uppercase">Cap. {cap.id}</span>

                      {isSeen && (
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-[2px] rounded-full">
                          <FaCheckCircle className="text-green-500 text-xs" />
                          Visto
                        </span>
                      )}

                      {!canPlay && (
                        <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                          <FaLock className="text-gray-400 text-sm" />
                          Bloqueado
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{cap.titulo}</span>
                    <span className="text-xs text-gray-500 mt-1 line-clamp-2">{cap.descripcion}</span>
                  </div>

                    {isActive && (
                    <FaPlayCircle className="text-custom-primary text-xl ml-auto mt-1" />
                    )}
                </li>
                );
            })}
            </ul>
        </div>
        </div>

    </div>
  );
};

export default CursoModuloVideo;
