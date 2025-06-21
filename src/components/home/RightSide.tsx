/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useServices } from "../../hooks/useServices";
import { ServicePremium } from "../../interfaces/servicesPremium";
import { ServiceCard } from "./Cards/ServiceCard";
import { SkeletonCard } from "./Cards/SkeletonCard";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../hooks/useAppState";
import { CarouselServiciosCheveres } from "./Carrousel/CarouselPremiumServices";

export const RightSide = () => {
  const {setServiceActive} = useAppState();
  const { servicesPremium } = useServices();
  const [services, setServices] = useState<ServicePremium[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    servicesPremium((success, data) => {
      if (success) {
        setServices(data ?? []);
      }
      setLoading(false);
    });
  }, []);

  const handleClickService=(service: ServicePremium)=>{
    const encodedIdService = btoa(String(service.id ?? 0));
    const encodedIdDepartment = btoa(String(service.idUbigeo ?? 0));
    setServiceActive(true);
    navigate(`/servicios?m=map&d=${encodedIdDepartment}&s=${encodedIdService}`);
  }

  return (
    <div className="w-full bg-white h-full px-[0px] flex flex-col lg:mt-[80px]">
      <CarouselServiciosCheveres />
      <div className=" p-[24px] sm:p-[48px] flex flex-col gap-4">
        <h2 className="text-gray-500 font-medium text-xl sm:text-2xl">
          Huariques recomendados
        </h2>
        <hr className="w-full border-gray-500" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
            : services.map((service) => <ServiceCard key={service.id} service={service} onClick={()=>handleClickService(service)}/>)}
        </div>
      </div>
    </div>
  );
};
