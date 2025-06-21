import CustomImage from "../../../../ui/CustomImage";

interface DetalleCursoHeaderProps {
  id:number;
  titulo: string;
  instructor: string;
  descripcion: string;
}

const DetalleCursoHeader = ({
  id,
  titulo,
  instructor,
  descripcion
}: DetalleCursoHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl mx-6 md:mx-12 border border-gray-100">
      <div className="flex-shrink-0">
        <CustomImage
            name={`${id == 1 ? 'avatar_01' : id == 2 ? 'avatar_02' : 'avatar_03'}`}
            alt={`${id == 1 ? 'avatar_01' : id == 2 ? 'avatar_02' : 'avatar_03'}`}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-custom-primary shadow-md hover:scale-105 transition-transform duration-300`}
        />
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-custom-primary mb-1 transition-colors duration-300">
          {titulo}
        </h1>
        <p className="text-md text-gray-700 font-medium mb-3">{instructor}</p>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <p className="font-semibold text-sm text-gray-700 mb-1 uppercase tracking-wide">
            Descripción
          </p>
          <p className="text-gray-600 leading-relaxed text-[15px]">{descripcion}</p>
        </div>
      </div>
    </div>
  );
};

export default DetalleCursoHeader;


