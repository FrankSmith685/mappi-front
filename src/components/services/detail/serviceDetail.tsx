/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Service } from "../../../interfaces/service";
import { imageBaseUrl } from "../../../api/apiConfig";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { MdLocationOn, MdAccessTime, MdLocalShipping, MdRoute } from "react-icons/md";
import { FaFacebookF, FaWhatsapp, FaShareAlt, FaFilePdf, FaArrowRight } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import { PromotionsCarousel } from "./promociones/promotionsCarousel";
import CustomButton from "../../ui/CustomButtom";
import { useSearchParams } from "react-router-dom";
import { useAppState } from "../../../hooks/useAppState";
import ModalOptionSession from "../modal/ModalOptionSession";
import ModalOpinion from "../modal/ModalOpinion";
import { useResena } from "../../../hooks/useResena";
import { ResenaById } from "../../../interfaces/resena";
import ReviewList from "./review/reviewList";
import { getDistanceKm } from "../../../utils/locationService";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";


interface ServiceDetailProps {
  selectedService: Service;
  setSelectedService: (service: Service) => void;
  navigate: (url: string) => void;
}

export const ServiceDetail = ({
  selectedService,
  setSelectedService,
}: ServiceDetailProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const {serviceExpanded,setServiceExpanded, setModal, user, modal, currentPositionService} = useAppState();
  const [activeModalOptionSession,setActiveModalOptionSession] = useState(false);
  const [activeModalOpinion,setActiveModalOpinion] = useState(false);
  const {resenaByServiceId} = useResena();

  const portadaId = selectedService.idPortada;
  const logoId = selectedService.idLogo;
  const imageUrlPortada = `${imageBaseUrl}${portadaId !== 0 ? 'usua_' + portadaId : 0}`;
  const imageUrlLogo = `${imageBaseUrl}${logoId !== 0 ? 'usua_' + logoId : -1}`;

  const [searchParams, setSearchParams] = useSearchParams();
  
  const m = searchParams.get("m");
  const d = searchParams.get("d");
  const s = searchParams.get("s");

  const url = `https://mappi.pe/servicios?m=${m}&d=${d}&s=${s}`;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`Mira este servicio: ${selectedService.nombreServicio} - ${selectedService.descripcion} \n ${url}`)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
  
  

  const handleClose = () => {
    setSelectedService({} as Service);
    searchParams.delete("s");
    setSearchParams(searchParams);
  };


  const handleClickExpandedDetail=()=>{
    setServiceExpanded(!serviceExpanded);
  }

  const [containerHeight, setContainerHeight] = useState("calc(100vh - 160px)");
  const [subcontainerHeight, setSubContainerHeight] = useState("calc(100vh - 160px)");
    useEffect(() => {
      const updateHeight = () => {
        const height = window.innerWidth <= 767 ? "100%" : window.innerWidth <= 1023 ? "100%" : "calc(100vh - 160px)";
        const heightsubcontainer = window.innerWidth <= 767 ? "93%" : window.innerWidth <= 1023 ? "92%" : "calc(100vh - 160px)";
        setContainerHeight(height);
        setSubContainerHeight(heightsubcontainer)
      };
      updateHeight();
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }, []);
    
   const handleClickComparteOpinion=()=>{
    if(!user){
      setActiveModalOptionSession(true);
      setActiveModalOpinion(false);
      setModal(true);
    }else{
      setActiveModalOpinion(true);
      setActiveModalOptionSession(false);
      setModal(true);
    }
  }
  const [dataResena, setDataResena] = useState<ResenaById[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await resenaByServiceId(Number(selectedService.id));
      if (data) {
        setDataResena(data as ResenaById[]);
      }
    };
    // if(modal){
      if (selectedService?.id || modal) {
        fetchData();
      }
    // }
    
  }, [selectedService, modal]);

  const distance = getDistanceKm(
    Number(currentPositionService?.latitud),
    Number(currentPositionService?.longitud),
    Number(selectedService.latitud),
    Number(selectedService.longitud)
  );
 const rawFecha = selectedService?.fechaPublicacion;
