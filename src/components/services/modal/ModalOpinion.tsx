/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import CustomModal from "../../ui/CustomModal";
import { useAppState } from "../../../hooks/useAppState";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "../../ui/CustomInput";
import CustomMap, { MarkerData } from "../../ui/CustomMap";
import { Service } from "../../../interfaces/service";
import { imageBaseUrl } from "../../../api/apiConfig";
import { FaPlus, FaStar, FaTimes } from "react-icons/fa";
import { useResena } from "../../../hooks/useResena";
import { getDistanceKm } from "../../../utils/locationService";
import { useGeocoder } from "../../../hooks/useGeocoder";
import { useServices } from "../../../hooks/useServices";
import { useSearchParams } from "react-router-dom";
import { useArchives } from "../../../hooks/useArchives";
import { Resena } from "../../../interfaces/resena";

const ModalOpinion: React.FC = () => {
    type OpinionFormValues = z.infer<typeof schema>;
    const { 
        modal, 
        setModal,
        currentPositionService,
        currentLocationService,
        subCategory,
        user,
        setCurrentLocationService,
        setSelectedService,
        selectedService,
        setArchiveByServiceResena,
        archiveByServiceResena,
        setDeleteIdsArchive,
        deleteIdsArchive,
        setNavigateService
    } = useAppState();
    const {saveResena,resenaByServiceId} = useResena();
    const {ObtenerServicios} = useServices();
    const {getArchiveByResena, deleteArchivo} = useArchives();

    const schema = z.object({
      user_name: z.string(),
      service_name: z.string().min(1, "El campo nombre del servicio es obligatorio"),
      opinion: z.string().min(1, "El campo opinión es obligatorio"),
    });

    const { register, handleSubmit, formState: { errors },watch, trigger, reset,setValue } = useForm<OpinionFormValues>({
      resolver: zodResolver(schema),
      mode: "onChange",
      defaultValues: {
        user_name: user?.nombres || "",
        service_name: "",
        opinion: ""
      }
    });
    const [rating, setRating] = useState(1);
    const [hover, setHover] = useState(0);
    const [successRegister,setSuccessRegister] = useState(false);
    const [idResena,setIdResena] = useState(0);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: Number(currentPositionService.latitud),
    lng: Number(currentPositionService.longitud),
    });
    const [mapCenterService, setMapCenterService] = useState<{ lat: number; lng: number }>({
    lat: Number(currentPositionService.latitud),
    lng: Number(currentPositionService.longitud),
    });
    const {getGeocoder} = useGeocoder();
    const [selectedServiceByOpinion,setSelectedServiceByOpinion] = useState({} as Service);

    const [searchParams] = useSearchParams();
    const s = searchParams.get("s");

    useEffect(() => {
      reset({
          user_name: user?.nombres || "",
          service_name: "",
          opinion: "",
      });
      setIdResena(0);
      setRating(1);
      // setSuccessRegister(false);
      setMapCenter({lat: Number(currentPositionService.latitud), lng: Number(currentPositionService.longitud)});
      setSelectedServiceByOpinion({});
    }, [reset,modal]);

    const current_location = `${imageBaseUrl}mapp_631`;
    const [multimediaIds,setMultimediaIds] = useState<string>("");

    const handleMarkerClick = async(marker: MarkerData, active: boolean = true) => {
      if(active){
        const servicio = currentLocationService.services.find(
          (s) => String(s.id) === marker.id?.toString()
        );
        if (servicio) {
          if (servicio.latitud && servicio.longitud) {
            setMapCenter({ lat: servicio.latitud, lng: servicio.longitud });
            setSelectedServiceByOpinion(servicio);
            const data = await resenaByServiceId(Number(servicio.id));
            if (data) {
              const userResena = data.find(resena => resena.idUsuario === user?.id);
              if (userResena) {
                setValue("opinion", userResena.resena || "");
                setRating(Number(userResena.calificacion));
                setIdResena(Number(userResena.id));
                setMultimediaIds(userResena.multimediaIds?.toString() || "");
                const ids = userResena.multimediaIds
                ?.split(',')
                .map(id => Number(id))
                .filter(id => !isNaN(id));

                const idsResena = userResena.multimediaIds?.split(',').map(id => Number(id)) || [];
                setResenaIds(idsResena);
                await getArchiveByResena(ids ?? [],userResena as Resena);
              }else{
                setValue("opinion", "");
                setRating(1);
                setIdResena(0);
                setMultimediaIds("");
                setArchiveByServiceResena({...archiveByServiceResena,resena:[],isLoading:false,id:0});
              }
            }
            setValue(
              "service_name",
              Number(servicio.idCategoria) === 83
                ? servicio.nombreServicio || ""
                : servicio.nombreServicio || ""
            );
          }
        }
      }
    };

    const [serviceAuxSelected,setServiceAuxSelected] = useState({} as Service);

    useEffect(()=>{
      if(selectedServiceByOpinion && Object.keys(selectedServiceByOpinion).length == 0){
        getGeocoder(Number(currentPositionService.latitud),Number(currentPositionService.longitud),undefined, (data) => {
          setServiceAuxSelected({
            idUbigeo:data?.district?.value,
            latitud: data.latitude,
            longitud: data.longitude,
            direccion: data.address
          })
        });
      }
    },[currentPositionService,selectedServiceByOpinion])

    const onSubmit = async (data: OpinionFormValues) => {
      setNavigateService(null);
        deleteArchivo("Resena",deleteIdsArchive?.resena ?? []);
        if(selectedServiceByOpinion && selectedServiceByOpinion.id){
            const serviceName = watch("service_name");
            if(s){
              setSelectedService({
                ...selectedService,
                nombreServicio:serviceName
              })
            }
            
            const dataService = {
              ServInterno: selectedServiceByOpinion.id,
              ServNombre: serviceName,
              ServDireccion: selectedServiceByOpinion.direccion,
              ServDescripcion: selectedServiceByOpinion?.descripcion,
              ServTieneDelivery: selectedServiceByOpinion?.tieneDelivery,
              servActivo:true,
              servLatitud: selectedServiceByOpinion?.latitud,
              ServLongitud: selectedServiceByOpinion?.longitud,
              UbigInterno: selectedServiceByOpinion?.idUbigeo,
              UsuaInterno: selectedServiceByOpinion?.idUsuario,
              SubcInterno: selectedServiceByOpinion?.idCategoria,
              ServHorario: selectedServiceByOpinion?.horario
            }
            const dataResena={
                ReseInterno:idResena,
                ReseValor:data.opinion,
                ReseCalificacion:rating,
                UsuaInterno: user?.id,
                multimediaIds: multimediaIds,
            }
            await saveResena(dataService,dataResena);
            await ObtenerServicios(false,true,(data)=>{
              const servicesNear = (data || []).filter((servicio) => {
                const distance = getDistanceKm(
                    Number(currentPositionService?.latitud),
                    Number(currentPositionService?.longitud),
                    Number(servicio.latitud),
                    Number(servicio.longitud)
                );
                return distance <= 5;
              });
              setCurrentLocationService({
                ...currentLocationService,
                services: data as Service[],
                servicesNear: servicesNear,
              });
            });
            setSuccessRegister(true);
            
        }else{
            const serviceName = watch("service_name");
            const dataService = {
              ServInterno: 0,
              ServDireccion: serviceAuxSelected.direccion,
              ServDescripcion: "",
              ServTieneDelivery: false,
              ServActivo: true,
              ServLatitud: serviceAuxSelected.latitud,
              ServLongitud: serviceAuxSelected.longitud,
              UbigInterno: serviceAuxSelected.idUbigeo,
              UsuaInterno: user?.id,
              SubcInterno: 83,
              ServHorario: "",
              ServNombre: serviceName
            }
            const dataResena={
                ReseInterno:idResena,
                ReseValor:data.opinion,
                ReseCalificacion:rating,
                UsuaInterno: user?.id,
                multimediaIds: multimediaIds,
            }
            await saveResena(dataService,dataResena);
            await ObtenerServicios(false,true,(data)=>{
              const servicesNear = (data || []).filter((servicio) => {
                const distance = getDistanceKm(
                    Number(currentPositionService?.latitud),
                    Number(currentPositionService?.longitud),
                    Number(servicio.latitud),
                    Number(servicio.longitud)
                );
                return distance <= 5;
              });
              setCurrentLocationService({
                ...currentLocationService,
                services: data as Service[],
                servicesNear: servicesNear,
              });
            });
            setSuccessRegister(true);
        }
    };


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

    const markers = useMemo(() => {
      const serviciosParaMostrar =
        currentLocationService.servicesNear.length > 0
          ? currentLocationService.servicesNear
          : currentLocationService.services;
      
  
      return serviciosParaMostrar.map((servicio) => {
        const isSelected = selectedServiceByOpinion?.id === servicio.id;
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
      selectedServiceByOpinion,
    ]);

    
    const [ResenaIds, setResenaIds] = useState<number[]>([]);
    useEffect(() => {
      if (
        !currentPositionService?.latitud ||
        !currentPositionService?.longitud ||
        markers.length === 0
      ) return;

      const fetchServiceAndResena = async () => {
         const s = searchParams.get("s");
        const decodedId = atob(String(s));

        const lat = Number(currentPositionService.latitud);
        const lng = Number(currentPositionService.longitud);
         let closestMarker;
        if(!s){
         
          const nearbyMarkers = markers.filter(marker => {
            const distance = getDistanceKm(lat, lng, marker.position.lat, marker.position.lng);
            return distance <= 0.001;
          });

          if (nearbyMarkers.length === 0) {
            return;
          }

          closestMarker = nearbyMarkers.reduce((closest, marker) => {
            const distToMarker = getDistanceKm(lat, lng, marker.position.lat, marker.position.lng);
            const distToClosest = getDistanceKm(lat, lng, closest.position.lat, closest.position.lng);
            return distToMarker < distToClosest ? marker : closest;
          });
        }

        const serviciosParaMostrar = 
          currentLocationService.servicesNear.length > 0
            ? currentLocationService.servicesNear
            : currentLocationService.services;

        const idBuscado = s ? decodedId : closestMarker && closestMarker.id;
        const servicioEncontrado = serviciosParaMostrar.find(
          service => Number(service.id) === Number(idBuscado)
        );

        if(decodedId){
          setMapCenterService({ lat: Number(servicioEncontrado?.latitud), lng: Number(servicioEncontrado?.longitud) });
        }
        setSelectedServiceByOpinion(servicioEncontrado as Service);
        const data = await resenaByServiceId(Number(servicioEncontrado?.id));
        
        if (data) {
          const userResena = data.find(resena => resena.idUsuario === user?.id);
          if (userResena) {
            setValue("opinion", userResena.resena || "");
            setRating(Number(userResena.calificacion));
            setIdResena(Number(userResena.id));
            setMultimediaIds(userResena.multimediaIds?.toString() || "");
            const ids = userResena.multimediaIds
            ?.split(',')
            .map(id => Number(id))
            .filter(id => !isNaN(id));

            const idsResena = userResena.multimediaIds?.split(',').map(id => Number(id)) || [];
            setResenaIds(idsResena);
            await getArchiveByResena(ids ?? [],userResena as Resena);
          } else {
            setValue("opinion", "");
            setRating(1);
            setIdResena(0);
            setMultimediaIds("");
            setArchiveByServiceResena({...archiveByServiceResena,resena:[],isLoading:false,id:0});
          }
        }
        setValue(
          "service_name",
          Number(servicioEncontrado?.idCategoria) === 83
            ? servicioEncontrado?.nombreServicio || ""
            : servicioEncontrado?.nombreServicio || ""
        );
      };

      fetchServiceAndResena();

    }, [currentPositionService, currentLocationService,modal,searchParams]);





    const defaultContainerStyle = {
        width: "100%",
        height: "300px",
    };

    

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        
         const currentServices = archiveByServiceResena?.resena || [];
        // Leer y guardar imagen si pasa validación
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageData = reader.result as string;
            setArchiveByServiceResena({
                ...archiveByServiceResena,
                resena:[
                    ...currentServices,
                    {
                        base64: imageData,
                        name: file.name,
                    },
                ],
                isLoading:true
            })
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = (index: number) => {
            const selectedPromotionId = ResenaIds[index];
            setDeleteIdsArchive({
                ...deleteIdsArchive,
                resena: [...(deleteIdsArchive?.resena || []), Number(selectedPromotionId)]
            }); 

            setResenaIds(prev => prev.filter((_, i) => i !== index));

        if (archiveByServiceResena?.resena) {
            setArchiveByServiceResena({
              ...archiveByServiceResena,
              resena: archiveByServiceResena.resena.filter((_, i) => i !== index)
            });
          }
          
    };

    const handleClickContinuar=()=>{
      setModal(false);
      setNavigateService(null);
      setSuccessRegister(false);
      setMapCenter({lat: Number(currentPositionService.latitud), lng: Number(currentPositionService.longitud)});
    }
    

  return (
    <CustomModal
        open={modal}
        typeSection={'null'}
        title={successRegister ? '¡Valoramos tu opinión!' :'Cuéntanos tu opinión'}
        onClose={handleClickContinuar}
        onContinue={successRegister ? handleClickContinuar : handleSubmit(onSubmit)}
        continueText={successRegister ? "Continuar" : "Publicar opinión" }
    >
      {
        successRegister ? <p className="w-full text-base text-center text-gray-500">Gracias por compartir tu experiencia en Mappi</p>
        :<div className="flex flex-col items-center justify-center gap-4 text-gray-900 text-center w-full">
            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="w-full">
                    <CustomInput
                        label="Tu Nombre"
                        placeholder="Tu Nombre"
                        required
                        {...register("user_name", { onChange: () => trigger("user_name") })}
                        value={watch("user_name") ?? ""}
                        disabled
                    />
                </div>
                <div className="w-full">
                    <CustomInput
                        label="Nombre del huarique"
                        placeholder="Nombre del huarique"
                        required
                        {...register("service_name", { onChange: () => trigger("service_name") })}
                        value={watch("service_name") ?? ""}
                        disabled={selectedServiceByOpinion && selectedServiceByOpinion.id ? Number(selectedServiceByOpinion?.idUsuario) == Number(user?.id) ? false : true : false}
                    />
                </div>
                <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <CustomMap
                        lat={mapCenter.lat}
                        lng={mapCenter.lng}
                        mapCenterService={ s ? mapCenterService:null}
                        additionalMarkers={markers}
                        zoom={18}
                        mapContainerStyle={defaultContainerStyle}
                        icon={current_location}
                        onClickMarker={handleMarkerClick}
                    />
                </div>
                <div className="w-full">
                    <CustomInput
                        label="Escribe tu opinión"
                        placeholder="Escribe tu opinión"
                        errorMessage={errors.opinion?.message}
                        multiline={true}
                        minRows={3}
                        required
                        {...register("opinion", { onChange: () => trigger("opinion") })}
                        value={watch("opinion") ?? ""}
                    />
                </div>
                <div className="w-full">
                    <p className="text-sm font-semibold text-gray-500 text-start mb-1">
                        Calificación: <span className="text-custom-primary">{rating.toFixed(2)}</span>
                    </p>

                    <div className="flex items-center gap-2 text-xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="transition-transform duration-200 hover:scale-125"
                        >
                            <FaStar
                            className={`${
                                star <= (hover || rating)
                                ? 'text-custom-primary drop-shadow-md'
                                : 'text-gray-300'
                            }`}
                            />
                        </button>
                        ))}
                    </div>
                </div>

                <div className="w-full">
                    <p className="text-sm text-gray-500 font-medium mb-1 text-start">
                    Comparte hasta 3 fotos con tu opinión <span className="text-gray-400">(opcional)</span>
                    </p>

                    <div className="flex gap-3 flex-wrap">
                    {archiveByServiceResena?.resena && archiveByServiceResena?.resena.map((resena, index) => (
                        <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                        <img src={resena.base64?.toString()} alt={`preview-${index}`} className="w-full h-full object-contain" />

                        <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-gray-600 hover:text-red-500 transition"
                            title="Eliminar"
                        >
                            <FaTimes size={12} />
                        </button>
                        </div>
                    ))}

                    {archiveByServiceResena?.resena && archiveByServiceResena?.resena?.length < 3 && (
                        <label className="w-24 h-24 border border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-custom-primary hover:text-custom-primary transition">
                        <FaPlus className="mb-1" />
                        <span className="text-xs text-center">Agregar</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            multiple
                        />
                        </label>
                    )}
                    </div>
                </div>
                
                
            </form>
        </div>
      }
    </CustomModal>
    
    );
};

export default ModalOpinion;