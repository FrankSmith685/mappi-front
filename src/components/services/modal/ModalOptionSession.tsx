import React from "react";
import { useAppState } from "../../../hooks/useAppState";
import CustomModal from "../../ui/CustomModal";
import CustomButton from "../../ui/CustomButtom";
import { FaGoogle } from "react-icons/fa";
import { signInWithGoogle } from "../../../utils/auth";
import { useAuth } from "../../../hooks/useAuth";
import { RegisterData, UpdateGoogleTokenRequest } from "../../../interfaces/auth";
import { generateRandomPassword } from "../../../utils/passwor";
import useSnackbar from "../../ui/CustomAlert";
import { useLocation, useNavigate } from "react-router-dom";
const ModalOptionSession: React.FC = () => {
    const { 
        modal, 
        setModal,
        setActiveModalOPtionSession,
        setActiveModalOPtion,
        setNavigateService,
    } = useAppState();
    const {verificateUser, updateGoogleToken,singUp, logInGoogle} = useAuth();
    const { showSnackbar, SnackbarComponent } = useSnackbar();

    const handleClickRegisterGoogle = async () => {
        setNavigateService(null);
        const result = await signInWithGoogle();
        

        if (result.success) {
            verificateUser(result?.user && result?.user.email || '', (exists,id) => {
                if (exists) {
                    if (result.isNewUser) {
                        const idToken = result.user?.uid || "";

                        const data: UpdateGoogleTokenRequest = {
                            idUsuario: id,
                            googleToken: idToken
                        };
                        updateGoogleToken(data, (success, message) => {
                        if (success) {
                            const data: UpdateGoogleTokenRequest={
                                googleToken: idToken
                                }
                            logInGoogle(data, (success, message) => {
                                if (!success) {
                                    showSnackbar(message ?? "", "error");
                                }else{
                                    setActiveModalOPtion(true);
                                    setActiveModalOPtionSession(false);
                                }
                            },false);
                        } else {
                            showSnackbar(message ?? "Error al actualizar el token", "error");
                        }
                        });

                    }else{
                        const idToken = result.user?.uid || "";
                        const data: UpdateGoogleTokenRequest={
                            googleToken: idToken
                            }
                        logInGoogle(data, (success, message) => {
                            if (!success) {
                                showSnackbar(message ?? "", "error");
                            }else{
                                setActiveModalOPtion(true);
                                setActiveModalOPtionSession(false);
                            }
                        },false);
                    }
                    
                } else {
                    const currentLocation = {
                        idUbigeo: 1392,
                        latitude: 0,
                        longitude: 0,
                        address: null,
                    };

                    const randomPassword = generateRandomPassword();
                    const idToken = result.user && result.user.uid;

                    const newUser: RegisterData = {
                        id: 0,
                        nombres: result?.user && result?.user.name || '',
                        apellidos: '',
                        contacto: '',
                        correo: result?.user && result?.user.email || '',
                        dni: '',
                        password: randomPassword,
                        sexo: "Varón",
                        idUbigeo: currentLocation.idUbigeo,
                        latitud: currentLocation.latitude,
                        longitud: currentLocation.longitude,
                        direccion: currentLocation.address,
                        capacitacionCompleto: 0.0,
                        capacitacionStatus: "no visto",
                        capacitacionEsHabilitado: false,
                        capacitacionTipo: null,
                        googleToken : idToken,
                    };
                        singUp(newUser, (success, message) => {
                        if (!success) {
                            showSnackbar(message ?? "", "error");
                        }else{
                            setActiveModalOPtion(true);
                            setActiveModalOPtionSession(false);
                        }
                    },false);
                }
            });
        } else {
            console.error("Error al autenticar:", result.error);
        }
    };

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const m = searchParams.get("m");
    const d = searchParams.get("d");
    const s = searchParams.get("s");
    const navigate= useNavigate();

    const handleClickRegister = () => {
        navigate("/iniciar")
        if (m && d && s !== null) {
            setNavigateService(`/servicios?m=${m}&d=${d}&s=${s}`);
        } else if (m && d) {
            setNavigateService(`/servicios?m=${m}&d=${d}`);
        } else {
            setNavigateService("/servicios");
        }
        
    };



    return (
        <>
            <CustomModal
                open={modal}
                typeSection={'null'}
                title="¡Queremos saber tu opinión!"
                onClose={() =>{
                    setModal(false); 
                    setNavigateService(null);
                }}
                isPersonalized={true}
            >
                <p className="text-sm sm:text-base text-center text-gray-600 mb-4">
                    Nos encantaría conocer tu opinión. Inicia sesión para publicar tu reseña.
                </p>

                <CustomButton variantType="danger" type="submit" size="medium" onClick={handleClickRegisterGoogle}>
                    <FaGoogle size={20} style={{ marginRight: 8 }} />
                    Iniciar sesión con Google
                </CustomButton>

                <div className="flex items-center my-3">
                    <hr className="flex-grow border-t" />
                    <span className="mx-2 text-sm text-gray-500">ó</span>
                    <hr className="flex-grow border-t" />
                </div>

                <CustomButton variantType="primary" type="submit" size="medium" onClick={handleClickRegister}>
                    Inicia sesión con correo
                </CustomButton>

            </CustomModal>
            <SnackbarComponent />
        </>
    );
};

export default ModalOptionSession;