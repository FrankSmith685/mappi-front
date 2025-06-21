/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useServices } from "../../../hooks/useServices";
import { Service } from "../../../interfaces/service";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaTruck
} from "react-icons/fa";
import { imageBaseUrl } from "../../../api/apiConfig";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useAppState } from "../../../hooks/useAppState";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../ui/CustomButtom";

export const CarouselServiciosCheveres = () => {
  const [services, setServices] = useState<Service[]>([]);
  const { setServiceActive } = useAppState();
  const navigate = useNavigate();
  const { getPremiumServices } = useServices();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    getPremiumServices((data) => {
      setServices(data ?? []);
    });
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % services.length);
  const prev = () => setIndex((prev) => (prev - 1 + services.length) % services.length);

  useEffect(() => {
    const interval = setInterval(next, 7000);
    return () => clearInterval(interval);
  }, [services]);

  const handleClickService = (service: Service) => {
    const encodedIdService = btoa(String(service.id ?? 0));
    const encodedIdDepartment = btoa(String(service.idUbigeo ?? 0));
    setServiceActive(true);
    navigate(`/servicios?m=map&d=${encodedIdDepartment}&s=${encodedIdService}`);
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden mt-[48px] rounded-lg shadow-lg">
      {services.map((service, i) => (
        <div
          key={service.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <LazyLoadImage
            src={
              service.fotoPrincipal
                ? `${imageBaseUrl}serv_${service.fotoPrincipal}`
                : `${imageBaseUrl}0`
            }
            alt={`${service.nombreServicio} - Mappi`}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center px-6 md:px-20 text-white">
            <div className="max-w-xl space-y-4 animate-fadeIn">
              <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-md">
                {service.nombreServicio || "Servicio Premium"}
              </h2>

              {service.nombre && (
                <span className="inline-block bg-custom-secondary  text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                  {service.nombre}
                </span>
              )}


              <div className="flex items-center gap-3 text-lg font-light">
                <FaMapMarkerAlt className="text-red-400" />
                <span>{service.ciudad}</span>
              </div>

              {service.tieneDelivery && (
                <div className="flex items-center gap-3 text-lg font-light">
                  <FaTruck className="text-green-400" />
                  <span>¡Delivery Disponible!</span>
                </div>
              )}

              {service.telefono && (
                <div className="flex items-center gap-3 text-lg font-light">
                  <FaPhoneAlt className="text-blue-400" />
                  <span>{service.telefono}</span>
                </div>
              )}

              <CustomButton variantType="primary" type="submit" size="medium" className=" !w-auto !px-4 !text-sm lg:!text-base !leading-5 flex !items-center !justify-center !capitalize !rounded-lg" onClick={() => handleClickService(service)}>
                Ver más detalles
              </CustomButton>
            </div>
          </div>
        </div>
      ))}

      {/* Flechas */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 z-20"
      >
        <FaArrowLeft />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 z-20"
      >
        <FaArrowRight />
      </button>
    </div>
  );
};
