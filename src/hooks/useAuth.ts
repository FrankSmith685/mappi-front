import { api } from "../api/apiConfig";
import { AuthResponse, LoginData, RegisterData, UpdateGoogleTokenRequest } from "../interfaces/auth";
import { useAppState } from "./useAppState";
import { handleApiError } from "../api/apiError";
import { useNavigate } from "react-router-dom";
// import { User } from "firebase/auth";
import { UserResponse,User } from "../interfaces/user";

export const useAuth = () => {
    const {setToken,setUser, setNavigateService, setActiveModalOPtionSession,setActiveModalOPtion,setModal,setRol} = useAppState();
    const navigate = useNavigate();
    const logIn = async (
        loginData: LoginData,
        callback: (success: boolean, message?: string) => void = () => {}
      ) => {
        try {
            const response = await api.get<AuthResponse>(`/usuarios/login/${loginData.email}/${loginData.password}`);
            const { message, token, success } = response.data;
            if (success) {
                setToken(token as string);
                if(loginData.email == "admin@gmail.com"){
                  setRol("admin");
                }
                callback(true);

                const isNavigateService = localStorage.getItem("navigateService");
                
                if(isNavigateService=='null' || isNavigateService == null){
                  navigate("/");
                }else{
                   window.location.href = `${isNavigateService}`;
                }
            } else {
                callback(false, message);
            }
        } catch (error) {
            handleApiError(error, callback);
        }
    };
  
    const singUp = async (
        registerData: RegisterData,
        callback: (success: boolean, message?: string) => void = () => {},
        isActive: boolean = true
      ) => {
        try {
          const response = await api.post<AuthResponse>("/usuarios/guardar", registerData);
          const { message, token, success } = response.data;
          if (success) {
            setToken(token as string);
            callback(true);
            if(isActive){
              const isNavigateService = localStorage.getItem("navigateService");
                if(isNavigateService=='null' || isNavigateService == null ){
                  navigate("/");
                }else{
                   window.location.href = `${isNavigateService}`;
                }
            }
            
          } else {
            callback(false, message);
          }
        } catch (error) {
            handleApiError(error, callback);
        }
    };

    const verificateUser = async (
      email: string,
      callback: (exists: boolean,id:number, message?: string) => void = () => {}
    ) => {
      try {
        const response = await api.get<{ success: boolean; exists: boolean; id: number; message: string }>(
          `/usuarios/ExisteCorreo?email=${encodeURIComponent(email)}`
        );

        const { success, exists,id, message } = response.data;

        if (success) {
          callback(exists,id, message);
        } else {
          callback(false, id ,message);
        }
      } catch (error) {
        callback(false,0, "Error de red o servidor");
        console.error("Error en verificación de correo:", error);
      }
    };

    

     const updateGoogleToken = async (
        data: UpdateGoogleTokenRequest,
        callback: (success: boolean, message?: string) => void = () => {}
      ) => {
        try {
          const response = await api.put("/usuarios/actualizar-token-google", data);
          const { success, message } = response.data;

          if (success) {
            callback(true, message);
          } else {
            callback(false, message);
          }
        } catch (error) {
          handleApiError(error, callback);
        }
      }; 


    const logInGoogle = async (
      loginData: UpdateGoogleTokenRequest,
      callback: (success: boolean, message?: string) => void = () => {},
      isActive: boolean = true
    ) => {
      try {
        const response = await api.post<AuthResponse>(`/usuarios/logInGoogle`, loginData);
        const { message, token, success } = response.data;

        if (success) {
          
          setToken(token as string);
          callback(true);
          if(isActive){
            const isNavigateService = localStorage.getItem("navigateService");
                
            if(isNavigateService=='null' || isNavigateService == null){
              navigate("/");
            }else{
                window.location.href = `${isNavigateService}`;
            }
          }
          
        } else {
          callback(false, message);
        }
      } catch (error) {
        handleApiError(error, callback);
      }
    };

    const sendCodeEmail = async (
      emailData: User,
      callback: (success: boolean, message?: string) => void = () => {},
    ) => {
      try {
        const response = await api.post<UserResponse>(`/usuarios/EnviarCodigoRecuperacion`, {correo:emailData.correo});
        const { message, success } = response.data;

        if (success) {
          callback(true,message);
        } else {
          callback(false, message);
        }
      } catch (error) {
        handleApiError(error, callback);
      }
    };

    const validateCodeEmail = async (
      validateData: User,
      callback: (success: boolean, message?: string) => void = () => {},
    ) => {
      try {
        const response = await api.post<UserResponse>(`/usuarios/ValidarCodigoRecuperacion`, {correo:validateData.correo,codigo:validateData.codigo});
        const { message, success } = response.data;

        if (success) {
          callback(true,message);
        } else {
          callback(false, message);
        }
      } catch (error) {
        handleApiError(error, callback);
      }
    };

    const updatePassword = async (
      validateData: User,
      callback: (success: boolean, message?: string) => void = () => {},
    ) => {
      try {
        const response = await api.post<UserResponse>(`/usuarios/ActualizarContrasena`, {correo:validateData.correo,nuevaContrasena:validateData.nuevaContrasena,confirmarContrasena:validateData.confirmarNuevaContrasena});
        const { message, success } = response.data;

        if (success) {
          callback(true,message);
        } else {
          callback(false, message);
        }
      } catch (error) {
        handleApiError(error, callback);
      }
    };
  
    const logout = () => {
      setUser(null);
      setToken(null);
      setRol(null);
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      setNavigateService(null);
      setModal(false);
      setActiveModalOPtion(false);
      setActiveModalOPtionSession(false);
    };
  
    return {
        logIn,
        singUp,
        logout,
        verificateUser,
        logInGoogle,
        updateGoogleToken,
        sendCodeEmail,
        validateCodeEmail,
        updatePassword
    };
  };