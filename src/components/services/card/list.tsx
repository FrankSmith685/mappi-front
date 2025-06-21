/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { Service } from '../../../interfaces/service';
import { getDistanceKm } from '../../../utils/locationService';
import { useAppState } from '../../../hooks/useAppState';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { imageBaseUrl } from '../../../api/apiConfig';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';

interface Props {
  servicios: Service[];
}

const ListService: React.FC<Props> = ({ servicios }) => {
  const {
    currentPositionService,
    setSelectedService,
    setServiceExpanded,
    selectedService,
  } = useAppState();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      servicios.length > 0
    ) {
      const searchParams = new URLSearchParams(window.location.search);
      const serviceEncoded = searchParams.get("s");
      if (serviceEncoded) {
        const decodedId = Number(atob(serviceEncoded));
        const marker = servicios.find((m) => Number(m.id) === decodedId);
        if (marker) handleClickSelectedService(marker);
      }
    }
  }, [servicios]);

  const handleClickSelectedService = (servicio: Service) => {
    if (servicio) {
      const encodedId = btoa(String(servicio.id ?? 0));
      const currentParams = new URLSearchParams(window.location.search);
      const m = currentParams.get("m") || "map";
      const d = currentParams.get("d");
      navigate(`?m=${m}&d=${d}&s=${encodedId}`);
      setSelectedService(servicio);
      setServiceExpanded(true);
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-12 py-6" >
      {servicios.map((servicio) => {
        const distance = getDistanceKm(
          Number(currentPositionService?.latitud),
          Number(currentPositionService?.longitud),
          Number(servicio.latitud),
          Number(servicio.longitud)
        );
        const fechaPublicacion = new Date(String(servicio.fechaPublicacion));

        return (
          <div
            key={servicio.id}
            onClick={() => handleClickSelectedService(servicio)}
            className={`relative hover:cursor-pointer group flex flex-col sm:flex-row items-center sm:items-start justify-between rounded-2xl p-5 gap-y-4 sm:gap-x-6 transition-all duration-300 hover:-translate-y-1 ${
              selectedService?.id === servicio.id
                ? 'border-custom-primary bg-orange-50 shadow-xl ring-2 ring-orange-300'
                : 'bg-white shadow-md hover:shadow-lg'
            }`}
          >
            {selectedService?.id === servicio.id && (
              <span className="absolute -top-3 -left-3 bg-custom-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg animate-bounce">
                Seleccionado
              </span>
            )}

            {/* Imagen */}
            <div className="flex-shrink-0">
              <LazyLoadImage
                src={`${imageBaseUrl}${servicio.idLogo !== 0 ? 'usua_' + servicio.idLogo : -1}`}
                alt="Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-white shadow object-cover mx-auto sm:mx-0"
              />
            </div>

            {/* Info principal */}
            <div className="flex flex-col text-center sm:text-left flex-grow">
              <span className="text-lg sm:text-xl font-semibold capitalize text-gray-800">
                {servicio.nombre}
              </span>
              <span className="text-sm sm:text-base text-gray-600">
                {servicio.empleadorNomCom}
              </span>

              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2 text-sm text-gray-500">
                <FaMapMarkerAlt />
                <span>{distance.toFixed(2)} km de tu posición</span>
                <FaClock className="ml-2" />
                <span>
                  hace{' '}
                  {formatDistanceToNow(fechaPublicacion, {
                    addSuffix: false,
                    locale: es,
                  })}
                </span>
              </div>
            </div>

            {/* Botón flecha */}
            <div className="sm:self-center">
              <button
                onClick={() => handleClickSelectedService(servicio)}
                className={`group relative p-3 sm:p-4 rounded-full overflow-hidden transition-all duration-300 hover:cursor-pointer
                  ${selectedService?.id === servicio.id
                    ? 'bg-gradient-custom-primary-v2 shadow-[0_0_25px_rgba(255,165,0,0.6)] scale-110 ring-2 ring-white'
                    : 'bg-custom-primary hover:bg-orange-600 shadow-md hover:shadow-lg'}
                  text-white hover:scale-110`}
              >
                {/* Ícono con animación */}
                <IoIosArrowForward
                  size={22}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />

                {/* Glow/shine layer */}
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full pointer-events-none" />
              </button>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListService;
