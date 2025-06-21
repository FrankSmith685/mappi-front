/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import CustomMap, { MarkerData } from "../../ui/CustomMap";
import { Service } from "../../../interfaces/service";
import { useAppState } from "../../../hooks/useAppState";
import { imageBaseUrl } from "../../../api/apiConfig";
import { useNavigate } from "react-router-dom";
import { ServiceDetail } from "../detail/serviceDetail";

const Map = () => {
  const { currentLocationService, subCategory,currentPositionService, setSelectedService,selectedService, serviceExpanded,setServiceExpanded } = useAppState();
  const [containerHeight, setContainerHeight] = useState("calc(100vh - 160px)");
  const current_location = `${imageBaseUrl}mapp_631`;

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
  lat: Number(currentPositionService.latitud),
  lng: Number(currentPositionService.longitud),
});
  const navigate = useNavigate();

  const iconCategory = (item : Service): string | undefined => {
    const subCategoryService = subCategory.find(
      (subc) => subc?.id == item?.idCategoria
    );
    if (subCategoryService?.idPadre === 12) {
      if (subCategoryService?.id === 80) {
        return `${imageBaseUrl}mapp_292`;
      }
      return `${imageBaseUrl}mapp_293`;
    }else if(subCategoryService?.idPadre === 11){
      if (subCategoryService?.id === 64) {
          return `${imageBaseUrl}mapp_294`;
        }
      return `${imageBaseUrl}mapp_295`;
    }else if(subCategoryService?.idPadre === 10){
      if (subCategoryService?.id === 79) {
          return `${imageBaseUrl}mapp_296`;
      }else if(subCategoryService?.id === 55){
          return `${imageBaseUrl}mapp_297`;
      }else if(subCategoryService?.id === 56){
          return `${imageBaseUrl}mapp_298`;
      }
      return `${imageBaseUrl}mapp_299`;
    }else if(subCategoryService?.idPadre === 13){
      if (subCategoryService?.id === 82) {
          return `${imageBaseUrl}mapp_300`;
      }
      return `${imageBaseUrl}mapp_301`;
    }else if (subCategoryService?.idPadre === 14) {
      if (subCategoryService?.id === 83) {
        return `${imageBaseUrl}mapp_642`;
      }
    }
  };

  const iconCategoryMarker = (item: Service): string | undefined => {
    const subCategoryService = subCategory.find(
      (subc) => subc?.id === item?.idCategoria
    );

    if (subCategoryService?.idPadre === 12) {
      if (subCategoryService?.id === 80) {
        return `${imageBaseUrl}mapp_636`;
      }
      return `${imageBaseUrl}mapp_632`;
    } else if (subCategoryService?.idPadre === 11) {
      if (subCategoryService?.id === 64) {
        return `${imageBaseUrl}mapp_639`;
      }
      return `${imageBaseUrl}mapp_633`;
    } else if (subCategoryService?.idPadre === 10) {
      if (subCategoryService?.id === 79) {
        return `${imageBaseUrl}mapp_635`;
      } else if (subCategoryService?.id === 55) {
        return `${imageBaseUrl}mapp_640`;
      } else if (subCategoryService?.id === 56) {
        return `${imageBaseUrl}mapp_637`;
      }
      return `${imageBaseUrl}mapp_634`;
    } else if (subCategoryService?.idPadre === 13) {
      if (subCategoryService?.id === 82) {
        return `${imageBaseUrl}mapp_638`;
      }
      return `${imageBaseUrl}mapp_641`;
    } else if (subCategoryService?.idPadre === 14) {
      if (subCategoryService?.id === 83) {
        return `${imageBaseUrl}mapp_643`;
      }
    }
  };

  const handleMarkerClick = (marker: MarkerData) => {
    const servicio = currentLocationService.services.find(
      (s) => String(s.id) === marker.id?.toString()
    );
    if (servicio) {
      const encodedId = btoa(String(servicio.id ?? 0));
      const currentParams = new URLSearchParams(window.location.search);
      const m = currentParams.get("m") || "map";
      const d = currentParams.get("d");
      navigate(`?m=${m}&d=${d}&s=${encodedId}`);
      setSelectedService(servicio);
      setServiceExpanded(true);
      if (servicio.latitud && servicio.longitud) {
        setMapCenter({ lat: servicio.latitud, lng: servicio.longitud });
      }
    }
  };


  const markers = useMemo(() => {
    const serviciosParaMostrar =
      currentLocationService.servicesNear.length > 0
        ? currentLocationService.servicesNear
        : currentLocationService.services;

    return serviciosParaMostrar.map((servicio) => {
      const isSelected = selectedService?.id === servicio.id;
      return {
        id: String(servicio.id),
        position: {
          lat: servicio.latitud ?? 0,
          lng: servicio.longitud ?? 0,
        },
        title: servicio.nombreServicio,
        icon: isSelected ? iconCategoryMarker(servicio) : iconCategory(servicio),
      };
    });
  }, [
    currentLocationService.services,
    currentLocationService.servicesNear,
    selectedService,
  ]);

      

  useEffect(() => {
    const updateHeight = () => {
      const height = window.innerWidth <= 1023 ? serviceExpanded ? "calc(100vh - 80px)" : Object.keys(selectedService).length > 0 ? "calc(100vh - 80px - 40px)" :"calc(100vh - 80px)" : window.innerWidth <= 1023 ? serviceExpanded ? "calc(100vh - 160px)" : Object.keys(selectedService).length > 0 ? "calc(100vh - 160px - 40px)" :"calc(100vh - 160px)" : "calc(100vh - 160px)";
      // 24px
      // const height
      setContainerHeight(height);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [serviceExpanded, selectedService]);

  const defaultContainerStyle = {
    width: "100%",
    height: containerHeight,
  };

 const hasHandledMarker = useRef(false);

useEffect(() => {
  if (
    !hasHandledMarker.current &&
    !currentLocationService.loading &&
    markers.length > 0 &&
    currentLocationService.services.length > 0
  ) {
    const searchParams = new URLSearchParams(window.location.search);
    const serviceEncoded = searchParams.get("s");

    if (serviceEncoded) {
      const decodedId = Number(atob(serviceEncoded));
      const marker = markers.find((m) => Number(m.id) === decodedId);
      if (marker) {
        handleMarkerClick(marker);
        hasHandledMarker.current = true;
      }
    }
  }
}, [markers, currentLocationService.loading]);


  return (
    <>
      <div className="w-full h-full relative flex flex-col lg:flex-row">
        {/* Mapa */}
        <div
          className={`transition-all duration-300 ${
            Object.keys(selectedService).length > 0 ? "w-full" : "w-full"
          }`}
          style={{ height: serviceExpanded ? 0 : containerHeight}} //AQUI CAMBIA A 0
        >
          {currentLocationService.loading ? (
            <div className="w-full flex items-center justify-center bg-gray-200 animate-pulse" style={{ height: containerHeight }}>
              <div className="text-center">
                <div className="w-12 h-12 mb-4 mx-auto border-4 border-orange-700 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg font-semibold text-gray-600">Cargando mapa...</p>
              </div>
            </div>
          ) : (
            <CustomMap
              lat={mapCenter.lat}
              lng={mapCenter.lng}
              additionalMarkers={markers}
              zoom={18}
              mapContainerStyle={defaultContainerStyle}
              icon={current_location}
              onClickMarker={handleMarkerClick}
            />
          )}
        </div>

        {/* Detalle del servicio */}
        
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

export default Map;
