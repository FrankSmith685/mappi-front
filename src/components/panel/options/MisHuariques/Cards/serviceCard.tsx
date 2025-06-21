import { FaPencilAlt, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { imageBaseUrl } from "../../../../../api/apiConfig";
import { useAppState } from "../../../../../hooks/useAppState";
import CustomButton from "../../../../ui/CustomButtom";

interface ServiceProps {
  id: number;
  nombre: string;
  descripcion: string;
  idPromociones:string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onFeature?: (id: number) => void;
}

const ServiceCard: React.FC<ServiceProps> = ({
  id,
  nombre,
  descripcion,
  idPromociones,
  onEdit,
  onDelete,
  onFeature,
}) => {
  const { subCategory,user,archiveByService,modifiedService, company } = useAppState();
  const [imagenTipo, setImagenTipo] = useState<"base64" | "promo" | "default">("default");

  const isBase64Image = (str: string): boolean => {
    return /^data:image\/[a-zA-Z]+;base64,/.test(str);
  };
  
  const iconCategory = (): string | undefined => {
    if (modifiedService == null) {
      if (archiveByService?.id === id) {
        const rawImage = archiveByService?.service?.find(
          (s) => s?.base64 && isBase64Image(s.base64)
        )?.base64;
      
        if (rawImage) {
          return rawImage;
        }
      }

    }
      
  
    if (idPromociones && idPromociones.trim() !== "") {
      const firstPromoId = idPromociones.split(",")[0].trim();
      return `${imageBaseUrl}serv_${firstPromoId}`;
    }
  
    const subCategoryService = subCategory.find((subc) => subc?.nombre === nombre);
    if (subCategoryService?.idPadre === 12) {
      if (subCategoryService?.id === 80) return `${imageBaseUrl}mapp_292`;
      return `${imageBaseUrl}mapp_293`;
    } else if (subCategoryService?.idPadre === 11) {
      if (subCategoryService?.id === 64) return `${imageBaseUrl}mapp_294`;
      return `${imageBaseUrl}mapp_295`;
    } else if (subCategoryService?.idPadre === 10) {
      if (subCategoryService?.id === 79) return `${imageBaseUrl}mapp_296`;
      else if (subCategoryService?.id === 55) return `${imageBaseUrl}mapp_297`;
      else if (subCategoryService?.id === 56) return `${imageBaseUrl}mapp_298`;
      return `${imageBaseUrl}mapp_299`;
    } else if (subCategoryService?.idPadre === 13) {
      if (subCategoryService?.id === 82) return `${imageBaseUrl}mapp_300`;
      return `${imageBaseUrl}mapp_301`;
    }
  };
  

  useEffect(() => {
    if (modifiedService == null) {
      const hasBase64 = 
        archiveByService?.service?.some(
          (s) => s?.base64 && isBase64Image(s.base64)
        );
  
      if (hasBase64) {
        setImagenTipo("base64");
      } else if (idPromociones && idPromociones.trim() !== "") {
        setImagenTipo("promo");
      } else {
        setImagenTipo("default");
      }
    }
  }, [archiveByService?.id, archiveByService?.service, idPromociones, modifiedService, id]);
  

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 m-2 max-w-[500px] md:max-w-full w-full flex flex-col md:flex-row items-center justify-between gap-4 group relative overflow-hidden">
        <div className="flex items-center gap-4 md:w-3/4 md:flex-row flex-col">
          <div className={`${imagenTipo!="default" ? 'p-0' : 'p-2'} min-w-[100px] h-[100px] sm:w-[100px] sm:h-[100px]  rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center`}>
            <LazyLoadImage
              src={iconCategory()}
              alt={nombre}
              className={`${imagenTipo!="default" ? 'object-cover' : 'object-contain'} w-full h-full scale-100 group-hover:scale-105 transition-transform duration-300`}
            />
          </div>
          <div className="flex flex-col gap-1 items-center justify-center md:justify-start md:items-start">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{nombre}</h2>
            <p className="text-sm text-gray-600 line-clamp-2">{descripcion}</p>
            <span className={`text-sm font-semibold mt-1 text-green-600`}>
              {company ? "Servicio Empresa Publicado" : "Servicio Independiente Publicado"}
            </span>
          </div>
        </div>

        <div className="flex gap-3 items-center justify-end w-auto flex-row md:flex-col lg:flex-row">
          {
            user?.planes && user?.planes?.length == 0 && (
              <>
                <CustomButton
                  variantType="terciary"
                  type="submit"
                  size="small"
                  isLoading={false}
                  className="!normal-case !w-[100px]"
                  onClick={() => onFeature?.(id)}
                  >
                  Destacar
              </CustomButton>
              </>
            )
          }
          <div className="flex gap-3 items-center justify-center">
              <button
              className="text-custom-primary  hover:cursor-pointer rounded-full border border-orange-500 p-2 hover:text-orange-600 transition"
              onClick={() => onEdit?.(id)}
              >
              <FaPencilAlt className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px]"/>
              </button>
              <button
              className="text-custom-primary  hover:cursor-pointer rounded-full border border-orange-500 p-2 hover:text-orange-600 transition"
              onClick={() => onDelete?.(id)}
              >
              <FaTrash  className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px]"/>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
