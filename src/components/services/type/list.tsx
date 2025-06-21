import { useEffect, useState } from "react";
import { useAppState } from "../../../hooks/useAppState";
import { useNavigate } from "react-router-dom";
import { ServiceDetail } from "../detail/serviceDetail";
import ListService from "../card/list";
import { Service } from "../../../interfaces/service";
const List = () => {
  const { currentLocationService, setSelectedService,selectedService, serviceExpanded } = useAppState();
  const [containerHeight, setContainerHeight] = useState("calc(100vh - 160px)");
  const [containerHeightList, setContainerHeightList] = useState("calc(100vh - 160px)");

  const navigate = useNavigate();
 const [serviciosParaMostrar, setServiciosParaMostrar] = useState<Service[]>([]);


 useEffect(() => {
    if (currentLocationService.servicesNear.length > 0) {
      setServiciosParaMostrar(currentLocationService.servicesNear);
    } else {
      setServiciosParaMostrar(currentLocationService.services);
    }
  }, [currentLocationService.servicesNear, currentLocationService.services]);

  useEffect(() => {
    const updateHeight = () => {
      const height =  window.innerWidth <= 639 ? serviceExpanded ? "calc(100vh - 80px)" : Object.keys(selectedService).length > 0 ? "calc(100vh - 40px - 40px)" :"calc(100vh - 120px)" : window.innerWidth <= 767 ? serviceExpanded ? "calc(100vh - 80px)" : Object.keys(selectedService).length > 0 ? "calc(100vh - 40px - 40px)" :"calc(100vh - 120px)" :  window.innerWidth <= 1023 ? serviceExpanded ? "calc(100vh - 160px)" : Object.keys(selectedService).length > 0 ? "calc(100vh - 120px - 40px)" :"calc(100vh - 160px)" : "calc(100vh - 160px)";
      const heightList =  window.innerWidth <= 639 ? serviceExpanded ? "calc(100vh - 230px)" : Object.keys(selectedService).length > 0 ? "calc(100vh - 190px - 80px)" :"calc(100vh - 80px)" : window.innerWidth <= 767 ? serviceExpanded ? "calc(100vh - 200px)" : Object.keys(selectedService).length > 0 ? "calc(100vh - 160px - 80px)" :"calc(100vh - 80px)" : window.innerWidth <= 1023 ? serviceExpanded ? "calc(100vh - 280px)" : Object.keys(selectedService).length > 0 ? "calc(100vh - 280px - 40px)" :"calc(100vh - 280px)" : "calc(100vh - 280px)";
      setContainerHeight(height);
      setContainerHeightList(heightList);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [serviceExpanded, selectedService]);

  const defaultContainerStyle = {
    width: "100%",
    height: containerHeight,
  };

  return (
    <>
      <div className="w-full h-full relative flex flex-col lg:flex-row overflow-y-hidden" style={defaultContainerStyle}>
        {/* Mapa */}
        <div
          className={`transition-all duration-300  ${
            Object.keys(selectedService).length > 0 ? "w-full" : "w-full"
          }`}
          style={{ height: serviceExpanded ? 0 : containerHeight}}
        >
            <div className="w-full h-[104px] sm:h-[72px]">
            </div>
            <div className="w-full px-[16px] sm:px-[24px] lg:px-[48px]">
                <div className="h-[48px]  flex items-center justify-center sm:justify-start border-b border-b-gray-300 bg-clip-text text-xl sm:text-2xl font-medium text-center w-full text-gray-800">
                    Mappi recomienda estos Huariques
                </div>
            </div>
            
          {currentLocationService.loading ? (
            <div className="w-full flex items-center justify-center bg-gray-200 animate-pulse" style={{ height: containerHeight }}>
              <div className="text-center">
                <div className="w-12 h-12 mb-4 mx-auto border-4 border-orange-700 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg font-semibold text-gray-600">Cargando Servicios...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto" style={{ height: containerHeightList}}>
              <ListService servicios={serviciosParaMostrar}/>
            </div>
          )}
        </div>

        {selectedService && Object.keys(selectedService).length > 0 && (
          <ServiceDetail
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            navigate={navigate}
          />
        )}

      </div>

    </>
  );
};

export default List;