const fechaPublicacion = rawFecha ? new Date(rawFecha) : null;


  return (
    <div
      className="w-full  lg:max-w-[420px] mx-auto  shadow-2xl bg-white border border-gray-200 overflow-hidden z-50"
      style={{ height: containerHeight }}
    >
      <div className={`${!serviceExpanded ? '' : ''} flex justify-center items-center py-4 lg:hidden w-full border-b border-gray-500`}>
        <div className="w-[200px] bg-custom-primary h-2 hover:cursor-pointer" onClick={handleClickExpandedDetail}>
        </div>
      </div>
      <div className="overflow-y-auto " style={{ maxHeight: subcontainerHeight }}>
        {/* Portada */}
        <div className={`${!serviceExpanded ? 'h-auto lg:h-56 relative' : 'h-56 relative'}  `}>
          <LazyLoadImage
            src={imageUrlPortada}
            alt="Portada"
            className={` ${!serviceExpanded ? 'hidden lg:flex' : 'flex'} w-full h-full object-cover transition-all duration-700 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className={` ${!serviceExpanded ? 'hidden lg:flex' : 'flex'} absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10`} />

          {/* Íconos de acción */}
          <div className={`${!serviceExpanded ? 'top-4 right-4 lg:top-3 lg:right-3': ' top-3 right-3 '} absolute z-30 flex flex-col items-end gap-2`}>
            {selectedService.telefono && (
              <a
                href={`https://wa.me/${selectedService.telefono}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/80 hover:bg-white text-green-600 p-2 rounded-full shadow transition cursor-pointer"
              >
                <FaWhatsapp className={`${!serviceExpanded ? 'text-xl lg:text-base' : 'text-base'}`}/>
              </a>
            )}
            <div className="relative">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow transition cursor-pointer"
              >
                <FaShareAlt className={`${!serviceExpanded ? 'text-xl lg:text-base' : 'text-base'}`}/>
              </button>

              {showShareOptions && (
                <div className="absolute right-0 mt-2 flex flex-col gap-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 animate-fade-in z-40">
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
                  >
                    <FaWhatsapp />
                    WhatsApp
                  </a>
                  <a
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <FaFacebookF />
                    Facebook
                  </a>
                </div>
              )}
            </div>
          </div>


          {/* Logo */}
          <div className={`${!serviceExpanded ? 'pt-6 flex items-center justify-center lg:pt-0 lg:-bottom-10 lg:absolute  lg:left-1/2 lg:transform lg:-translate-x-1/2 ' : '-bottom-10 absolute  left-1/2 transform -translate-x-1/2'}   z-20`}>
            <LazyLoadImage
              src={imageUrlLogo}
              alt="Logo"
              className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-xl object-cover"
            />
          </div>
        </div>

        {/* Contenido */}
        <div className={`${!serviceExpanded ? 'pt-4 lg:pt-16': 'pt-16'} px-6 pb-4`}>
          <h1 className="text-center text-2xl font-bold text-gray-800 mb-1">
            {selectedService.nombreServicio}
          </h1>
          {selectedService.empleadorNomCom && (
            <p className="text-center text-base text-custom-primary font-medium mb-1">
              {selectedService.empleadorNomCom}
            </p>
          )}
          <p className="text-center text-sm text-gray-500 italic mb-4">
            {selectedService.nombre}
          </p>

          <p className={`${selectedService.descripcion ? '' : 'hidden'} text-sm text-gray-700 mb-5 bg-gray-50 p-4 rounded-xl leading-relaxed shadow-inner`}>
            {selectedService.descripcion}
          </p>
          {/* Etiquetas */}
          <div className="grid gap-3 mb-4">
            {selectedService.direccion && (
              <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-4 py-2 rounded-xl shadow-sm text-sm">
                <MdLocationOn className="text-red-600 text-xl" />
                <span>{selectedService.direccion}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-4 py-2 rounded-xl shadow-sm text-sm">
              <MdRoute className="text-indigo-600 text-xl" />
              <span>{distance.toFixed(2)} km de tu posición</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-4 py-2 rounded-xl shadow-sm text-sm">
              <BsClockHistory className="text-yellow-500 text-sm" />
              <span>
                hace{' '}
                {fechaPublicacion  && formatDistanceToNow(fechaPublicacion, {
                  addSuffix: false,
                  locale: es,
                })}
              </span>
            </div>

            <div className={`${!serviceExpanded ? 'hidden lg:flex' : ''} ${selectedService.idCategoria == 83 ? 'hidden': ''}  flex items-center gap-2 text-gray-600 bg-gray-100 px-4 py-2 rounded-xl shadow-sm text-sm`}>
              <MdAccessTime className="text-blue-600" />
              <span>{selectedService.horario || "Horario ilimitado"}</span>
            </div>

            <div className={`${!serviceExpanded ? 'hidden lg:flex' : ''} ${selectedService.idCategoria == 83 ? 'hidden': ''} flex items-center gap-2 text-gray-600 bg-gray-100 px-4 py-2 rounded-xl shadow-sm text-sm`}>
              <MdLocalShipping className="text-green-600" />
              <span>{selectedService.tieneDelivery ? "Delivery disponible" : "Sin delivery"}</span>
            </div>

            {selectedService.telefono && (
              <div className={`${!serviceExpanded ? 'hidden lg:flex' : ''} ${selectedService.idCategoria == 83 ? 'hidden': ''} flex items-center gap-2 text-gray-600 bg-gray-100 px-4 py-2 rounded-xl shadow-sm text-sm`}>
                <FaWhatsapp className="text-green-600" />
                <span>{selectedService.telefono}</span>
              </div>
            )}
          </div>
        </div>
        {/* Sección de Promociones */}
        <div className={`${!serviceExpanded ? 'hidden lg:flex' : 'flex'} flex-col `}>
            {selectedService.idPromociones && selectedService.idPromociones !== "0" && (() => {
              const promoIds = selectedService.idPromociones
                .split(",")
                .map((id) => id.trim())
                .filter((id) => id !== "");
              return promoIds.length > 0 ? <PromotionsCarousel promoIds={promoIds} /> : null;
            })()}

         {selectedService.idVideoPromocion && selectedService.idVideoPromocion != 0 ? (
            <div
              className={`${
                !serviceExpanded ? 'hidden lg:flex' : 'flex'
              } flex-col rounded-2xl overflow-hidden px-6 pb-6 bg-white transition-all duration-500 ease-in-out hover:shadow-3xl`}
            >
              <div
                className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-800 h-48"
              >
                <video
                  controls
                  className="w-full h-full object-contain"
                  src={`${imageBaseUrl}serv_${selectedService.idVideoPromocion}`}
                >
                  Tu navegador no soporta el video.
                </video>
                <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-tr-xl">
                  Video Promocional
                </div>
              </div>
            </div>
          ) : null}
            {/* Sección de Documento PDF */}
            {selectedService?.idPdfCarta !== 0 && (
              <div className="px-6 pb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Carta de recomendación</h2>

                <div className="group bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">

                  {/* Ícono PDF */}
                  <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-red-100 text-red-600 text-4xl">
                    <FaFilePdf />
                  </div>

                  <p className="text-sm text-gray-700 mb-3 px-3">
                    Puedes visualizar o descargar la carta del servicio en formato PDF.
                  </p>

                  <a
                    href={`${imageBaseUrl}serv_${selectedService.idPdfCarta}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium transition"
                  >
                    <span>Ver carta en PDF</span>
                    <FaArrowRight />
                  </a>
                </div>
              </div>
            )}
        </div>
        <div className="w-full px-6">
          <hr className="w-full border-gray-500 mb-6"/>
        </div>
        
        {/* Botón y formulario para agregar comentario */}
        <div className="px-6 pb-6">
          <CustomButton
              variantType="primary"
              type="button"
              size="small"
              className="!text-sm sm:!text-base !capitalize"
              onClick={handleClickComparteOpinion}
          >
              Agrega un comentario
          </CustomButton>
        </div>
        <div className={`${dataResena.length > 0 ?'' : 'hidden'} w-full`}>
            <ReviewList reviews={dataResena} />
        </div>
        <div className="w-full px-6">
          <hr className="w-full border-gray-500 mb-6"/>
        </div>

        <div className="px-6 pb-6 flex w-full items-center justify-center gap-6">
          <CustomButton
            variantType="primary"
            type="button"
            size="small"
            className="!text-sm sm:!text-base !capitalize !w-auto lg:!hidden"
            onClick={handleClickExpandedDetail}

          >
            {!serviceExpanded ? 'Ver más' : 'Ver menos'}
          </CustomButton>
          <CustomButton
            variantType="primary"
            type="button"
            size="small"
            className="!text-sm sm:!text-base !capitalize !w-auto"
            onClick={handleClose}

          >
            Cerrar
          </CustomButton>

        </div>
      </div>
      {
        activeModalOptionSession && (
          <>
            <ModalOptionSession/>
          </>
        )
      }
      {
        activeModalOpinion && (
          <>
            <ModalOpinion/>
          </>
        )
      }
    </div>
  );
};