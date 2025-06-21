import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import CustomInput from "../../../ui/CustomInput";
import CustomButton from "../../../ui/CustomButtom";
import useSnackbar from "../../../ui/CustomAlert";
import { useAppState } from "../../../../hooks/useAppState";
import { useUser } from "../../../../hooks/useUser";
import { User } from "../../../../interfaces/user";

const schema = z.object({
    name: z.string().min(1, "El campo nombre es obligatorio"),
    lastname: z.string().min(1, "El campo apellido es obligatorio"),
    document: z.string().min(8, "El campo documento debe tener al menos 8 dígitos"),
    telephone: z.string().regex(/^9\d{8}$/, "El campo celular debe comenzar con 9 y tener 9 dígitos"),
    email: z.string().email("El campo correo electrónico es inválido"),
});

type ProfileFormValues = z.infer<typeof schema>;

const UpdateProfileForm: React.FC = () => {
    const { user } = useAppState();
    const { showSnackbar, SnackbarComponent } = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);
    const {updateUser} = useUser();

    const { register, handleSubmit, formState: { errors }, reset, watch, trigger } = useForm<ProfileFormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.nombres || "",
                lastname: user.apellidos || "",
                document: user.dni || "",
                telephone: user.contacto || "",
                email: user.correo || "",
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: ProfileFormValues) => {
        setLoading(true);
        const currentUser: User = {
            nombres: data.name,
            apellidos: data.lastname,
            contacto: data.telephone,
            correo: data.email,
            dni: data.document
        };
        await updateUser(currentUser, (success, message) => {
            setLoading(false);
            if (!success) {
                showSnackbar(message ?? "", "error");
            }else{
                showSnackbar("Perfil actualizado correctamente", "success");
                
            }
        });
    };


    return (
        <div className="py-6 px-4 flex flex-col gap-6 w-full max-w-[85%] sm:max-w-[70%]">
            <h1 className="text-transparent bg-clip-text text-3xl sm:text-4xl font-bold text-center w-full bg-gradient-custom-primary">
                Mi Perfil
            </h1>
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
                    value={watch("email")?? ""}
                />
                <div>
                    <CustomButton variantType="primary" type="submit" size="medium" isLoading={loading}>
                        Guardar Cambios
                    </CustomButton>
                </div>
            </form>
            <SnackbarComponent />
        </div>
    );
};

export default UpdateProfileForm;
