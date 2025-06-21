import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import { Resena, ResenaById, ResenaByIdResponse, ResenaPostResponse, UserResena } from "../interfaces/resena";
import { useAppState } from "./useAppState";
import { useArchives } from "./useArchives";

export const useResena = () => {

    const { 
        setArchiveByServiceResena,
        archiveByServiceResena
    } = useAppState();
    const {postImagesServiceResena} = useArchives();


        const saveResena = async(dataService : UserResena, dataResena: Resena)=>{
            try{
                const dataResponse = {
                    servicio: dataService,
                    resena: dataResena
                }
                const response = await apiWithAuth.post<ResenaPostResponse>(
                    `/servicios/guardar`, dataResponse
                );
                const { success,idResena } = response.data;
                if (success) {
                    postImagesServiceResena(Number(idResena));
                    setArchiveByServiceResena({
                        ...archiveByServiceResena,
                        id:idResena,
                        isLoading:false
                    })
                }
            }catch(error){
                handleApiError(error);
            }
        }

        const resenaByServiceId = async (idService: number): Promise<ResenaById[] | null> => {
            try {
                if(idService){
                    const response = await apiWithAuth.get<ResenaByIdResponse>(
                        `/servicios/ResenaByServiceId/${idService}`
                    );
                    const { success, data } = response.data;
                    return success ? (data as ResenaById[]) : null;
                }else{
                    return null;
                }
            } catch (error) {
                handleApiError(error);
                return null;
            }
        };

    return {
        saveResena,
        resenaByServiceId
    };
};
