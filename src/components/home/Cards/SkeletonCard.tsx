export const SkeletonCard = () => {
    return (
      <div className="flex flex-col bg-white w-full max-w-[300px] lg:max-w-full md:w-[300px] lg:w-[260px] 2xl:w-[300px] h-[200px] shadow-lg rounded-lg overflow-hidden">
        
        {/* 🔹 Imagen Cargando */}
        <div className="h-full w-full bg-gray-300 animate-pulse"></div>
  
        {/* 🔹 Contenedor Inferior */}
        <div className="h-[43%] w-full bg-white p-3">
          <div className="w-3/4 h-4 bg-gray-300 animate-pulse rounded"></div>
          <div className="flex items-center text-sm text-gray-600 mt-2 space-x-2">
            <div className="w-3 h-3 bg-gray-300 animate-pulse rounded-full"></div>
            <div className="w-1/2 h-3 bg-gray-300 animate-pulse rounded"></div>
          </div>
        </div>
        
      </div>
    );
  };
  