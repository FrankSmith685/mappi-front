import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomInput from "../../components/ui/CustomInput";
import { AuthHeader } from "../../components/auth/authHeader";
import CustomButton from "../../components/ui/CustomButtom";
import CustomLink from "../../components/ui/CustomLink";
import { useAuth } from "../../hooks/useAuth";
import useSnackbar from "../../components/ui/CustomAlert";
import { useState } from "react";
import CustomModal from "../../components/ui/CustomModal";
import { useAppState } from "../../hooks/useAppState";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("El campo correo electrónico es inválido"),
  password: z.string().min(6, "El campo contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof schema>;

const ForgotPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  const {sendCodeEmail, validateCodeEmail} = useAuth();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const [loading,setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const {setEmailRecoverPassword} = useAppState();
  const navigate = useNavigate();

  const onSubmit = async() => {
    const emailValue = watch("email");
      setLoading(true);
      sendCodeEmail({correo: emailValue}, (success, message) => {
      if (success) {
        showSnackbar(message ?? "", "success");
        setLoading(false);
        setShowModal(true);
      } else {
        showSnackbar(message ?? "", "error");
        setLoading(false);
      }
    });
  };

 

 const handleCodeSubmit = async () => {
  if (code.trim().length !== 6 || !/^\d{6}$/.test(code)) {
    setCodeError("El código debe tener 6 dígitos numéricos");
    return;
  }

  setCodeError("");
  const emailValue = watch("email");

  await validateCodeEmail(
    { correo: emailValue, codigo: code },
    (success, message) => {
      if (success) {
        setEmailRecoverPassword(emailValue || "");
        showSnackbar(message ?? "Código válido", "success");
        navigate("/actualizar-contrasena");
        setShowModal(false);
      } else {
        showSnackbar(message ?? "Código inválido o expirado", "error");
      }
    }
  );
};


  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div className="flex w-full flex-col lg:flex-row justify-start items-center lg:flex-nowrap g-container !px-0 bg-white">
          <AuthHeader/>
          <div className="w-full flex items-start lg:items-center justify-center px-3 sm:px-6 py-2 lg:py-5 h-full">
              <div className="max-w-md md:max-w-lg flex flex-wrap justify-center h-auto gap-3">
                  <h1 className="text-transparent bg-clip-text text-3xl sm:text-4xl font-bold text-center w-full bg-gradient-custom-primary ">
                      Recupera tu contraseña
                  </h1>
                  <p className="text-center text-gray-900">¡Recupera tu contraseña y vuelve a publicar tus anuncios en Mappi!</p>
                  <form className="w-full space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                      <CustomInput
                        label="Ingresa tu correo electrónico"
                        placeholder="Ingresa tu correo electrónico"
                        errorMessage={errors.email?.message}
                        required
                        {...register("email", { onChange: () => trigger("email") })}
                        value={watch("email") ?? ""}
                      />

                      <CustomButton variantType="primary" type="submit" size="medium" onClick={onSubmit} loading={loading}>Recuperar contraseña</CustomButton>
                  </form>
                  <div className="w-full text-center ">
                      <div className="text-sm sm:text-[17px] flex justify-center items-center">
                      ¿Recordaste tu contraseña?
                      <div className="ml-2 !font-bold">
                          <CustomLink href="/iniciar">Iniciar Sesión</CustomLink>
                      </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        <SnackbarComponent/>
      </div>
      {showModal && (
        <CustomModal
          open={showModal}
          typeSection={'null'}
          title={'Ingresa el código'}
          onClose={()=>setShowModal(false)}
          onContinue={handleCodeSubmit}
          continueText={"Continuar"}
        >
          <div className="w-full flex flex-col gap-4">
            <p className="w-full text-base text-start text-gray-500">Revisa tu correo electrónico e ingresa el código de 6 dígitos</p>
            <div className="flex flex-col items-center justify-center gap-4 text-gray-900 text-center w-full">
              <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="w-full">
                      <CustomInput
                        name="code"
                        label="Código de verificación"
                        placeholder="Ej: 123456"
                        errorMessage={codeError}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        // maxLength={6}
                        inputProps={{ maxLength: 6 }}
                        required
                      />
                  </div>
              </form>
            </div>
          </div>
          </CustomModal>
      )}

    </>
  );
};

export default ForgotPage;
