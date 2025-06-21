import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import { Service, ServiceByIdResponse, ServicePostResponse, ServiceResponse } from "../interfaces/service";
import { ServiceByUserResponse } from "../interfaces/serviceByUser";
import { ServicePremium, ServicePremiumResponse } from "../interfaces/servicesPremium";
import { getDistanceKm } from "../utils/locationService";
import { useAppState } from "./useAppState";
import { useArchives } from "./useArchives";

export const useServices = () => {

    const { token,setServiceList, serviceList,setArchiveByService,archiveByService,setMovieService,movieService,letterService,setLetterService,currentPositionService ,setServiceAll, serviceActive} = useAppState();
    const {postImagesService,postVideoService,postPdfService} = useArchives();

        const servicesPremium = async (
            callback: (success: boolean, data?:ServicePremium[] | [] , message?: string) => void = () => {}
        ) => {
            try {
                const response = await api.get<ServicePremiumResponse>(`/servicios/ObtenerPremium`);
                const { message, data, success } = response.data;
                if (success) {
                    callback(true, data);
                } else {
                    callback(false, [], message);
                }
            } catch (error) {
                handleApiError(error, (success, message) => {
                    callback(success, [], message);
                });
            }
        };

        const servicesByUser = async (
            incluirInactivos: boolean,
            callback: (success: boolean, dataOrMessage?: Service[], messageOrTotalServices?: string | number, totalServices?: number) => void = () => {}
        ) => {
            try {
                if (!token) {
                    console.warn("No hay token, usuario no autenticado.");
                    return;
                }
                const response = await apiWithAuth.get<ServiceByUserResponse>(
                    `/servicios/ObtenerPorUsuario?incluirInactivos=${incluirInactivos}`
                );
                const { success, data = [], message, totalServices } = response.data;
        
                if (success) {
                    if (incluirInactivos) {
                        callback(true,data, message, totalServices);
                    } else {
                        setServiceList(data as Service[]);
                        callback(true, data, message);
                    }
                } else {
                    callback(false, data, message);
                }
                
            } catch (error) {
                handleApiError(error, (success, message) => {
                    callback(success, [], message);
                });
            }
        };

        const saveService = async(dataService : Service,isActive: boolean = false)=>{
            try{
                const response = await apiWithAuth.post<ServicePostResponse>(
                    `/servicios/guardar`, {servicio:dataService}
                );
                const { success, data } = response.data;
                if (success) {
                    if(data){
                        if (serviceList && serviceList.length > 0) {
                            const existingIndex = serviceList.findIndex(item => item?.id === data.id);
                          
                            if (existingIndex !== -1) {
                              const updated = [...serviceList];
                              updated[existingIndex] = data;
                              setServiceList(updated);
                            } else {
                              setServiceList([...serviceList, data]);
                            }
                        }else{
                            setServiceList([data]);
                        }
                    }
                    if(isActive){
                        if (data?.id) {
                            postImagesService(data.id as number);
                            postVideoService(data.id as number);
                            postPdfService(data.id as number);
                        }
                    }

                    setArchiveByService({
                        ...archiveByService,
                        id:data?.id,
                        isLoading:false
                    })
                    if(movieService != null){
                        setMovieService({
                            ...movieService,
                            id: data?.id,
                            isLoading:false
                        })
                    }

                    if(letterService != null){
                        setLetterService({
                            ...letterService,
                            id: data?.id,
                            isLoading:false
                        })
                    }

                }
            }catch(error){
                handleApiError(error);
            }
        }

        const getServiceId = async(idService:number,callback: (success: boolean, data?: Service, message?: string) => void = () => {}) =>{
            try {
                const response = await apiWithAuth.get<ServiceByIdResponse>(
                    `/servicios/PorId/${idService}`
                );
                const { success, data , message } = response.data;
        
                if (success) {
                    callback(true,data, message);
                } else {
                    callback(false, data, message);
                }
                
            } catch (error) {
                handleApiError(error, (success, message) => {
                    callback(success,{}, message);
                });
            }
        }

        const deleteService = async(idService: number)=>{
            try{
                const response = await apiWithAuth.get<ServiceResponse>(
                    `/servicios/eliminar/${idService}`
                );
                const { success,id } = response.data;
                if (success) {
                    if (serviceList) {
                        setServiceList(serviceList.filter(serv => serv.id !== id));
                      }
                }
            }catch(error){
                handleApiError(error);
            }
        }


        const getServicesByUbigeo = async (
            idUbigeo: number,
            param?: string | null,
            callback: (success: boolean, data?: Service[] | [],dataNear?: Service[] | [], message?: string) => void = () => {}
          ) => {
            try {
              const response = await api.get<ServiceResponse>(
                `/servicios/PorUbigeo/${idUbigeo}/${param == null ? 0 : param}`
              );
          
              const { message, data, success } = response.data;
          
              // Espera a que la posición esté lista
              if (!currentPositionService.latitud || !currentPositionService.longitud) {
                console.warn("Latitud o longitud aún no disponibles.");
                callback(success, data || [],[], message); // Devuelve solo todos los datos
                return;
              }
          
              const servicesNear = (data || []).filter((servicio) => {
                const distance = getDistanceKm(
                  Number(currentPositionService?.latitud),
                  Number(currentPositionService?.longitud),
                  Number(servicio.latitud),
                  Number(servicio.longitud)
                );
                return distance <= 5;
              });
          
              if (success) {
                callback(true, data,servicesNear);
              } else {
                callback(false, [],[], message);
              }
            } catch (error) {
              handleApiError(error, (success, message) => {
                callback(success, [],[], message);
              });
            }
        };

        // ObtenerServicios(false,true,(data) 
        const ObtenerServicios = async (
            activeNear: boolean,
            isActiveCallback: boolean = false,
            callback: (data?: Service[] | []) => void = () => {}
            ) => {
            try {
                const response = await api.get<ServiceResponse>(`/servicios/ObtenerServicios`);
                const { data, success } = response.data;

                if (!success) {
                if (!isActiveCallback) setServiceAll([]);
                return;
                }

                if (isActiveCallback) {
                callback(data || []);
                return;
                }

                if (!activeNear) {
                setServiceAll(data || []);
                return;
                }
                if (!currentPositionService.latitud || !currentPositionService.longitud) {
                return;
                }
                if (callback) {
                callback(data || []);
                }

                const servicesNear = (data || []).filter((servicio) => {
                const distance = getDistanceKm(
                    Number(currentPositionService?.latitud),
                    Number(currentPositionService?.longitud),
                    Number(servicio.latitud),
                    Number(servicio.longitud)
                );
                return distance <= 5;
                });
                if(serviceActive){
                    setServiceAll(data as Service[]);
                    // setServiceActive(false);
                }else{
                    setServiceAll(servicesNear as Service[]);
                }
                
            } catch (error) {
                handleApiError(error);
            }
        };
        
       // en useServices.ts
const getPremiumServices = async (
  callback: (data: Service[]) => void = () => {}
) => {
  try {
    const response = await api.get<ServiceResponse>(`/servicios/ObtenerPremiumCarrousel`);
    const { data, success } = response.data;

    if (!success) return callback([]);
    callback(data || []);
  } catch (error) {
    handleApiError(error);
    callback([]);
  }
};



    return {
        servicesPremium,
        servicesByUser,
        saveService,
        deleteService,
        getServiceId,
        getServicesByUbigeo,
        ObtenerServicios,
        getPremiumServices
    };
};
