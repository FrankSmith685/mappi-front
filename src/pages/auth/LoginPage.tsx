import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomInput from "../../components/ui/CustomInput";
import { AuthHeader } from "../../components/auth/authHeader";
import CustomButton from "../../components/ui/CustomButtom";
import { FaGoogle } from "react-icons/fa";
import CustomLink from "../../components/ui/CustomLink";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import useSnackbar from "../../components/ui/CustomAlert";
import { Footer } from "../../components/common/footer";
import { signInWithGoogle } from "../../utils/auth";
import { UpdateGoogleTokenRequest } from "../../interfaces/auth";
import { useAppState } from "../../hooks/useAppState";

const schema = z.object({
  email: z.string().email("El campo correo electrónico es inválido"),
  password: z.string().min(6, "El campo contraseña debe tener al menos 6 caracteres"),
});


type LoginFormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const {logIn, logInGoogle, verificateUser, updateGoogleToken} = useAuth();
   const { showSnackbar, SnackbarComponent } = useSnackbar();
  const [loading,setLoading]=useState(false);
  const {setEmailRecoverPassword} = useAppState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async(data: LoginFormValues) => {
    setLoading(true);
    await logIn(data, (success, message) => {
      setLoading(false);
      setEmailRecoverPassword(null);
      if (!success) {
          showSnackbar(message ?? "", "error");
      }
    });
  };

  const handleClickLoginGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      setEmailRecoverPassword(null);
      if(result.success){
        verificateUser(result?.user && result?.user.email || '', (exists,id) => {
          if (exists) { // EXISTE EN LA BASE DE DATOS
            if (result.isNewUser) { // SE CREARIA UN NUEVO CORREO EN FIREBASE
              const idToken = result.user?.uid || "";
              const dataUpdate: UpdateGoogleTokenRequest = {
                  idUsuario: id,
                  googleToken: idToken
              };
              updateGoogleToken(dataUpdate,(success)=>{
                if(success){
                  const dataLogInGoogle: UpdateGoogleTokenRequest={
                  googleToken: idToken
                  }
                  logInGoogle(dataLogInGoogle, (success) => {
                    if (!success) {
                        showSnackbar("Error al Iniciar Sesión.", "error");
                    }
                  });
                }
              });

            }else{ // SE LOGUEA DIRECTAMENTE
              const idToken = result.user?.uid || "";
              const dataLogInGoogle: UpdateGoogleTokenRequest={
                googleToken: idToken
                }
                logInGoogle(dataLogInGoogle, (success) => {
                  if (!success) {
                      showSnackbar("Error al Iniciar Sesión.", "error");
                  }
              });
            }
          } else { // NO EXISTE EN LA BASE DE DATOS
            const idToken = result.user?.uid || "";

            if (result.isNewUser) {
              showSnackbar("Este correo de Google no está registrado en nuestro sistema. Solo los usuarios existentes pueden acceder.", "error");
              return;
            }

            const data: UpdateGoogleTokenRequest={
            googleToken: idToken
            }
            logInGoogle(data, (success) => {
              if (!success) {
                  showSnackbar("Este correo de Google no está registrado en nuestro sistema. Solo los usuarios existentes pueden acceder.", "error");
              }
            });
          }
        });
      }
    } catch (error) {
      showSnackbar("Error al verificar el usuario", "error");
      console.error(error);
    }
  };


  return (
    <>
      <div className="w-full flex justify-center items-center">
          <div className="flex w-full flex-col lg:flex-row justify-start items-center lg:flex-nowrap g-container !px-0 bg-white">
              <AuthHeader/>
              <div className="w-full flex items-center lg:items-center justify-center px-3 sm:px-6 py-2 lg:py-5 h-full flex-col">
                  <div className="max-w-md md:max-w-lg flex flex-wrap justify-center items-center h-auto gap-3">
                      <h1 className="text-transparent bg-clip-text text-3xl sm:text-4xl font-bold text-center w-full bg-gradient-custom-primary ">
                          Iniciar Sesión
                      </h1>
                      <p className="text-center text-gray-900">Inicia sesión para disfrutar los beneficios que tiene Mappi para tu negocio de comida</p>
                      <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                          <CustomInput
                              label="Correo Electrónico"
                              placeholder="Correo Electrónico"
                              errorMessage={errors.email?.message}
                              required
                              {...register("email", { onChange: () => trigger("email") })}
                              value={watch("email") ?? ""}
                          />

                          <CustomInput
                              label="Contraseña"
                              type="password"
                              required
                              placeholder="Contraseña"
                              errorMessage={errors.password?.message}
                              {...register("password", { onChange: () => trigger("password") })}
                              value={watch("password") ?? ""}
                          />
                          <CustomButton variantType="primary" type="submit" size="medium" isLoading={loading}>
                              Iniciar Sesión
                          </CustomButton>

                      </form>

                  <div className="flex items-center w-full">
                      <hr className="w-full h-px mx-2 border-gray-500" />
                      <span className="text-gray-900 text-lg">Ó</span>
                      <hr className="w-full h-px mx-2 border-gray-500" />
                  </div>
                  <CustomButton variantType="danger" type="submit" size="medium" onClick={handleClickLoginGoogle} >
                      <FaGoogle size={20} style={{ marginRight: 8 }} />
                      Iniciar Sesión con Google
                  </CustomButton>

                  <div className="w-full text-center">
                      <CustomLink href="/recuperar">¿Olvidaste tu contraseña?</CustomLink>
                  </div>

                  <div className="w-full text-center ">
                      <div className="text-sm sm:text-[17px] flex justify-center items-center">
                      ¿No tienes una cuenta?
                      <div className="ml-2 !font-bold">
                          <CustomLink href="/registro">Regístrate</CustomLink>
                      </div>
                      </div>
                  </div>
                </div>
              </div>
              
            </div>
            
            <SnackbarComponent/>
      </div>
      <div className="w-full bg-white pt-6 lg:hidden">
        <Footer/>
      </div> 
    </>
  );
};

export default LoginPage;
