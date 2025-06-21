

import { useForm } from "react-hook-form";
import CustomButton from "../../ui/CustomButtom";
import CustomInput from "../../ui/CustomInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterData, UpdateGoogleTokenRequest } from "../../../interfaces/auth";
import { useAuth } from "../../../hooks/useAuth";
import useSnackbar from "../../ui/CustomAlert";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import CustomLink from "../../ui/CustomLink";
import { signInWithGoogle } from "../../../utils/auth";
import { generateRandomPassword } from "../../../utils/passwor";

const schema = z.object({
    name: z.string().min(1, "El campo nombre es obligatorio"),
    lastname: z.string().min(1, "El campo apellido es obligatorio"),
    document: z.string().min(8, "El campo documento debe tener al menos 8 dígitos"),
    telephone: z.string().regex(/^9\d{8}$/, "El campo celular debe comenzar con 9 y tener 9 dígitos"),
    email: z.string().email("El campo correo electrónico es inválido"),
    password: z.string().min(6, "El campo contraseña debe tener al menos 6 caracteres"),
});

type RegisterFormValues = z.infer<typeof schema>;

const FormRegister: React.FC = () => {
    const { singUp, verificateUser, updateGoogleToken } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        trigger
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    const { showSnackbar, SnackbarComponent } = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        const currentLocation = {
            idUbigeo: 1392,
            latitude: 0,
            longitude: 0,
            address: null,
        };
        const newUser: RegisterData = {
            id: 0,
            nombres: data.name,
            apellidos: data.lastname,
            contacto: data.telephone,
            correo: data.email,
            dni: data.document,
            password: data.password,
            sexo: "Varón",
            idUbigeo: currentLocation.idUbigeo,
            latitud: currentLocation.latitude,
            longitud: currentLocation.longitude,
            direccion: currentLocation.address,
            capacitacionCompleto: 0.0,
            capacitacionStatus: "no visto",
            capacitacionEsHabilitado: false,
            capacitacionTipo: null,
            googleToken : null,
        };
        await singUp(newUser, (success, message) => {
            setLoading(false);
            if (!success) {
                showSnackbar(message ?? "", "error");
            }
        });
    };

   const handleClickRegisterGoogle = async () => {
        const result = await signInWithGoogle();
        

        if (result.success) {
            verificateUser(result?.user && result?.user.email || '', (exists,id) => {
                if (exists) {
                    showSnackbar("Este correo ya está registrado. Inicia sesión con tu cuenta.", "error");
                    if (result.isNewUser) {
                        const idToken = result.user?.uid || "";

                        const data: UpdateGoogleTokenRequest = {
                            idUsuario: id,
                            googleToken: idToken
                        };
                        updateGoogleToken(data);
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
                        }
                    });
                }
            });
        } else {
            console.error("Error al autenticar:", result.error);
        }
    };

    
    return (
        <div className="py-6 px-4 flex flex-col gap-6">
            <h1 className="text-transparent bg-clip-text text-3xl sm:text-4xl font-bold text-center w-full bg-gradient-custom-primary ">
                Regístrate
            </h1>
            <p className="text-center text-gray-900">
                <strong>Regístrate</strong> y digitaliza tu negocio de comida con Mappi.
            </p>
            <div className="w-full flex flex-col gap-4">
                <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="w-full flex justify-center items-start flex-col gap-4 sm:flex-row">
                        <CustomInput
                            label="Nombres"
                            placeholder="Nombres"
                            errorMessage={errors.name?.message}
                            required
                            {...register("name", { onChange: () => trigger("name") })}
                            value={watch("name") ?? ""}
                        />
                        <CustomInput
                            label="Apellidos"
                            placeholder="Apellidos"
                            errorMessage={errors.lastname?.message}
                            required
                            {...register("lastname", { onChange: () => trigger("lastname") })}
                            value={watch("lastname") ?? ""}
                        />
                    </div>
                    <div className="w-full flex justify-center items-start flex-col gap-4 sm:flex-row">
                        <CustomInput
                            label="Documento DNI"
                            placeholder="Documento DNI"
                            errorMessage={errors.document?.message}
                            required
                            {...register("document", { onChange: () => trigger("document") })}
                            value={watch("document") ?? ""}
                            inputMode="numeric"
                            onKeyDown={(e) => {
                                const input = e.currentTarget as HTMLInputElement;
                                const selectedText = window.getSelection()?.toString() || "";
                                if (e.key === "Backspace" || e.key === "Tab") return;
                                if (selectedText.length > 0) return;
                                if (input?.value?.length >= 8) {
                                    e.preventDefault();
                                    return;
                                }
                                if (!/^\d$/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <CustomInput
                            label="Celular (+51)"
                            placeholder="Celular (+51)"
                            errorMessage={errors.telephone?.message}
                            required
                            {...register("telephone", { onChange: () => trigger("telephone") })}
                            value={watch("telephone") ?? ""}
                            inputMode="numeric"
                            onKeyDown={(e) => {
                                const input = e.currentTarget as HTMLInputElement;
                                const selectedText = window.getSelection()?.toString() || "";
                                if (e.key === "Backspace" || e.key === "Tab") return;
                                if (selectedText.length > 0) return;
                                if (input?.value?.length >= 9) {
                                    e.preventDefault();
                                    return;
                                }
                                if (!/^\d$/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>
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
                        placeholder="Contraseña"
                        errorMessage={errors.password?.message}
                        required
                        {...register("password", { onChange: () => trigger("password") })}
                        value={watch("password") ?? ""}
                        type="password"
                    />
                    <p className=" text-sm text-start text-gray-600 px-2">
                        Al registrarse, aceptas nuestros{" "}
                        <CustomLink href="/terminos-condiciones-de-uso" className="!text-sm">Términos y Condiciones</CustomLink>
                    </p>


                    <div>
                        <CustomButton variantType="primary" type="submit" size="medium" isLoading={loading}>
                            Registrarse
                        </CustomButton>
                    </div>
                </form>
                <div className="flex items-center w-full">
                    <hr className="w-full h-px mx-2 border-gray-500" />
                    <span className="text-gray-900 text-lg">Ó</span>
                    <hr className="w-full h-px mx-2 border-gray-500" />
                </div>
                <CustomButton variantType="danger" type="submit" size="medium" onClick={handleClickRegisterGoogle}>
                    <FaGoogle size={20} style={{ marginRight: 8 }} />
                    Regístrate con Google
                </CustomButton>

                <div className="w-full text-center font-bold flex justify-center items-center space-x-2">
                    <p className="font-normal">¿Ya tienes cuenta?, inicia sesión</p>
                    <CustomLink href="/iniciar">aquí</CustomLink>
                </div>
            </div>

            <SnackbarComponent />
        </div>
    );
};

export default FormRegister;
