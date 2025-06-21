import { apiWithAuth,api } from "../api/apiConfig";
import { useAppState } from "./useAppState";
import { handleApiError } from "../api/apiError";
import { User, UserAll, UserResponse } from "../interfaces/user";
import { useArchives } from "./useArchives";

export const useUser = () => {
    const {user,setUser,token,setModifiedUser,setArchiveByUser,archiveByUser} = useAppState();
    const {postImagesIndependent,putImagesIndependent} = useArchives();

    const getUser = async (callback?: (user: User) => void) => {
        if(!callback){
            if (user) return;
        }
        try {
            if (!token) {
                console.warn("No hay token, usuario no autenticado.");
                return;
            }
            const response = await apiWithAuth.get<UserResponse>("/usuarios/ObtenerUsuario");
            const { data, success } = response.data;
            
            if (success && data) {
                setUser(data as User);
                setModifiedUser(data as User);
                callback?.(data as User);
            } else {
                console.warn("No se pudo obtener el usuario.");
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const getAllUser = async (): Promise<UserAll[] | null> => {
  try {
    const response = await api.get<UserResponse>("/usuarios/ObtenerUsuarios");
    const { data, success } = response.data;

    if (success && data) {
      return data as UserAll[];
    } else {
      console.warn("No se pudo obtener el usuario.");
      return null;
    }
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

    
    const updateUser = async (
        currentUser: User,
        
        callback: (success: boolean, message?: string) => void = () => {},
        isActive: boolean = false,
        isActiveUser: boolean = false,
    ) => {
        try {
            if (!token) {
                console.warn("No hay token, usuario no autenticado.");
                return;
            }
            const response = await apiWithAuth.put<UserResponse>("/usuarios/actualizar",currentUser);
            const { success,message } = response.data;
    
            if (success) {
                callback(success,message);
                if(!isActiveUser){
                    setUser({...user,...currentUser});
                    setModifiedUser({...user, ...currentUser});
                }
                
                
                if (user && isActive) {
                    const promises = [];

                    if (!user.imgPerfil) {
                        promises.push(postImagesIndependent('LOG'));
                    } else if (
                        user.imgPerfil
                    ) {
                        promises.push(putImagesIndependent(user.imgPerfil, 'LOG'));
                    }

                    if (!user.imgPortada) {
                        promises.push(postImagesIndependent('PTD'));
                    } else if (
                        user.imgPortada 
                    ) {
                        promises.push(putImagesIndependent(user.imgPortada, 'PTD'));
                    }
                    await Promise.all(promises);
                    setArchiveByUser({
                        ...archiveByUser,
                        independent: {
                            ...archiveByUser?.independent,
                            isLoading: false,
                        },
                    });
                }
            } else {
                callback(false, message);
            }
        } catch (error) {
            handleApiError(error, callback);
        }
    };

    return {
        getUser,
        updateUser,
        getAllUser
    };
};