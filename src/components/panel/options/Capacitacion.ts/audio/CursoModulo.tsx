/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaLock, FaPlayCircle } from "react-icons/fa";
import DetalleCursoHeader from "./CursoDetalle";
import { useUser } from "../../../../../hooks/useUser";
import { useAppState } from "../../../../../hooks/useAppState";
import CustomImage from "../../../../ui/CustomImage";
interface Capitulo {
  id: number;
  titulo: string;
  descripcion: string;
  audio: string;
  instructor?:string;
  avatarUrl?:string;
}
interface cursoSeleccionadoAudioProps {
  id:number;
  curso:string;
  instructor:string;
  instructorImg:string;
  cover:string;
  descripcion:string;
}

interface CursoModuloAudioProps {
  capitulos: Capitulo[];
  cursoSeleccionadoAudio: cursoSeleccionadoAudioProps;

}

const CursoModuloAudio = ({ capitulos, cursoSeleccionadoAudio }: CursoModuloAudioProps) => {
  const {updateUser} = useUser();
  const {user} = useAppState();

  const [capituloActivo, setCapituloActivo] = useState<Capitulo | null>(null);
  const [capitulosVistos, setCapitulosVistos] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [autoPlayNext, setAutoPlayNext] = useState(false);

  useEffect(() => {
    if (!user || capituloActivo) return; // ya hay uno activo, no lo cambies
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
        capacitacionTipo: "audio",
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
    if (autoPlayNext && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Error al reproducir automáticamente:", error);
        });
      }
      setAutoPlayNext(false);
    }
  }, [capituloActivo]);
  

  return (
    <div className="h-full lg:max-h-[550px] text-white flex flex-col md:flex-row w-full gap-4 p-4 bg-gray-50 lg:px-[40px]">
        <div className="w-full mx-auto rounded-2xl h-full overflow-hidden">
          <h1 className="text-xl font-bold text-white bg-custom-primary p-2 h-[50px]">Capítulos del curso</h1>

          <ul className="divide-y divide-orange-600 shadow-lg rounded-b-2xl border border-orange-500 overflow-auto h-[435px]">
          {capitulos.map((cap, index) => {
              const isActive = capituloActivo?.id === cap.id;
              const isSeen = capitulosVistos.includes(cap.id);
              const canPlay = isSeen || index === 0 || capitulosVistos.includes(capitulos[index - 1]?.id);
              return (
                <li
                key={cap.id}
                className={`group transition-all duration-200 px-6 py-4 flex flex-col gap-2 rounded-md
                  ${canPlay ? "cursor-pointer hover:bg-gray-100" : "cursor-not-allowed bg-gray-100/50"}
                  ${isActive ? "bg-red-50 border-l-4 border-orange-500" : ""}
                `}
                onClick={() => {
                  if (canPlay) setCapituloActivo(cap);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-custom-primary text-xs font-bold tracking-wide uppercase">
                        Cap. {cap.id}
                      </span>

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

                    <span className="text-sm font-semibold text-gray-800">{cap.titulo}</span>
                    <span className="text-xs text-gray-500 line-clamp-2">{cap.descripcion}</span>
                  </div>

                  {isActive && canPlay && (
                    <FaPlayCircle className="text-custom-primary text-xl ml-2 mt-1 hidden md:block" />
                  )}
                </div>

                {isActive && canPlay && (
                  <div className="md:hidden mt-2">
                    <audio
                      key={cap.audio}
                      controls
                      className="w-full h-[30px] bg-gray-100 rounded-lg"
                      onEnded={handleAudioEnded}
                    >
                      <source src={cap.audio} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
              </li>
              );
            })}
          </ul>
        </div>
        <div className="w-full lg:w-[600px] lg:max-w-[600px] flex items-center justify-center">
          <DetalleCursoHeader
            id = {cursoSeleccionadoAudio.id}
            titulo={cursoSeleccionadoAudio?.curso ?? ''}
            instructor={cursoSeleccionadoAudio?.instructor ?? ''}
            descripcion={cursoSeleccionadoAudio?.descripcion ?? ''}
          />
        </div>

      {capituloActivo && (
        <div className="hidden md:block fixed bottom-0 left-0 w-full z-30">
          <div className="bg-custom-secondary border-t border-gray-800 p-4 shadow-lg flex justify-between items-center w-full h-[100px] pl-[120px]">
            <div className="flex justify-start items-center gap-2  w-ful ">
              <div className="w-[200px] h-full py-2">
                <CustomImage
                    name={`${cursoSeleccionadoAudio.id == 1 ? 'audio_01' : cursoSeleccionadoAudio.id == 2 ? 'audio_02' : 'audio_03'}`}
                    alt={`${cursoSeleccionadoAudio.id == 1 ? 'audio_01' : cursoSeleccionadoAudio.id == 2 ? 'audio_02' : 'audio_03'}`}
                    className={`w-[200px] h-[92px] object-cover transition-transform duration-500 group-hover:scale-110`}
                />
              </div>
              <div className="flex justify-center items-start gap-1 w-full flex-col">
                <span className="text-xl text-white font-semibold">Curso:</span>
                <span className="text-base text-white font-semibold">{cursoSeleccionadoAudio.curso}</span>
              </div>
            </div>
            <div className="w-full max-w-[400px] lg:max-w-[500px] flex items-center justify-center flex-col gap-1">
              <div className="w-full text-center">
                <span className="text-lg text-white font-semibold">{capituloActivo.titulo}</span>
              </div>
              <div className="w-full">
                <audio
                  ref={audioRef}
                  key={capituloActivo.audio}
                  controls
                  className="w-full h-[40px] rounded-lg"
                  onEnded={handleAudioEnded}
                >
                  <source src={capituloActivo.audio} type="audio/mpeg" />
                </audio>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CursoModuloAudio;
