/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import CustomModal from "../../../../ui/CustomModal";
import { useAppState } from "../../../../../hooks/useAppState";
import CustomInput from "../../../../ui/CustomInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import CustomSelect from "../../../../ui/CustomSelect";
import CustomDate from "../../../../ui/CustomDate";
import { User } from "../../../../../interfaces/user";
import { SelectChangeEvent } from "@mui/material";
import { useGeocoder } from "../../../../../hooks/useGeocoder";
import CustomButton from "../../../../ui/CustomButtom";
import { FaImage, FaSpinner, FaTimes, FaUserCircle } from "react-icons/fa";
import CustomImage from "../../../../ui/CustomImage";
import { useUser } from "../../../../../hooks/useUser";
import { useCompany } from "../../../../../hooks/useCompany";
import { useServices } from "../../../../../hooks/useServices";
import { Service } from "../../../../../interfaces/service";

const ModalPersonalInfo: React.FC = () => {
    type ProfileFormValues = z.infer<typeof schema>;
    const { 
        modal, 
        setModal, 
        servicePublishStep, 
        modifiedUser, 
        departmentsAll, 
        setServicePublishStep,
        setModifiedUser,
        districtsAll,
        user,
        setCurrentLocationAux,
        currentLocationAux,
        servicePublishType,
        serviceList,
        company,
        setModifiedCompany,
        modifiedCompany,
        setArchiveByUser,
        archiveByUser,
        service,
        setModifiedService,
        modifiedService,
        setService,
        setCompany,
        setUser,
        setDeleteIdsArchive,
        deleteIdsArchive,
        setArchiveByService,
        setServiceList,
        setMovieService,
        setLetterService

    } = useAppState();
    const {getGeocoder} = useGeocoder();
    const logoInputRef = useRef<HTMLInputElement | null>(null);
    const portadaInputRef = useRef<HTMLInputElement | null>(null);
    const {getUser} = useUser();
    const {getCompany} = useCompany();
    const {getServiceId} = useServices();

    const schema = z.object({
        name: z.string().min(1, "El campo nombre es obligatorio"),
        lastname: z.string().min(1, "El campo apellido es obligatorio"),
        gender: z.enum(["Varón", "Mujer"]),
        birthdate: z
        .string()
        .min(1, "La fecha de nacimiento es obligatoria")
        .refine((date) => {
            const selectedDate = new Date(date);
            const today = new Date();
            const minAgeDate = new Date();
            minAgeDate.setFullYear(today.getFullYear() - 18);
            return selectedDate <= minAgeDate;
        }, {
            message: "Debes ser mayor de 18 años",
        }),
        telephone: z.string().regex(/^9\d{8}$/, "El campo celular debe comenzar con 9 y tener 9 dígitos"),
        country: z.enum(["Perú"]),
        city: z.number(),
    });

    const { register, handleSubmit, formState: { errors }, reset, watch, trigger,control, getValues } = useForm<ProfileFormValues>({
          resolver: zodResolver(schema),
          mode: "onChange",
    });


    const defaultBirthdate = new Date();
    defaultBirthdate.setFullYear(defaultBirthdate.getFullYear() - 18);
    const formattedDate = defaultBirthdate.toISOString().split("T")[0];

    const [formInitialized, setFormInitialized] = React.useState(false);

    useEffect(() => {
        if ((modifiedUser && !formInitialized )|| (currentLocationAux && !formInitialized)|| (modifiedService  && !formInitialized)) {
            const formatDate = (dateString: string | null | undefined) => {
                if (!dateString) return "";
            
                const date = new Date(dateString);
                if (!isNaN(date.getTime())) {
                    return date.toISOString().split("T")[0];
                }
            
                return "";
            };
        reset({
            name: modifiedUser?.nombres || "",
            lastname: modifiedUser?.apellidos || "",
            gender: modifiedUser?.sexo || "Varón",
            birthdate: formatDate(modifiedUser?.fecNacimiento) || formattedDate,
            telephone: modifiedUser?.contacto || "",
            country: "Perú",
            city: modifiedService ? Number(currentLocationAux?.department.value) : modifiedUser?.idUbigeo,
        });
        }
    }, [modifiedUser, reset, formInitialized,currentLocationAux,service,modifiedService]);
    const [isLoadingImagen,setIsLoadingImagen] = useState(false);
    
    const onReturn = () => {
        setServicePublishStep("typeSelection");
        resetLocation();
    }

    const onSubmit = (data : ProfileFormValues) => {
        const formattedData = {
            nombres: data.name,
            apellidos: data.lastname,
            sexo: data.gender,
            fecNacimiento: data.birthdate,
            contacto: data.telephone,
            idUbigeo: data.city,
        };
        setModifiedUser({
            ...modifiedUser as User,
            ...formattedData as User
        })
        if(servicePublishType === "business"){
            setServicePublishStep("businessInfo");
        }else{
            setServicePublishStep("serviceInfo");
        }
    };

    const handleChangeCiudad=(value:string)=>{
        const dataUser = getValues();
        const departmentsAllAux = departmentsAll.find((department)=>department.id === parseInt(value));
        const districtsAllAux =  districtsAll.find((district)=>district.idPadre === departmentsAllAux?.id );
        const districtbydepartment = districtsAll.filter((district) => district.idPadre == departmentsAllAux?.id);
        const address = departmentsAllAux?.nombre + ", " + districtsAllAux?.nombre;
        getGeocoder(undefined,undefined,address,(data=>{
            const fomattedDataLocation = {
                idUbigeo: departmentsAllAux?.id,
                latitud: data.latitude ?? null,
                longitud: data.longitude ?? 0,
                direccion: address ?? null,
                ciudad: departmentsAllAux?.nombre ?? null
            }

            const fomattedDataUser = {
                nombres: dataUser.name,
                apellidos: dataUser.lastname,
                sexo: dataUser.gender,
                fecNacimiento: dataUser.birthdate,
                contacto: dataUser.telephone,
            }

            setModifiedUser({
                ...modifiedUser,
                ...fomattedDataUser,
                ...fomattedDataLocation
            });
            setCurrentLocationAux({
                idUbigeo: departmentsAllAux?.id?.toString() ?? "",
                department: { value: departmentsAllAux?.id ?? 0, label: departmentsAllAux?.nombre?? "", quantity: departmentsAllAux?.cantidad ?? 0 },
                district:{ value: districtsAllAux?.id ?? 0, label: districtsAllAux?.nombre?? "", quantity: districtsAllAux?.cantidad ?? 0 },
                latitude:data.latitude,
                longitude:data.longitude,
                address:address,
                districtbydepartment:districtbydepartment
            })
            
            if(servicePublishType === "business"){
                const fomattedDataLocations = {
                    idUbigeo:districtsAllAux?.id,
                    latitud: data.latitude,
                    longitud: data.longitude,
                    direccion: address
                };
                setModifiedCompany({
                ...modifiedCompany,
                ...fomattedDataLocations,
                })
            }
            if(modifiedService){
                const fomattedDataLocations = {
                    idUbigeo:districtsAllAux?.id,
                    latitud: data.latitude,
                    longitud: data.longitude,
                    address: address
                };
                setModifiedService({
                    ...modifiedService,
                    ...fomattedDataLocations,
                })
            }
        }));
    }

    const ResetClose=()=>{
        setModal(false);
        resetLocation();
        setFormInitialized(false);
    }

    const resetLocation=()=>{
        if(!service){
            setFormInitialized(false)
            const storedLocation = localStorage.getItem("currentLocation");
            if (storedLocation) {
                const parsed = JSON.parse(storedLocation);
                const fomattedDataLocation = {
                    idUbigeo: parsed.idUbigeo ? parseInt(parsed.idUbigeo) : 1392,
                    latitud: parsed.latitude ?? null,
                    longitud: parsed.longitude ?? 0,
                    direccion: parsed.address ?? null,
                    ciudad: parsed.department?.label ?? null
                }
                setModifiedUser({
                    ...user,
                    ...fomattedDataLocation
                    }
                );
        
                setCurrentLocationAux(parsed);
                if(!company){
                    if(servicePublishType=="business"){
                        const fomattedDataLocation = {
                            idUbigeo:parsed?.district.value,
                            latitud: parsed.latitude ?? 0,
                            longitud: parsed.longitude ?? 0,
                            direccion: parsed.address ?? null,
                        };
                        setModifiedCompany({
                            ...fomattedDataLocation,
                        })
                    }
                }
                if(servicePublishType=="business"){
                    setArchiveByUser({
                        ...archiveByUser,
                        company: {
                            portada: null,
                            logo:null,
                            isLoading:true
                        },
                    });
                }else{
                    if(user?.planes && user?.planes?.length == 0){
                        setArchiveByUser({
                            ...archiveByUser,
                            independent: {
                                portada: null,
                                logo:null,
                                isLoading:true
                            },
                        });
                    }
                }

                setArchiveByService({
                    service:[],
                    id:0,
                    isLoading:true
                })
                setMovieService(null);

                setLetterService(null);

                if(!service){
                    const fomattedDataLocation = {
                        idUbigeo:parsed?.district.value,
                        latitud: parsed.latitude ?? 0,
                        longitud: parsed.longitude ?? 0,
                        address: parsed.address ?? null,
                        horario: "00:00 - 01:00",
                        tieneDelivery:false,
                    };
                    setModifiedService({
                        ...fomattedDataLocation,
                    })
                }
            }
        }else{
            setFormInitialized(false)
            setIsLoadingImagen(true);
            const district = districtsAll.find((d)=>d.id === service?.idUbigeo);
            const department = departmentsAll.find((d) => d.id === district?.idPadre)
            const districtsAllAux = districtsAll.filter((d)=>d.idPadre === department?.id);
            const fomattedDataLocationAux = {
                idUbigeo: department?.id?.toString() ?? "0",
                department: {
                  value: department?.id ?? 0,
                  label: department?.nombre ?? "",
                  quantity: department?.cantidad ?? 0,
                },
                district: {
                  value: district?.id ?? 0,
                  label: district?.nombre ?? "",
                  quantity: district?.cantidad ?? 0,
                },
                latitude: service?.latitud ?? 0,
                longitude: service?.longitud ?? 0,
                address: service?.direccion ?? "",
                districtbydepartment: districtsAllAux,
              };
        
            setCurrentLocationAux(fomattedDataLocationAux);
            setModifiedUser(user);
            if(company){
                setModifiedCompany(company);
            }
            setService(null);
            setModifiedService(null);
            if(servicePublishType === "independiente"){
                getUser((data) => {
                    setUser({
                        ...user,
                        imgPerfil: data.imgPerfil,
                        imgPortada: data.imgPortada
                    })
                });
                setIsLoadingImagen(false);
            }else{
                getCompany((data) => {
                    setCompany({
                        ...company,
                        idLogo:data.idLogo,
                        idPortada:data.idPortada
                    })
                });
                setIsLoadingImagen(false);
            }
            getServiceId(Number(service?.id), (success, data) => {
                if (success) {
                    const updatedList = serviceList?.map(s =>
                        s.id === service?.id
                            ? {
                                ...s,
                                idPromocion: data?.idPromociones,
                                idVideoPromocion: data?.idVideoPromocion,
                                idPdfCarta: data?.idPdfCarta,
                            }
                            : s
                    );
                    setServiceList(updatedList as Service[]);
                }
            });
        }
    }

    // IMAGENES
    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () =>{
                setArchiveByUser({
                    ...archiveByUser,
                        independent: {
                        ...archiveByUser?.independent,
                        logo:{
                            base64:reader.result as string,
                            name: file.name,
                        },
                        isLoading:true
                    },
                });
            }   
          reader.readAsDataURL(file);
        }
    };
      
    const handlePortadaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () =>{
            setArchiveByUser({
                ...archiveByUser,
                independent: {
                    ...archiveByUser?.independent,
                    portada:{
                            base64:reader.result as string,
                            name: file.name
                        },
                    isLoading:true 
                }
            });
          }
          reader.readAsDataURL(file);
        }
    };

    const handleClickDeleteLogo=()=>{
        if(archiveByUser?.independent?.isLoading){
            const selectedLogo = archiveByUser?.independent?.logo?.base64;
            if (selectedLogo) {
                const match = selectedLogo.match(/usua_(\d+)$/);
                if (match) {
                  const userId = match[1];
                  setDeleteIdsArchive({
                    ...deleteIdsArchive,
                    independent:{
                        ...deleteIdsArchive?.independent,
                        logo:Number(userId),
                    } 
                })
                }
              }
        }else{
            getUser((data) => {
                setDeleteIdsArchive({
                    ...deleteIdsArchive,
                    independent:{
                        ...deleteIdsArchive?.independent,
                        logo:data.imgPerfil,
                    } 
                })
            });
        }

        setArchiveByUser({
            ...archiveByUser,
            independent: {
                ...archiveByUser?.independent,
                logo: null,
                isLoading:true
            },
        });
        if (logoInputRef.current) {
            logoInputRef.current.value = "";
        }
        
    }

    const handleClickDeletePortada=()=>{
        if(archiveByUser?.independent?.portada?.isLoading){
            const selectedPortada = archiveByUser?.independent?.portada?.base64;
            if (selectedPortada) {
                const match = selectedPortada.match(/usua_(\d+)$/);
                if (match) {
                  const userId = match[1];
                  setDeleteIdsArchive({
                    ...deleteIdsArchive,
                    independent:{
                        ...deleteIdsArchive?.independent,
                        portada:Number(userId),
                    } 
                })
                }
              }
        }else{
            getUser((data) => {
                setDeleteIdsArchive({
                    ...deleteIdsArchive,
                    independent:{
                        ...deleteIdsArchive?.independent,
                        portada:data.imgPortada,
                    } 
                })
            });
        }

        setArchiveByUser({
            ...archiveByUser,
            independent: {
                ...archiveByUser?.independent,
                portada: null,
                isLoading:true
            },
        });
        if (logoInputRef.current) {
            logoInputRef.current.value = "";
        }
    }

    return (
    <CustomModal
      open={modal}
      isEdit={service ? true : false}
      typeSection={ user?.planes && user?.planes?.length == 0 && (service == null && serviceList?.length == 0) ? servicePublishStep : "null"}
      title={service ? 'Editar Datos Personales' : 'Registrar Datos Personales'}
      onReturn={onReturn}
      onClose={ResetClose}
      onContinue={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-gray-900 text-center w-full">
        <h2 className="text-gray-900 text-lg font-medium text-start w-full">Datos personales</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Nombre y Apellido */}
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
            {/* Género y Fecha de Nacimiento */}
            <div className="w-full flex justify-center items-start flex-col gap-4 sm:flex-row">
                <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label="Género"
                            name={field.name}
                            value={field.value}
                            onChange={(event) => field.onChange(event.target.value)}
                            options={[
                                { value: "Varón", label: "Varón" },
                                { value: "Mujer", label: "Mujer" },
                            ]}
                            errorMessage={errors.gender?.message}
                            className="text-left"
                        />
                    )}
                />
               <Controller
                    name="birthdate"
                    control={control}
                    render={({ field }) => (
                        <CustomDate
                            label="Fecha de nacimiento"
                            name={field.name}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            errorMessage={errors.birthdate?.message}
                            maxDate={18}
                        />
                    )}
                />

            </div>
            {/* Celular */}
            <div className="w-full">
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
            {/* País y Ciudad */}
            <div className="w-full flex justify-center items-start flex-col gap-4 sm:flex-row">
                <Controller
                    name="country"
                    disabled
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label="País"
                            name={field.name}
                            value={field.value}
                            onChange={(event) => field.onChange(event.target.value)}
                            options={[
                                { value: "Perú", label: "Perú" },
                            ]}
                            errorMessage={errors.country?.message}
                            className="text-left"
                            disabled
                        />
                    )}
                />
                <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label="Ciudad"
                            name={field.name}
                            value={field.value}
                            onChange={(event: SelectChangeEvent<unknown>) => {
                                const value = event.target.value as string;
                                field.onChange(value);
                                handleChangeCiudad(value);
                            }}                                                   
                            options={departmentsAll?.map((dept) => ({
                                value: dept.id,
                                label: dept.nombre,
                            })) || []}
                            errorMessage={errors.city?.message}
                            className="text-left"
                        />
                    )}
                />
            </div>
            {/* Logo y Portada */}
            <div className={`${servicePublishType === "business" ? 'hidden' : ''} w-full flex justify-center items-start flex-col gap-4 sm:flex-row`}>
                {/* Subir Logo */}
                <div className="flex flex-col items-center gap-3 w-full md:w-1/2">
                    <CustomButton
                        variantType="terciary"
                        type="button"
                        size="medium"
                        isLoading={false}
                        className="!normal-case relative z-10 flex items-center gap-2"
                    >
                        <FaUserCircle className="text-lg" />
                        Subir Logo
                        <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            ref={logoInputRef}
                            onChange={handleLogoUpload}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                    </CustomButton>
                    <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 shadow-inner hover:shadow-md transition">
                        {
                            isLoadingImagen ? (
                                <div className="flex justify-center items-center w-full h-full">
                                    <FaSpinner className="animate-spin text-gray-500 text-3xl" />
                                </div>
                            ) : (
                                <>
                                    {archiveByUser?.independent?.logo?.base64 ? (
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <img
                                                src={archiveByUser?.independent?.logo?.base64}
                                                alt="Logo Preview"
                                                className="object-contain h-full max-w-full"
                                            />
                                            <button
                                                onClick={handleClickDeleteLogo}
                                                className="absolute top-2 right-2 bg-white text-gray-600 cursor-pointer hover:text-red-800 rounded-full p-1 shadow-md transition"
                                            >
                                                <FaTimes className="text-sm"/>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400">
                                            <CustomImage
                                                name={`no_photo_01`}
                                                alt="no_photo_01"
                                                className={`cursor-pointer w-28 h-28'}`}
                                            />
                                            <p className="text-sm">Vista previa del logo</p>
                                        </div>
                                    )}
                                </>
                            )
                        }
                    </div>
                </div>

                {/* Subir Portada */}
                <div className="flex flex-col items-center gap-3 w-full md:w-1/2">
                    <CustomButton
                        variantType="terciary"
                        type="button"
                        size="medium"
                        isLoading={false}
                        className="!normal-case relative z-10 flex items-center gap-2"
                        >
                        <FaImage className="text-lg" />
                        Subir Portada
                        <input
                            id="logo-upload"
                            type="file"
                            ref={portadaInputRef}
                            accept="image/*"
                            onChange={handlePortadaUpload}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                    </CustomButton>
                    <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 shadow-inner hover:shadow-md transition">
                        {
                            isLoadingImagen ? (
                                <>
                                    Cargando...
                                </>
                            ):(
                                <>
                                    {archiveByUser?.independent?.portada?.base64 ? (
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            
                                                <img
                                                    src={archiveByUser?.independent?.portada.base64}
                                                    alt="Logo Preview"
                                                    className="object-contain h-full max-w-full"
                                                />
                                            
                                                <button
                                                    onClick={handleClickDeletePortada}
                                                    className="absolute top-2 right-2 bg-white text-gray-600 cursor-pointer hover:text-red-800 rounded-full p-1 shadow-md transition"
                                                >
                                                    <FaTimes className="text-sm"/>
                                                </button>
                                            </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400">
                                            <CustomImage
                                                name={`no_photo_01`}
                                                alt="no_photo_01"
                                                className={`cursor-pointer w-28 h-28'}`}
                                            />
                                            <p className="text-sm">Vista previa de la portada</p>
                                        </div>
                                    )}
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </form>
      </div>
    </CustomModal>
  );
};

export default ModalPersonalInfo;