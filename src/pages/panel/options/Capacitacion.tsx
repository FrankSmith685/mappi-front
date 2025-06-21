
import { useState } from "react";
import { cursoVideo } from "../../../components/panel/options/Capacitacion.ts/video/data";
import { useAppState } from "../../../hooks/useAppState";
import DetalleCursoHeader from "../../../components/panel/options/Capacitacion.ts/video/CursoDetalle";
import { CursoAudio, CursoVideo } from "../../../interfaces/Curso";
import { cursoAudio } from "../../../components/panel/options/Capacitacion.ts/audio/data";
import CursoCardVideo from "../../../components/panel/options/Capacitacion.ts/video/CursoCard";
import CursoCardAudio from "../../../components/panel/options/Capacitacion.ts/audio/CursoCard";
import CursoModuloVideo from "../../../components/panel/options/Capacitacion.ts/video/CursoModulo";
import CursoModuloAudio from "../../../components/panel/options/Capacitacion.ts/audio/CursoModulo";

const Capacitacion=()=>{
    const {user,scrollRef, company} = useAppState();
    const [cursoSeleccionadoVideo, setCursoSeleccionadoVideo] = useState<CursoVideo | null>(null);
    const [cursoSeleccionadoAudio, setCursoSeleccionadoAudio] = useState<CursoAudio | null>(null);

    const handleCursoClickVideo = (curso: CursoVideo, isLocked: boolean) => {
      if (!isLocked) {
        setCursoSeleccionadoVideo(curso);
        setTimeout(() => {
          scrollRef?.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    };

    const handleCursoClickAudio = (curso: CursoAudio, isLocked: boolean) => {
      if (!isLocked) {
        setCursoSeleccionadoAudio(curso);
        setTimeout(() => {
          scrollRef?.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    };
      return (
        <>
          <div className="flex flex-col gap-4 items-center justify-center" >
              <div className="py-6 px-4 flex flex-col gap-6 w-full max-w-[85%] sm:max-w-[70%]">
                  {user?.id == 0 ? (
                      <>
                          <div className="h-10 w-64 bg-gray-300 rounded animate-pulse mx-auto"></div>
                          <div className="h-4 w-80 bg-gray-300 rounded animate-pulse mx-auto"></div>
                      </>
                  ) : (
                      <>
                          <h1 className="text-transparent bg-clip-text text-3xl sm:text-4xl font-bold text-center w-full bg-gradient-custom-primary">
                              Capacitación {company ? "con video" : "con audio"}
                          </h1>
                          <p className="text-base md:text-lg text-gray-700 text-center">
                              {company
                                  ? "Accede a capacitaciones en video diseñadas para mejorar cada aspecto de tu restaurante."
                                  : "Disfruta nuestras capacitaciones en formato audio para que aprendas en cualquier momento y lugar."}
                          </p>
                      </>
                  )}
              </div>
              <div className="w-full flex flex-col gap-8">
                {/* AGREGAR AQUI MODULO Y VIDEO DE CADA CURSO */}
                {cursoSeleccionadoVideo && cursoSeleccionadoVideo?.Capitulos?.length > 0 && (
                    <CursoModuloVideo capitulos={cursoSeleccionadoVideo.Capitulos} />
                )}
                {cursoSeleccionadoVideo && (
                  <>
                      <DetalleCursoHeader
                        id={cursoSeleccionadoVideo.id}
                        titulo={cursoSeleccionadoVideo.curso}
                        instructor={cursoSeleccionadoVideo.instructor}
                        descripcion={cursoSeleccionadoVideo.descripcion}
                      />
                  </>
                )}
                {/* AGREGAR AQUI MODULO Y AUDIO DE CADA CURSO */}
                {cursoSeleccionadoAudio && cursoSeleccionadoAudio?.Capitulos?.length > 0 && (
                    <CursoModuloAudio capitulos={cursoSeleccionadoAudio.Capitulos} cursoSeleccionadoAudio={cursoSeleccionadoAudio} />
                )}
                {/* CURSO VIDEO */}
                {user?.id !== 0 && company && (
                  <div className="flex flex-wrap justify-center gap-6 px-6 pb-8 w-full max-w-[90%] mx-auto">
                    {cursoVideo.map((curso, index) => {
                      const isUnlocked = index == 0 ? true : false;
                      return (
                        <div
                          key={curso.id}
                          className="w-full sm:w-[70%] md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)]"
                          onClick={() => handleCursoClickVideo(curso, !isUnlocked)}
                        >
                          <CursoCardVideo curso={curso} isLocked={!isUnlocked} />
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* CURSO AUDIO */}
                {user?.id !== 0 && !company && (
                  <div className={`${cursoSeleccionadoAudio ? 'md:mb-[100px]' : ''} flex flex-wrap justify-center gap-6 px-6 pb-8 w-full max-w-[90%] mx-auto`}>
                    {cursoAudio.map((curso, index) => {
                      const isUnlocked = index == 0 ? true : false;
                      return (
                        <div
                          key={curso.id}
                          className="w-full sm:w-[70%] md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)]"
                          onClick={() => handleCursoClickAudio(curso, !isUnlocked)}
                        >
                          <CursoCardAudio curso={curso} isLocked={!isUnlocked} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
          </div>
        </>
    );
    
}

export default Capacitacion;