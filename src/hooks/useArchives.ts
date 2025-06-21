import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import { AllArchiveResponse, ArchiveResponse, dataResponse, dateGetArchive, deleteArchiveResponse, getArchiveResponse, LogAndPortAndService, postArchiveResponse } from "../interfaces/Archive";
import { Resena } from "../interfaces/resena";
import { Service } from "../interfaces/service";
import { useAppState } from "./useAppState";

const nameBucket: string = import.meta.env.VITE_APP_BUCKET_NAME;

export const useArchives = () => {

    const {
        archiveByUser,
        user,
        setArchiveByUser,
        setDeleteIdsArchive,
        deleteIdsArchive,
        archiveByService,
        setArchiveByService,
        movieService,
        setMovieService,
        deleteMovieService,
        setDeleteMovieService,
        letterService,
        setLetterService,
        setDeleteLetterService,
        deleteLetterService,
        archiveByServiceResena,
        setArchiveByServiceResena
    } = useAppState();

    function base64ToBlob(base64: string, mimeType: string) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }

    const putOneImage = async ( image:File | Blob, archivoId:number, nuevoNombre:string,archivoTipo:string, callback?: (data: dataResponse) => void ) => {
        try {
      
          const formData = new FormData();
            if (image) {
                formData.append("formFile", image);
            }
            formData.append("nameBucket", "mappidevbucket");
            formData.append("archivoId", archivoId.toString());
      
            if (nuevoNombre) {
                formData.append("nuevoNombre", nuevoNombre);
            }
            const response = await apiWithAuth.post<ArchiveResponse>(
                `/Archivos/ActualizarArchivo?nameBucket=mappidevbucket&archivoId=${archivoId}&nuevoNombre=${nuevoNombre}&archivoTipo=${archivoTipo}`,
                formData,
                {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                }
            );
            const { success, data } = response.data;
        
            if (success) {
                if(callback){
                    return data;
                }
                return data;
            } else {
                console.error("Error al actualizar archivo", response.data);
            }
        } catch (error) {
          handleApiError(error);
        }
    };

    const postOneImage = async (image: File | Blob, id: number, type: string, table: string, fileName: string, callback?: (data: dataResponse) => void) => {
        try {
            if (image) {
    
                const formData = new FormData();
                formData.append("formFile", image, fileName);
                formData.append("id", id.toString());
                formData.append("tipo", type);
                formData.append("tabla", table);
                formData.append("interno", "0");
    
                const response = await apiWithAuth.post<ArchiveResponse>(
                    `/Archivos/SubirArchivo?nameBucket=${nameBucket}`,
                    formData,{
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
    
                const { success, data } = response.data;
                if (success) {
                    if(callback){
                        return data;
                    }
                }
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const postOneVideo = async(video: File | Blob, id: number, type: string, table: string, fileName: string, callback?: (data: dataResponse) => void) => {
        if (video) {
    
            const formData = new FormData();
            formData.append("formFile", video, fileName);
            formData.append("id", id.toString());
            formData.append("tipo", type);
            formData.append("tabla", table);
            formData.append("interno", "0");

            const response = await apiWithAuth.post<ArchiveResponse>(
                `/Archivos/SubirArchivo?nameBucket=${nameBucket}`,
                formData,{
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const { success, data } = response.data;
            if (success) {
                if(callback){
                    return data;
                }
            }
        }
    }

    const postOnePDF = async(video: File | Blob, id: number, type: string, table: string, fileName: string, callback?: (data: dataResponse) => void) => {
        if (video) {
    
            const formData = new FormData();
            formData.append("formFile", video, fileName);
            formData.append("id", id.toString());
            formData.append("tipo", type);
            formData.append("tabla", table);
            formData.append("interno", "0");

            const response = await apiWithAuth.post<ArchiveResponse>(
                `/Archivos/SubirArchivo?nameBucket=${nameBucket}`,
                formData,{
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const { success, data } = response.data;
            if (success) {
                if(callback){
                    return data;
                }
            }
        }
    }
    
    
    const isBase64 = (str: string): boolean => str.startsWith("data:image");
    const isBaseVideo64 = (str: string): boolean => str.startsWith("data:video");
    const isBasePdf64 = (base64: string) => {
        return /^data:application\/pdf;base64,/.test(base64);
      };
      
    const postImagesIndependent = (typeIndependient:string,callback?: (data: dataResponse) => void) => {
        const logo = archiveByUser?.independent?.logo?.base64;
        const portada = archiveByUser?.independent?.portada?.base64;

        const logo_name = archiveByUser?.independent?.logo?.name;
        const portada_name = archiveByUser?.independent?.portada?.name;
    
        if (logo && typeof logo === 'string' && isBase64(logo) && typeIndependient == "LOG") {
            const type = logo.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
            const base64Data = logo.split(',')[1];
            const blobLogo = base64ToBlob(base64Data, type);
            const fileLogo = new File([blobLogo], logo_name ?? `${type}_${Date.now()}`, { type });
            postOneImage(fileLogo, Number(user?.id), "LOG", "Usuarios", logo_name ?? `${type}_${Date.now()}`,callback);
        }
        
        if (portada && typeof portada === 'string' && isBase64(portada) && typeIndependient == "PTD") {
            const type = portada.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
            const base64Data = portada.split(',')[1];
            const blobPortada = base64ToBlob(base64Data, type);
            const filePortada = new File([blobPortada], portada_name ?? `${type}_${Date.now()}`, { type });
            postOneImage(filePortada, Number(user?.id), "PTD", "Usuarios",portada_name ?? `${type}_${Date.now()}`,callback);
        }
    };
    
    const postImagesBusiness = (responseCompanyId: number,typeCompany:string,callback?: (data: dataResponse) => void) => {
        const logo = archiveByUser?.company?.logo?.base64;
        const portada = archiveByUser?.company?.portada?.base64;

        const logo_name = archiveByUser?.company?.logo?.name;
        const portada_name = archiveByUser?.company?.portada?.name;
    
        if (logo && typeof logo === 'string' && isBase64(logo)  && typeCompany == "LOG" ) {
            const type = logo.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
            const base64Data = logo.split(',')[1];
            const blobLogo = base64ToBlob(base64Data, type);
            const fileLogo = new File([blobLogo], logo_name ?? `${type}_${Date.now()}`, { type });
            postOneImage(fileLogo, responseCompanyId, "LOG", "Empresas", logo_name ?? `${type}_${Date.now()}`,callback);
        }
    
        if (portada && typeof portada === 'string' && isBase64(portada) && typeCompany == "PTD") {
            const type = portada.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
            const base64Data = portada.split(',')[1];
            const blobPortada = base64ToBlob(base64Data, type);
            const filePortada = new File([blobPortada], portada_name ?? `${type}_${Date.now()}`, { type });
            postOneImage(filePortada, responseCompanyId, "PTD", "Empresas",portada_name ?? `${type}_${Date.now()}`,callback);
        }
    }
    
    const postImagesService = (responseServiceId: number) => {
        if (Array.isArray(archiveByService?.service)) {
            archiveByService?.service.forEach((img) => {
            if (img?.base64 && isBase64(img.base64)) {
              const type = img.base64.match(/data:(.*);base64/)?.[1] || "image/jpeg";
              const base64Data = img.base64.split(",")[1];
              const blob = base64ToBlob(base64Data, type);
      
              const fileName = img.name ?? `SRV_${Date.now()}`;
              const file = new File([blob], fileName, { type });
              postOneImage(file, responseServiceId, "SRV", "Servicios",fileName);
            }
          });
        }
    };

    const postImagesServiceResena = (responseResenaId: number) => {
        if (Array.isArray(archiveByServiceResena?.resena)) {
            archiveByServiceResena?.resena.forEach((img) => {
            if (img?.base64 && isBase64(img.base64)) {
              const type = img.base64.match(/data:(.*);base64/)?.[1] || "image/jpeg";
              const base64Data = img.base64.split(",")[1];
              const blob = base64ToBlob(base64Data, type);
      
              const fileName = img.name ?? `RES_${Date.now()}`;
              const file = new File([blob], fileName, { type });
              postOneImage(file, Number(responseResenaId), "RES", "Resena",fileName);
            }
          });
        }
    };

    const postVideoService = (responseServiceId: number) => {
        if (movieService?.base64 && isBaseVideo64(movieService.base64)) {
            const type = movieService.base64.match(/data:(.*);base64/)?.[1] || "video/mp4";
            const base64Data = movieService.base64.split(",")[1];
            const blob = base64ToBlob(base64Data, type);
            const fileName = movieService.name ?? `SRV_VID_${Date.now()}.mp4`;
            const file = new File([blob], fileName, { type });
            postOneVideo(file, responseServiceId, "SRV_VID", "Servicios", fileName);
        }
    };

    const postPdfService = (responseServiceId: number)=>{
        if (letterService?.base64 && isBasePdf64(letterService.base64)) {
            const type = "application/pdf";
            const base64Data = letterService.base64.split(",")[1];
            const blob = base64ToBlob(base64Data, type);
            const fileName = letterService.name ?? `SRV_CART_${Date.now()}.pdf`;
            const file = new File([blob], fileName, { type });
            postOnePDF(file, responseServiceId, "SRV_CART", "Servicios", fileName);
          }
    }
    

    const putImagesIndependent = (id: number,typeIndependient:string,callback?: (data: dataResponse) => void) => {
        const logo = archiveByUser?.independent?.logo?.base64;
        const portada = archiveByUser?.independent?.portada?.base64;

        const logo_name = archiveByUser?.independent?.logo?.name;
        const portada_name = archiveByUser?.independent?.portada?.name;
    
        if (logo && typeof logo === 'string' && isBase64(logo) && typeIndependient == "LOG") {
            const type = logo.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
            const base64Data = logo.split(',')[1];
            const blobLogo = base64ToBlob(base64Data, type);
            const fileLogo = new File([blobLogo], logo_name ?? `${type}_${Date.now()}`, { type });
            putOneImage(fileLogo, id, logo_name ?? `${type}_${Date.now()}`,"LOG",callback);
        }
        
        if (portada && typeof portada === 'string' && isBase64(portada) && typeIndependient == "PTD") {
            const type = portada.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
            const base64Data = portada.split(',')[1];
            const blobPortada = base64ToBlob(base64Data, type);
            const filePortada = new File([blobPortada], portada_name ?? `${type}_${Date.now()}`, { type });
            putOneImage(filePortada, id ,portada_name ?? `${type}_${Date.now()}`,"PTD",callback);
        }
    };

    const putImagesCompany = (id: number,typeCompany:string,callback?: (data: dataResponse) => void) => {
        const logo = archiveByUser?.company?.logo?.base64;
        const portada = archiveByUser?.company?.portada?.base64;

        const logo_name = archiveByUser?.company?.logo?.name;
        const portada_name = archiveByUser?.company?.portada?.name;
    
        if (logo && typeof logo === 'string' && isBase64(logo) && typeCompany == "LOG") {
            const type = logo.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
            const base64Data = logo.split(',')[1];
            const blobLogo = base64ToBlob(base64Data, type);
            const fileLogo = new File([blobLogo], logo_name ?? `${type}_${Date.now()}`, { type });
            putOneImage(fileLogo, id, logo_name ?? `${type}_${Date.now()}`,"LOG",callback);
        }
        
        if (portada && typeof portada === 'string' && isBase64(portada) && typeCompany == "PTD") {
            const type = portada.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
            const base64Data = portada.split(',')[1];
            const blobPortada = base64ToBlob(base64Data, type);
            const filePortada = new File([blobPortada], portada_name ?? `${type}_${Date.now()}`, { type });
            putOneImage(filePortada, id ,portada_name ?? `${type}_${Date.now()}`,"PTD",callback);
        }
    };

    const putImagesServices = (responseServiceId: number,callback?: (data: dataResponse) => void) => {
        if (Array.isArray(archiveByService?.service)) {
            archiveByService.service.forEach((img) => {
            if (img?.base64 && isBase64(img.base64)) {
              const type = img.base64.match(/data:(.*);base64/)?.[1] || "image/jpeg";
              const base64Data = img.base64.split(",")[1];
              const blob = base64ToBlob(base64Data, type);
      
              const fileName = img.name ?? `SRV_${Date.now()}`;
              const file = new File([blob], fileName, { type });
              putOneImage(file, responseServiceId, fileName ,"SRV",callback);
            }
          });
        }
    };

    const getArchiveByUserOrCompany = async (
        idLogo: number,
        idPortada: number,
        type: string,
      ) => {
        try {
          const [respLOG, respPTD] = await Promise.all([
            apiWithAuth.get<getArchiveResponse>(`/Archivos/Por_Tabla_Codigo_Tipo/${type}/${idLogo}/LOG`),
            apiWithAuth.get<getArchiveResponse>(`/Archivos/Por_Tabla_Codigo_Tipo/${type}/${idPortada}/PTD`)
          ]);
      
          const archivoLOG = respLOG?.data?.data?.[0] as dateGetArchive ?? null;
          const archivoPTD = respPTD?.data?.data?.[0] as dateGetArchive ?? null;
      
          const commonData = {
            logo: {
              base64: archivoLOG?.urlS3,
              name: archivoLOG?.archNombre,
            },
            portada: {
              base64: archivoPTD?.urlS3,
              name: archivoPTD?.archNombre,
            },
            isLoading: true,
          };
      
          if (type === "Usuarios" && archiveByUser?.independent?.isLoading) {
            setArchiveByUser({
                ...archiveByUser,
                independent: commonData,
            });
          }
      
          if (type !== "Usuarios" && archiveByUser?.company?.isLoading) {
            setArchiveByUser({
              ...archiveByUser,
              company: commonData,
            });
          }
        } catch (errors) {
          console.error("Errores generales:", errors);
        }
      };
      

    const getArchiveByServices = async (idServices: number[], serviceSelect: Service) => {
        try {
            const mappedUrls: LogAndPortAndService[] = Array.isArray(idServices)
                ? (
                    await Promise.all(
                    idServices
                        .filter(id => typeof id === "number" && !isNaN(id))
                        .map(id =>
                        apiWithAuth.get<getArchiveResponse>(`/Archivos/Por_Tabla_Codigo_Tipo/Servicios/${id}/SRV`)
                        )
                    )
                )
                    .map(r => r.data?.data?.[0]?.urlS3)
                    .filter(Boolean)
                    .map(url => ({ base64: url }))
                : [];
      
            const hasValidServices = () => {
                if (!serviceSelect?.idPromociones || !Array.isArray(idServices)) return false;
                const promoIds = serviceSelect.idPromociones.split(',').map(Number);
                return promoIds.some(id => idServices.includes(id));
            };

            const serviceData = {
                isLoading: true,
                service: hasValidServices() ? mappedUrls : [],
                id:serviceSelect?.id
            };

            setArchiveByService({
                ...archiveByService,
                ...serviceData,
            })

        } catch (errors) {
            console.error('Errores generales:', errors);
        }
    };

    const getArchiveByResena = async (idResenas: number[], resenaSelect: Resena) => {
        try {
            const mappedUrls: LogAndPortAndService[] = Array.isArray(idResenas)
                ? (
                    await Promise.all(
                    idResenas
                        .filter(id => typeof id === "number" && !isNaN(id))
                        .map(id =>
                        apiWithAuth.get<getArchiveResponse>(`/Archivos/Por_Tabla_Codigo_Tipo/Resena/${id}/RES`)
                        )
                    )
                )
                    .map(r => r.data?.data?.[0]?.urlS3)
                    .filter(Boolean)
                    .map(url => ({ base64: url }))
                : [];
      
            const hasValidServices = () => {
                if (!resenaSelect?.multimediaIds || !Array.isArray(idResenas)) return false;
                const promoIds = resenaSelect.multimediaIds.split(',').map(Number);
                return promoIds.some(id => idResenas.includes(id));
            };

            

            const serviceData = {
                isLoading: true,
                resena: hasValidServices() ? mappedUrls : [],
                id:resenaSelect?.ReseInterno
            };

            setArchiveByServiceResena({
                ...archiveByServiceResena,
                ...serviceData,
            })

        } catch (errors) {
            console.error('Errores generales:', errors);
        }
    };

    const getArchiveMovieByService = async (idArchive: number, serviceSelect: Service) => {
        try {
            if (!idArchive || isNaN(idArchive)|| idArchive === 0){
                if(serviceSelect.id != movieService?.id){
                    setMovieService(null);
                }
                return;
            }else{
                const response = await apiWithAuth.get<getArchiveResponse>(
                    `/Archivos/Por_Tabla_Codigo_Tipo/Servicios/${idArchive}/SRV_VID`
                );
        
                const videoUrl = response.data?.data?.[0]?.urlS3;
                const videoName = response.data?.data?.[0]?.archNombre;
    
                setMovieService({
                    isLoading:true,
                    base64:videoUrl,
                    id:serviceSelect?.id,
                    name:videoName
                })
            }
    
        } catch (error) {
            console.error('Error al obtener el video promocional:', error);
        }
    };
    

    const getArchivePdfByService = async (idArchive: number, serviceSelect: Service) => {
        try {
            if (!idArchive || isNaN(idArchive)|| idArchive === 0){
                if(serviceSelect.id != letterService?.id){
                    setLetterService(null);
                }
                return;
            }else{
                const response = await apiWithAuth.get<getArchiveResponse>(
                    `/Archivos/Por_Tabla_Codigo_Tipo/Servicios/${idArchive}/SRV_CART`
                );
        
                const pdfUrl = response.data?.data?.[0]?.urlS3;
                const pdfName = response.data?.data?.[0]?.archNombre;
    
                setLetterService({
                    isLoading:true,
                    base64:pdfUrl,
                    id:serviceSelect?.id,
                    name:pdfName
                })
            }
    
        } catch (error) {
            console.error('Error al obtener el video promocional:', error);
        }
    };
    

    const deleteArchivo = async (type: string, idArchivo: number | number[]) => {
        try {
            if (type === "Servicios" && Array.isArray(idArchivo)) {
                const validIds = idArchivo.filter(id => typeof id === "number" && !isNaN(id));
                const responses = await Promise.all(
                    validIds.map(id => {
                    return apiWithAuth.post<deleteArchiveResponse>(`/archivos/DeleteArchivo`, { ArchInterno: id });
                    })
                );
                const eliminados = responses
                    .filter(r => r.data.success)
                    .map(r => r.data.id);
                setDeleteIdsArchive({
                    ...deleteIdsArchive,
                    services: deleteIdsArchive?.services?.filter(id => !eliminados.includes(id)) ?? null
                });
            }else if (type === "Resena" && Array.isArray(idArchivo)) {
                const validIds = idArchivo.filter(id => typeof id === "number" && !isNaN(id));
                const responses = await Promise.all(
                    validIds.map(id => {
                    return apiWithAuth.post<deleteArchiveResponse>(`/archivos/DeleteArchivo`, { ArchInterno: id });
                    })
                );
                const eliminados = responses
                    .filter(r => r.data.success)
                    .map(r => r.data.id);
                setDeleteIdsArchive({
                    ...deleteIdsArchive,
                    resena: deleteIdsArchive?.resena?.filter(id => !eliminados.includes(id)) ?? null
                });
            } else {
                const response = await apiWithAuth.post<deleteArchiveResponse>(
                    `/archivos/DeleteArchivo`,
                    { ArchInterno: idArchivo }
                );
    
                const { success, id } = response.data;
    
                if (success) {
                    if (type === "Usuarios") {
                        setDeleteIdsArchive({
                            ...deleteIdsArchive,
                            independent: {
                                logo: deleteIdsArchive?.independent?.logo === id ? null : deleteIdsArchive?.independent?.logo,
                                portada: deleteIdsArchive?.independent?.portada === id ? null : deleteIdsArchive?.independent?.portada
                            }
                        });
                    } else if (type === "Empresas") {
                        setDeleteIdsArchive({
                            ...deleteIdsArchive,
                            company: {
                                logo: deleteIdsArchive?.company?.logo === id ? null : deleteIdsArchive?.company?.logo,
                                portada: deleteIdsArchive?.company?.portada === id ? null : deleteIdsArchive?.company?.portada
                            }
                        });
                    }
                }
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const deleteMovieArchivo = async (idArchivo: number) => {
        try {
            if(idArchivo != 0){
                const response = await apiWithAuth.post<deleteArchiveResponse>(
                    `/archivos/DeleteArchivo`,
                    { ArchInterno: idArchivo }
                );
    
                const { success, id } = response.data;
    
                if (success) {
                    setDeleteMovieService(deleteMovieService == Number(id) ? 0 : deleteMovieService);
                }
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const deleteLetterArchivo = async(idArchivo: number) =>{
        try {
            if(idArchivo != 0){
                const response = await apiWithAuth.post<deleteArchiveResponse>(
                    `/archivos/DeleteArchivo`,
                    { ArchInterno: idArchivo }
                );
    
                const { success, id } = response.data;
    
                if (success) {
                    setDeleteLetterService(deleteLetterService == Number(id) ? 0 : deleteLetterService);
                }
            }
        } catch (error) {
            handleApiError(error);
        }
    }

    const getAllArchive = async (
        callback: (success: boolean, archivos: AllArchiveResponse) => void
    ) => {
        try {
            const response = await api.get<AllArchiveResponse>(`/archivos/ObtenerTodos`);

            const archivos = response.data.archivos || [];

            const archivosInvertidos: AllArchiveResponse = {
            ...response.data,
            archivos: [...archivos].reverse(),
            };

            callback(true, archivosInvertidos);
        } catch (error) {
            handleApiError(error);
        }
    };



    const postArchives = async (
        formData: FormData,
        callback: (messae: string, success: boolean, data: dataResponse) => void
        ) => {
        try {
            const response = await api.post<postArchiveResponse>(
            `Archivos/SubirArchivo?nameBucket=${nameBucket}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
            );
            const { messae, success, data } = response.data;
            callback(messae as string, success, data as dataResponse);

        } catch (error) {
            handleApiError(error);
        }
    };

    const updateArchive = async (
        id: number,
        formData: FormData,
        nuevoNombre: string | null,
        callback: (messae: string, success: boolean, data: dataResponse) => void
    ) => {
        try {
            let url = `Archivos/ActualizarArchivo?nameBucket=${nameBucket}&archivoId=${id}`;
            
            if (nuevoNombre) {
            url += `&nuevoNombre=${encodeURIComponent(nuevoNombre)}`;
            }

            const response = await api.post<postArchiveResponse>(
            url,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
            );

            const { messae, success, data } = response.data;
            callback(messae as string, success, data as dataResponse);
        } catch (error) {
            handleApiError(error);
        }
    };

  const deleteArchive = async (
  id: number,
  callback: (message: string, success: boolean, deletedId?: number) => void
) => {
  try {
    const data = { ArchInterno: id };

    const response = await api.post<{ id: number; estado: string; mensaje: string }>(
      `Archivos/EliminarArchivo?nameBucket=${nameBucket}`,
      data
    );

    const { id: deletedId, estado, mensaje } = response.data;
    const success = estado.toLowerCase().includes("satisfactorio");

    callback(mensaje, success, deletedId);
  } catch (error) {
    handleApiError(error);
    callback("Error en la petición", false);
  }
};






    return {
        postImagesIndependent,
        postImagesBusiness,
        postImagesService,
        getArchiveByUserOrCompany,
        deleteArchivo,
        putImagesIndependent,
        putImagesCompany,
        putImagesServices,
        getArchiveByServices,
        postVideoService,
        getArchiveMovieByService,
        deleteMovieArchivo,
        postPdfService,
        getArchivePdfByService,
        deleteLetterArchivo,
        postImagesServiceResena,
        getArchiveByResena,
        getAllArchive,
        postArchives,
        updateArchive,
        deleteArchive
    };
};
