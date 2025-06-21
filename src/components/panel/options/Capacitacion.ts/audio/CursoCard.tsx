import { FaLock } from "react-icons/fa";
import { CursoAudio } from "../../../../../interfaces/Curso";
import CustomImage from "../../../../ui/CustomImage";

interface CursoCardProps {
  curso: CursoAudio;
  isLocked: boolean;
}

const CursoCardAudio = ({ curso, isLocked }: CursoCardProps) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden group transform transition duration-500 hover:scale-105 hover:shadow-2xl ${
        isLocked ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div className="relative w-full aspect-[4/2.5] overflow-hidden">
        <CustomImage
          name={`${curso.id == 1 ? 'audio_01' : curso.id == 2 ? 'audio_02' : 'audio_03'}`}
          alt="Ejemplo de imagen optimizada"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110`}
        />

        {isLocked && (
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition duration-500 z-10"></div>
        )}
      </div>
      <div className="relative bg-custom-primary backdrop-blur-md px-4 py-4 text-white z-20 h-full">
        <h3 className="text-base leading-5 min-h-[40px] lg:text-lg font-extrabold tracking-wide drop-shadow-md">
          {curso.curso}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <CustomImage
            name={`${curso.id == 1 ? 'avatar_03' : curso.id == 2 ? 'avatar_02' : 'avatar_01'}`}
            alt={`${curso.id == 1 ? 'avatar_03' : curso.id == 2 ? 'avatar_02' : 'avatar_01'}`}
            className={`w-8 h-8 rounded-full border-2 border-white object-cover`}
          />
          <span className="text-sm font-medium drop-shadow-sm leading-4">{curso.instructor}</span>
        </div>
      </div>
      {isLocked && (
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-pulse z-30">
          Curso bloqueado
        </div>
      )}
      {isLocked && (
        <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg transform group-hover:-translate-y-1 transition duration-300 z-30">
          <FaLock className="text-red-600" />
        </div>
      )}
    </div>
  );
};

export default CursoCardAudio;
