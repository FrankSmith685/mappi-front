import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomInput from "../../components/ui/CustomInput";
import { AuthHeader } from "../../components/auth/authHeader";
import CustomButton from "../../components/ui/CustomButtom";
import CustomLink from "../../components/ui/CustomLink";
import useSnackbar from "../../components/ui/CustomAlert";
import { useEffect, useState } from "react";
import { useAppState } from "../../hooks/useAppState";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const schema = z
  .object({
    email: z.string().optional(),
    password: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });


type PasswordFormValues = z.infer<typeof schema>;

const UpdatePasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(schema),
  });
  const {emailRecoverPassword} = useAppState();
  const navigate = useNavigate();
  const {updatePassword} = useAuth();

  console.log(emailRecoverPassword);

  useEffect(() => {
  if (!emailRecoverPassword) {
    navigate("/recuperar");
  }
}, [emailRecoverPassword, navigate]);

  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: PasswordFormValues) => {
  const finalEmail = emailRecoverPassword ?? '';
  setLoading(true);
  await updatePassword(
    { correo: finalEmail, nuevaContrasena: data.password, confirmarNuevaContrasena: data.confirmPassword },
    (success, message) => {
      if (success) {
        navigate("/iniciar");
        setLoading(false);
      } else {
        showSnackbar(message ?? "", "error");
      }
    }
  );
};


  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div className="flex w-full flex-col lg:flex-row justify-start items-center lg:flex-nowrap g-container !px-0 bg-white">
          <AuthHeader />
          <div className="w-full flex items-start lg:items-center justify-center px-3 sm:px-6 py-2 lg:py-5 h-full">
            <div className="max-w-md md:max-w-lg flex flex-wrap justify-center h-auto gap-3">
              <h1 className="text-transparent bg-clip-text text-3xl sm:text-4xl font-bold text-center w-full bg-gradient-custom-primary ">
                Actualiza tu contraseña
              </h1>
              <p className="text-start text-gray-900">Ingresa tu nueva contraseña para continuar.</p>
              <form className="w-full space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                <CustomInput
                    label="Correo electrónico"
                    placeholder="Ingresa tu correo electrónico"
                    errorMessage={errors.email?.message}
                    required
                    disabled
                    value={emailRecoverPassword}
                    {...register("email")}
                />

                <CustomInput
                  label="Nueva contraseña"
                  placeholder="Ingresa tu nueva contraseña"
                  type="password"
                  errorMessage={errors.password?.message}
                  required
                  {...register("password", { onChange: () => trigger("password") })}
                  value={watch("password") ?? ""}
                />
                <CustomInput
                  label="Confirmar nueva contraseña"
                  placeholder="Repite tu nueva contraseña"
                  type="password"
                  errorMessage={errors.confirmPassword?.message}
                  required
                  {...register("confirmPassword", { onChange: () => trigger("confirmPassword") })}
                  value={watch("confirmPassword") ?? ""}
                />
                <CustomButton
                  variantType="primary"
                  type="submit"
                  size="medium"
                  loading={loading}
                >
                  Actualizar contraseña
                </CustomButton>
              </form>
              <div className="w-full text-center">
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
        <SnackbarComponent />
      </div>
    </>
  );
};

export default UpdatePasswordPage;
