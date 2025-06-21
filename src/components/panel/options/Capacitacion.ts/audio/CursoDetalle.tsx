import CustomImage from "../../../../ui/CustomImage";

interface DetalleCursoHeaderProps {
    id:number,
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
        <div className="w-full md:h-[500px] rounded-t-2xl overflow-hidden">
            <CustomImage
                name={`${id == 1 ? 'audio_01' : id == 2 ? 'audio_02' : 'audio_03'}`}
                alt={`${id == 1 ? 'audio_01' : id == 2 ? 'audio_02' : 'audio_03'}`}
                className={`w-full hidden md:block h-[200px] object-cover transition-transform duration-500 group-hover:scale-110`}
            />
            <div className="w-full flex justify-center items-center flex-col bg-white shadow-lg md:shadow-none md:p-0 p-6 gap-6 md:gap-0 mx-0 border border-gray-100 md:border-none">
                <div className="w-full flex items-center justify-center bg-custom-primary-archivo p-2 md:h-[100px] flex-col md:flex-row md:gap-0 mx-0 ">
                    <div className="w-[100px] flex items-center justify-center ">
                        <CustomImage
                            name={`${id == 1 ? 'avatar_03' : id == 2 ? 'avatar_02' : 'avatar_01'}`}
                            alt={`${id == 1 ? 'avatar_03' : id == 2 ? 'avatar_02' : 'avatar_01'}`}
                            className={`w-14 h-14 md:w-[60px] md:h-[60px] rounded-full object-cover border-2 border-custom-primary shadow-md hover:scale-105 transition-transform duration-300`}
                        />
                    </div>
                    <div className="w-full flex items-center md:items-start justify-center flex-col gap-1">
                        <h1 className="text-lg text-center md:text-start font-bold text-primary-archivo md:text-white leading-5">{titulo}</h1>
                        <p className="text-sm text-center md:text-start text-primary-archivo md:text-white font-medium">{instructor}</p>
                    </div>
                </div>
                <div className="w-full md:h-[200px] md:border md:border-t-0 md:rounded-bl-2xl md:rounded-b-2xl md:rounded-br-2xl md:border-orange-600 md:overflow-hidden">
                    <div className="w-full h-full overflow-auto  md:p-2 bg-gray-50 p-4 rounded-xl md:rounded-none border border-gray-200 md:border-none md:bg-none">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1 uppercase tracking-wide md:mb-0">Descripción:</h2>
                        <p className="md:text-gray-700 md:text-sm text-gray-600 leading-relaxed text-sm">{descripcion}</p>
                    </div>
                    
                </div>
            </div>
        </div>
        
    );
  };
  
export default DetalleCursoHeader;