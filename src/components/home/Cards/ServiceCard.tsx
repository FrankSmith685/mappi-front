import { LazyLoadImage } from "react-lazy-load-image-component";
import { imageBaseUrl } from "../../../api/apiConfig";
import { ServicePremium } from "../../../interfaces/servicesPremium";
import { LocationIcon } from "../../../assets/icons/locationIcons";

interface ServiceCardProps {
  service: ServicePremium;
  onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <div
      className="flex flex-col bg-white w-full max-w-[300px] lg:max-w-full md:w-[300px] lg:w-[260px] 2xl:w-[300px] h-[200px] shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
      onClick={onClick}
    >
      <div className="h-full w-full relative overflow-hidden">
        <LazyLoadImage 
            src={service.fotoPrincipal ? `${imageBaseUrl}serv_${service.fotoPrincipal}` : `${imageBaseUrl}0`}
            alt={`${service.nombreServicio} - Mappi`} 
            className="!w-full h-full object-cover" 
        />
        {service.tieneDelivery && (
          <span className="absolute top-0 right-0 bg-custom-primary text-white text-sm font-semibold px-3 py-1 rounded-bl-lg shadow">
            Delivery
          </span>
        )}
      </div>
      <div className="h-[43%] w-full bg-custom-white p-3">
        <h4 className="text-sm font-bold text-custom-primary">{service.nombre}</h4>
        <div className="flex items-center text-sm text-gray-600 mt-2 space-x-2">
          <LocationIcon className="w-3 h-3 text-gray-500" />
          <p className="!text-xs">{service.ciudad || "Ubicación desconocida"}</p>
        </div>
      </div>
    </div>
  );
};
