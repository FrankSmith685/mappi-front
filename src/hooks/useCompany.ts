import { apiWithAuth } from "../api/apiConfig";
import { useAppState } from "./useAppState";
import { handleApiError } from "../api/apiError";
import { Company, CompanyResponse } from "../interfaces/company";
import { useArchives } from "./useArchives";
import { useUser } from "./useUser";

export const useCompany = () => {
    const {company,setCompany,setModifiedCompany,token, setUser,setModifiedUser,user,setArchiveByUser,archiveByUser} = useAppState();
  const {postImagesBusiness, putImagesCompany} = useArchives();
  const {updateUser} = useUser();

    const getCompany = async (callback?: (user: Company) => void) => {
        if(!callback){
            if (company) return;
        }
        try {
            if (!token) {
                console.warn("No hay token, usuario no autenticado.");
                return;
            }
            const response = await apiWithAuth.get<CompanyResponse>("/Empresas/ObtenerEmpresaPorUsuario");
            const { data, success } = response.data;
    
            if (success && data) {
                
                if(callback){
                    callback?.(data as Company);
                }else{
                    setCompany(data as Company);
                    setModifiedCompany(data as Company);
                }
                
            } else {
                console.warn("No se pudo obtener el company.");
            }
        } catch (error) {
            handleApiError(error);
        }
    };
    
    const saveCompany = async (dataCompany: Company,isActive: boolean = false,isActiveUser:boolean = false) => {
        try {
            const response = await apiWithAuth.post<CompanyResponse>(`/Empresas/guardar`, dataCompany);
            const { success, data = [] } = response.data;
    
            if (success) {
                const dataCompany_ = data as Company;
                if(isActiveUser){
                    const dataUser = {
                        capacitacionEsHabilitado: true,
                        capacitacionTipo: "video",
                        capacitacionCompleto: 0,
                        capacitacionStatus: 'no visto',
                        tieneEmpresa:true,
                      };
                    updateUser(dataUser,(()=>{}),false,true);
    
                    setUser({ ...user, ...dataUser });
                    setModifiedUser({ ...user, ...dataUser });
                }else{
                    setUser({ ...user, tieneEmpresa:true });
                    setModifiedUser({ ...user, tieneEmpresa:true });
                }

                

                setCompany(dataCompany_);

                if (dataCompany_ && isActive) {
                    const promises = [];

                    if (!dataCompany_.idLogo) {
                        promises.push(postImagesBusiness(Number(dataCompany_.id),'LOG'));
                    } else if (
                        dataCompany_.idLogo
                    ) {
                        promises.push(putImagesCompany(dataCompany_.idLogo, 'LOG'));
                    }

                    if (!dataCompany_.idPortada) {
                        promises.push(postImagesBusiness(Number(dataCompany_.id),'PTD'));
                    } else if (
                        dataCompany_.idPortada 
                    ) {
                        promises.push(putImagesCompany(dataCompany_.idPortada, 'PTD'));
                    }
                    await Promise.all(promises);
                    setArchiveByUser({
                        ...archiveByUser,
                        company: {
                            ...archiveByUser?.company,
                            isLoading: false,
                        },
                    });
                }
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    return {
        getCompany,
        saveCompany
    };
};