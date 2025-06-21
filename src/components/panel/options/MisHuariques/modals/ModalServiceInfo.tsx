/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import CustomModal from "../../../../ui/CustomModal";
import { useAppState } from "../../../../../hooks/useAppState";
import CustomInput from "../../../../ui/CustomInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import CustomSelect from "../../../../ui/CustomSelect";
import { SelectChangeEvent } from "@mui/material";
import CustomButton from "../../../../ui/CustomButtom";
import CustomImage from "../../../../ui/CustomImage";
import { FaFilePdf, FaTimes, FaUtensils, FaVideo } from "react-icons/fa";
import { useCompany } from "../../../../../hooks/useCompany";
import { useUser } from "../../../../../hooks/useUser";
import useSnackbar from "../../../../ui/CustomAlert";
import { useServices } from "../../../../../hooks/useServices";
import { Service } from "../../../../../interfaces/service";

const ModalServiceInfo: React.FC = () => {
    type ProfileFormValues = z.infer<typeof schema>;
    const { 
        modal, 
        setModal, 
        servicePublishStep,
        setServicePublishStep,
        setModifiedUser,
        user,
        setCurrentLocationAux,
        subCategory,
        modifiedService,
        setModifiedCompany,
        company,
        setArchiveByUser,
        archiveByUser,
        servicePublishType,
        setModifiedService,
        service,
        districtsAll,
        departmentsAll,
        setService,
        setCompany,
        setUser,
        setDeleteIdsArchive,
        deleteIdsArchive,
        setArchiveByService,
        archiveByService,
        serviceList,
        setServiceList,
        setMovieService,
        movieService,
        setDeleteMovieService,
        setLetterService,
        letterService,
        setDeleteLetterService,
    } = useAppState();

    const schema = z.object({
        nameService: z.string().min(1, "El campo nombre de tu huarique es obligatorio"),
        category: z.string().min(1,"El campo categoría es obligatorio"),
        schedule:z.string(),
        horaInicio: z.string(),
        horaFinal: z.string(),
        tieneDevilery: z.boolean(),
        description:z.string().min(1, "El campo descripción es obligatorio"),
    });

    const { register, handleSubmit, formState: { errors }, reset, watch, trigger,control,setValue,getValues } = useForm<ProfileFormValues>({
          resolver: zodResolver(schema),
          mode: "onChange",
          defaultValues: {
            horaInicio: "00:00",
            horaFinal: "01:00"
        }
    });


    const [formInitialized, setFormInitialized] = useState(false);
    const {getCompany} = useCompany();
    const {getUser} = useUser();
    const {getServiceId} = useServices();

    const { showSnackbar, SnackbarComponent } = useSnackbar();

    const horaOptions = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, "0");
        return { value: `${hour}:00`, label: `${hour}:00` };
    });
    useEffect(() => {
        const subCategoryId = subCategory.find(subC => subC.nombre == modifiedService?.nombre);

        if (modifiedService && !formInitialized) {
            const [horaInicioValue, horaFinalValue] = modifiedService?.horario?.split(" - ") || ["00:00", "01:00"];
            reset({
                nameService: modifiedService?.nombreServicio || "",
                category: service ? subCategoryId?.id?.toString()  : modifiedService?.idCategoria?.toString() || "",
                schedule: modifiedService?.horario ? "D" : "L",
                horaInicio: service?.horario == "" ? '' : horaInicioValue,
                horaFinal: service?.horario == "" ? '' : horaFinalValue,
                tieneDevilery: modifiedService.tieneDelivery,
                description: modifiedService.descripcion || "",
            });
            setFormInitialized(true);
        }
    }, [modifiedService, reset,formInitialized]);

    const handleScheduleChange = (newSchedule: string) => {
        const data = getValues();
        const formattedData = {
            nombreServicio: data.nameService,
            idCategoria: Number(data.category),
            tieneDelivery: data.tieneDevilery,
            descripcion: data.description,
        };
        if (newSchedule === "L") {
            setModifiedService({
                ...modifiedService,
                ...formattedData,
                horario: "",
            })
        } else {
            const horaInicioValue = watch("horaInicio");
            const horaFinalValue = watch("horaFinal");
            setModifiedService({
                ...modifiedService,
                ...formattedData,
                horario: `${horaInicioValue} - ${horaFinalValue}`,
            })
        }
    };
    
    const onReturn = () => {
        const data = getValues();
        // const subCategoryId = subCategory.find(subC => subC.nombre == modifiedService?.nombre);
        const subCategoryId = subCategory.find(subC => subC.id == Number(data?.category));
        const formattedData = {
            nombreServicio: data.nameService,
            nombre: subCategoryId?.nombre,
            // idCategoria: service ? subCategoryId?.id :Number(data.category),
            idCategoria: Number(data.category) ? Number(data.category) : undefined,
            tieneDelivery: data.tieneDevilery,
            descripcion: data.description,
        };
        setModifiedService({
            ...modifiedService,
            ...formattedData,
        });
        if(servicePublishType == "business"){
            setServicePublishStep("businessInfo");
        }else{
            setServicePublishStep("personalInfo");
        }
    }

    const onSubmit = async (data: ProfileFormValues) => {
        const isValid = await trigger();
        if (isValid) {
            const subCategoryId = subCategory.find(subC => subC.id == Number(data?.category));
            const formattedData = {
                nombreServicio: data.nameService,
                idCategoria: Number(data.category),
                nombre: subCategoryId?.nombre,
                tieneDelivery: data.tieneDevilery,
                descripcion: data.description,
            };
            setModifiedService({
                ...modifiedService,
                ...formattedData,
                
            })
            setServicePublishStep("serviceLocation");
        } else {
            console.log("Formulario no válido");
        }
    };

    const ResetClose=()=>{
        setModal(false);
        resetLocation();
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
                if(servicePublishType=="business"){
                    setArchiveByUser({
                        ...archiveByUser,
                        company: {
                        portada: null,
                        logo:null,
                        isLoading:true
                        }
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
            setModifiedUser(user);
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
            }else{
                getCompany((data) => {
                    setCompany({
                        ...company,
                        idLogo:data.idLogo,
                        idPortada:data.idPortada
                    })
                });
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

    const horaInicio = watch("horaInicio");
    const horaFinal = watch("horaFinal");

    useEffect(() => {
        if (horaInicio && horaFinal) {
            const [startHour] = horaInicio.split(":").map(Number);
            const [endHour] = horaFinal.split(":").map(Number);

            if (endHour <= startHour) {
                const newEndHour = (startHour + 1) % 24;
                const formatted = `${newEndHour.toString().padStart(2, "0")}:00`;
                setValue("horaFinal", formatted);
            }
        }
    }, [horaInicio, horaFinal, setValue]);

    const serviceInputRef = useRef<HTMLInputElement | null>(null);
    const handleServiceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const planActivo = user?.planes?.[0];
        const planNombre = planActivo?.nombre || null;
        const planEstado = planActivo?.estado || null;
    
        // Verificar cuántas promociones ya hay
        const currentServices = archiveByService?.service || [];
    
        // Definir límite según plan
        let maxPromociones = 1;
        let planTipo = "sinPlan"; // gratis o sin plan activo
    
        if (planActivo && planEstado === "Activo") {
            planTipo = "conPlan";
            switch (planNombre) {
                case "Clásico":
                    maxPromociones = 2;
                    break;
                case "Chévere":
                    maxPromociones = 3;
                    break;
                default:
                    maxPromociones = 1;
                    break;
            }
        }
        // Validar límite según tipo de usuario
        if (currentServices.length >= maxPromociones) {
            if (planTipo === "sinPlan") {
                showSnackbar(
                    "Solo puedes subir 1 promoción si no tienes un plan activo. Actualiza tu plan para más beneficios.",
                    "warning"
                );
            } else {
                showSnackbar(
                    `Tu plan (${planNombre}) permite un máximo de ${maxPromociones} promoción${maxPromociones > 1 ? "es" : ""}.`,
                    "warning"
                );
            }
            return;
        }
    
        // Leer y guardar imagen si pasa validación
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageData = reader.result as string;
            setArchiveByService({
                ...archiveByService,
                service:[
                    ...currentServices,
                    {
                        base64: imageData,
                        name: file.name,
                    },
                ],
                isLoading:true
            })
        };
        reader.readAsDataURL(file);
    };
    
    

    const [promocionesIds, setPromocionesIds] = useState<number[]>([]);

    useEffect(() => {
        if(service){
            getServiceId(Number(service?.id), (success, data) => {
                if (success) {
                const ids = data?.idPromociones?.split(',').map(id => Number(id)) || [];
                setPromocionesIds(ids);
                }
            });
        }
    }, [service]);


    const handleDeleteImage = (index: number) => {
        if(archiveByUser?.company?.isLoading){
            const selectedImage = archiveByService?.service?.[index];
                const match = selectedImage?.base64?.match(/serv_(\d+)/);
                if (match) {
                    const serviceId = Number(match[1]);
                    setDeleteIdsArchive({
                        ...deleteIdsArchive,
                        services: [...(deleteIdsArchive?.services || []), serviceId]
                    });
                }
        }else{
            const selectedPromotionId = promocionesIds[index];
            setDeleteIdsArchive({
                ...deleteIdsArchive,
                services: [...(deleteIdsArchive?.services || []), Number(selectedPromotionId)]
            }); 

            setPromocionesIds(prev => prev.filter((_, i) => i !== index));

        }

        if (archiveByService?.service) {
            setArchiveByService({
              ...archiveByService,
              service: archiveByService.service.filter((_, i) => i !== index)
            });
          }
          
    
        // Resetear el input si existe
        if (serviceInputRef.current) {
            serviceInputRef.current.value = "";
        }
    };

    const videoInputRef = useRef<HTMLInputElement>(null);
    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
      
        // Validar si ya hay un video subido
        if (movieService?.base64) {
          showSnackbar("Ya has subido un video. Elimina el anterior para subir uno nuevo.", "warning");
          return;
        }
      
        const maxSizeMB = 50;
        const maxDurationSec = 45;
      
        // Validar tamaño (en MB)
        if (file.size > maxSizeMB * 1024 * 1024) {
          showSnackbar(`El video no debe superar los ${maxSizeMB} MB.`, "error");
          return;
        }
      
        const videoURL = URL.createObjectURL(file);
        const video = document.createElement("video");
      
        video.preload = "metadata";
        video.src = videoURL;
      
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
      
          if (video.duration > maxDurationSec) {
            showSnackbar(`El video debe durar como máximo ${maxDurationSec} segundos.`, "error");
            if (videoInputRef.current) {
              videoInputRef.current.value = "";
            }
            return;
          }
      
          const reader = new FileReader();
          reader.onloadend = () => {
            setMovieService({
              base64: reader.result as string,
              name: file.name,
              isLoading: true,
            });
          };
          reader.readAsDataURL(file);
        };
      };
      

    const handleDeleteVideo = () => {
        if(movieService && movieService?.isLoading){
                const match = movieService?.base64?.match(/serv_(\d+)/);
                if (match) {
                    const serviceId = Number(match[1]);
                    setDeleteMovieService(serviceId);
                    setMovieService(null);
                }
        }else{
            setDeleteMovieService(0);
            setMovieService(null);
        }
       
        if (videoInputRef.current) {
          videoInputRef.current.value = "";
        }
    };

    // const [recommendationFile, setRecommendationFile] = useState<File | null>(null);
    const DocumentInputRef = useRef<HTMLInputElement>(null);
    const handleRecommendationUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
      
        const maxSizeMB = 10;
      
        // Validar si ya hay un documento subido
        if (letterService?.base64) {
          showSnackbar("Ya has subido una carta de recomendación. Elimina la anterior para subir una nueva.", "warning");
          return;
        }
      
        // Validar tipo de archivo
        if (file.type !== "application/pdf") {
          showSnackbar("Por favor, sube un archivo PDF válido.", "error");
          return;
        }
      
        // Validar tamaño (en MB)
        if (file.size > maxSizeMB * 1024 * 1024) {
          showSnackbar(`El archivo PDF no debe superar los ${maxSizeMB} MB.`, "error");
          if (DocumentInputRef?.current) {
            DocumentInputRef.current.value = "";
          }
          return;
        }
      
        const reader = new FileReader();
        reader.onloadend = () => {
          setLetterService({
            base64: reader.result as string,
            name: file.name,
            isLoading: true,
          });
        };
        reader.readAsDataURL(file);
    };
      
    const handleDeleteRecommendation = () => {
        if(letterService && letterService?.isLoading){
            const match = letterService?.base64?.match(/serv_(\d+)/);
            if (match) {
                const serviceId = Number(match[1]);
                setDeleteLetterService(serviceId);
                setLetterService(null);
            }
        }else{
            setDeleteLetterService(0);
            setLetterService(null);
        }
    
        if (DocumentInputRef?.current) {
            DocumentInputRef.current.value = "";
        }
    };


  return (
    <CustomModal
      open={modal}
      typeSection={servicePublishStep}
      title="Publicar Huarique"
      onReturn={onReturn}
      onClose={ResetClose}
      onContinue={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-gray-900 text-center w-full">
        <h2 className="text-gray-900 text-lg font-medium text-start w-full">Datos del huarique</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Nombre de tu huarique */}
            <div className="w-full">
                <CustomInput
                    label="Nombre de tu Huarique"
                    placeholder="Nombre de tu Huarique"
                    errorMessage={errors.nameService?.message}
                    required
                    {...register("nameService", { onChange: () => trigger("nameService") })}
                    value={watch("nameService") ?? ""}
                />
            </div>
            {/* Categoría */}
            <div className="w-full">
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label="Categoria"
                            name={field.name}
                            value={field.value ?? ""} 
                            onChange={(event: SelectChangeEvent<unknown>) => {
                                const value = event.target.value as string;
                                field.onChange(value);
                            }}
                            options={subCategory
                                .filter((subc) => subc?.idPadre !== null && [10, 11, 12,13, 15].includes(subc?.idPadre ?? -1))
                                .map((subc) => ({ value: subc?.id?.toString() ?? "", label: subc.nombre ?? "Sin Nombre" }))
                                .sort((a, b) => {
                                    if (a.label === "Otros") return 1;
                                    if (b.label === "Otros") return -1;
                                    return 0;
                                })
                            }
                            errorMessage={errors.category?.message}
                            className="text-left"
                        />
                    )}
                />
            </div>
            {/* Hora de Atención */}
            <div className={`${watch("schedule") === "D" && ""} w-full flex justify-center items-start flex-col gap-4 sm:flex-row`}>
                <Controller
                    name="schedule"
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label="Hora de atención"
                            name={field.name}
                            value={field.value}
                            onChange={(event: SelectChangeEvent<unknown>) =>{
                                field.onChange(event?.target.value);
                                handleScheduleChange(event.target.value as string);
                            } }
                            options={[
                                { value: "D", label: "Hora de atención" },
                                { value: "L", label: "Siempre abierto" },
                            ]}
                            errorMessage={errors.schedule?.message}
                            className="text-left"
                        />
                    )}
                />
                {
                    watch("schedule") === "D" && (
                        <div className="w-full flex items-center justify-center gap-4">
                            <Controller
                                name="horaInicio"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        label="Inicio"
                                        name={field.name}
                                        value={field.value}
                                        onChange={(event) => {
                                            field.onChange(event.target.value)
                                            if (watch("schedule") === "D") {
                                                const data = getValues();
                                                const formattedData = {
                                                    nombreServicio: data.nameService,
                                                    idCategoria: Number(data.category),
                                                    tieneDelivery: data.tieneDevilery,
                                                    descripcion: data.description,
                                                };
                                                setModifiedService({
                                                    ...modifiedService,
                                                    ...formattedData,
                                                    horario: `${event.target.value} - ${watch("horaFinal")}`,
                                                })
                                            }
                                        }}
                                        options={horaOptions}
                                        className="text-left"
                                    />
                                )}
                            />
                            <Controller
                                name="horaFinal"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        label="Final"
                                        name={field.name}
                                        value={field.value}
                                        onChange={(event) => {
                                            field.onChange(event.target.value)
                                            if (watch("schedule") === "D") {
                                                const data = getValues();
                                                const formattedData = {
                                                    nombreServicio: data.nameService,
                                                    idCategoria: Number(data.category),
                                                    tieneDelivery: data.tieneDevilery,
                                                    descripcion: data.description,
                                                };
                                                setModifiedService({
                                                    ...modifiedService,
                                                    ...formattedData,
                                                    horario: `${watch("horaInicio")} - ${event.target.value}`,
                                                })
                                            }
                                        }}
                                        options={horaOptions}
                                        className="text-left"
                                    />
                                )}
                            />
                        </div>
                    )
                }
            </div>
            {/* Tiene Delivery */}
            <div className="w-full">
                <Controller
                    name="tieneDevilery"
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label="Tiene Delivery"
                            name={field.name}
                            value={field.value} 
                            onChange={(event: SelectChangeEvent<unknown>) => {
                                const value = event.target.value as boolean;
                                field.onChange(value);
                            }}
                            options={[
                                { value: true, label: "Con Delivery" },
                                { value: false, label: "Sin Delivery" },
                            ]}
                            errorMessage={errors.tieneDevilery?.message}
                            className="text-left"
                        />
                    )}
                />
            </div>
            {/* Descripción */}
            <div className="w-full">
                <CustomInput
                    label="Describe tu huarique y tus mejores platos"
                    placeholder="Describe tu huarique y tus mejores platos"
                    errorMessage={errors.description?.message}
                    multiline={true}
                    minRows={3}
                    required
                    {...register("description", { onChange: () => trigger("description") })}
                    value={watch("description") ?? ""}
                />
            </div>
             {/* Imagenes de Servicios */}
            <div className="flex flex-col items-center gap-3 w-full">
                <CustomButton
                    variantType="terciary"
                    type="button"
                    size="medium"
                    isLoading={false}
                    className="!normal-case relative z-10 flex items-center gap-2"
                >
                    <FaUtensils className="text-lg" />
                    Subir Promociones
                    <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    ref={serviceInputRef}
                    onChange={handleServiceUpload}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                </CustomButton>

                <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 shadow-inner hover:shadow-md transition p-2">
                    {archiveByService?.service && archiveByService?.service?.length > 0 ? (
                    <div className="w-full h-full flex gap-2 relative">
                        {archiveByService?.service?.length === 1 && (
                            <>
                                    <img
                                    src={archiveByService?.service[0]?.base64 ?? undefined}
                                    alt="Imagen 1"
                                    className="object-contain w-full h-full rounded-lg"
                                />
                                <button
                                    onClick={()=>handleDeleteImage(0)}
                                    className="absolute top-2 right-2 bg-white text-gray-600 cursor-pointer hover:text-red-800 rounded-full p-1 shadow-md transition"
                                >
                                    <FaTimes className="text-sm" />
                                </button>
                            </>
                            
                        )}

                        {archiveByService?.service.length === 2 && (
                        <>
                            <div className="relative w-1/2 h-full">
                                <img
                                    src={archiveByService?.service[0]?.base64 ?? undefined}
                                    alt="Imagen 1"
                                    className="object-contain w-full h-full rounded-lg"
                                />
                                <button
                                    onClick={() => handleDeleteImage(0)}
                                    className="absolute top-2 right-2 bg-white text-gray-600 cursor-pointer hover:text-red-800 rounded-full p-1 shadow-md transition"
                                >
                                    <FaTimes className="text-sm" />
                                </button>
                            </div>

                            <div className="relative w-1/2 h-full">
                                <img
                                    src={archiveByService?.service[1]?.base64 ?? undefined}
                                    alt="Imagen 2"
                                    className="object-contain w-full h-full rounded-lg"
                                />
                                <button
                                    onClick={() => handleDeleteImage(1)}
                                    className="absolute top-2 right-2 bg-white text-gray-600 cursor-pointer hover:text-red-800 rounded-full p-1 shadow-md transition"
                                >
                                    <FaTimes className="text-sm" />
                                </button>
                            </div>
                        </>
                        )}
                        {archiveByService?.service.length === 3 && (
                            <div className="w-full h-full flex gap-2">
                            <div className="relative w-1/2 h-full">
                            <img
                                src={archiveByService?.service[0]?.base64 ?? undefined}
                                alt="Imagen 1"
                                className="object-contain w-full h-full rounded-lg"
                            />
                            <button
                                onClick={() => handleDeleteImage(0)}
                                className="absolute top-2 right-2 bg-white text-gray-600 cursor-pointer hover:text-red-800 rounded-full p-1 shadow-md transition"
                            >
                                <FaTimes className="text-sm" />
                            </button>
                            </div>
                            <div className="w-1/2 flex flex-col gap-2 h-full">
                            <div className="relative h-1/2">
                                <img
                                src={archiveByService?.service[1]?.base64 ?? undefined}
                                alt="Imagen 2"
                                className="object-contain w-full h-full rounded-lg"
                                />
                                <button
                                onClick={() => handleDeleteImage(1)}
                                className="absolute top-2 right-2 bg-white text-gray-600 cursor-pointer hover:text-red-800 rounded-full p-1 shadow-md transition"
                                >
                                <FaTimes className="text-sm" />
                                </button>
                            </div>
                            <div className="relative h-1/2">
                                <img
                                src={archiveByService?.service[2]?.base64 ?? undefined}
                                alt="Imagen 3"
                                className="object-contain w-full h-full rounded-lg"
                                />
                                <button
                                onClick={() => handleDeleteImage(2)}
                                className="absolute top-2 right-2 bg-white text-gray-600 cursor-pointer hover:text-red-800 rounded-full p-1 shadow-md transition"
                                >
                                <FaTimes className="text-sm" />
                                </button>
                            </div>
                            </div>
                        </div>
                        
                        )}
                    </div>
                    ) : (
                    <div className="flex flex-col items-center text-gray-400 h-full justify-center">
                        <CustomImage
                        name={`no_photo_01`}
                        alt="no_photo_01"
                        className={`cursor-pointer w-28 h-28`}
                        />
                        <p className="text-sm">Vista previa de imágenes promocionales</p>
                    </div>
                    )}
                </div>
            </div>
            {/* Video promocional (Opcional) */}
            {
                user?.planes?.length && user?.planes[0].nombre == "Chévere" ? (<>
                <div className="flex flex-col items-center gap-3 w-full">
                    <CustomButton
                        variantType="terciary"
                        type="button"
                        size="medium"
                        isLoading={false}
                        className="!normal-case relative z-10 flex items-center gap-2"
                        >
                        <FaVideo className="text-lg" />
                        Subir Video Promocional (Opcional)
                        <input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            ref={videoInputRef}
                            onChange={handleVideoUpload}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                    </CustomButton>
                    <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 shadow-inner hover:shadow-md transition p-2">
                        {movieService ? (
                            <div className="w-full mt-4 relative">
                                <video controls className="w-full rounded-lg shadow-md">
                                    <source src={movieService?.base64?.toString() ?? ""} type="video/mp4" />
                                    Tu navegador no soporta el elemento de video.
                                </video>
                                <button
                                    onClick={handleDeleteVideo}
                                    className="absolute top-2 right-2 bg-white text-gray-600 cursor-pointer hover:text-red-800 rounded-full p-1 shadow-md transition"
                                >
                                    <FaTimes className="text-sm" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 h-full justify-center">
                            <CustomImage
                            name={`no_photo_01`}
                            alt="no_photo_01"
                            className={`cursor-pointer w-28 h-28`}
                            />
                            <p className="text-sm">Vista previa del video promocional</p>
                        </div>
                        )}
                    </div>
                </div>
                </>):(<>
                
                </>)
            }
            {/* Carta de recomendación (Opcional) */}
            <div className="flex flex-col items-center gap-3 w-full">
                {/* Botón personalizado para subir PDF */}
                <CustomButton
                    variantType="terciary"
                    type="button"
                    size="medium"
                    isLoading={false}
                    className="!normal-case relative z-10 flex items-center gap-2"
                >
                    <FaFilePdf className="text-lg text-white" />
                    Subir Carta de Recomendación (Opcional)
                    <input
                    type="file"
                    ref={DocumentInputRef}
                    accept="application/pdf"
                    onChange={handleRecommendationUpload}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                </CustomButton>

                {/* Zona de drop para mostrar el archivo cargado */}
                <div className="w-full min-h-[100px] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 shadow-inner hover:shadow-md transition p-4 flex items-center justify-center">
                    {letterService ? (
                    <div className="flex items-center gap-3 text-green-600 w-full justify-between">
                        <div className="flex items-center gap-2">
                        <FaFilePdf className="text-xl" />
                        <span className="text-sm font-medium truncate max-w-[140px] sm:max-w-[300px]">
                            {letterService?.name}
                        </span>
                        </div>
                        <button
                        onClick={handleDeleteRecommendation}
                        className="bg-white text-gray-600 cursor-pointer hover:text-red-800 rounded-full p-1 shadow-md transition"
                        >
                        <FaTimes className="text-sm" />
                        </button>
                    </div>
                    ) : (
                    <div className="text-gray-400 text-sm flex items-center gap-2">
                        <FaFilePdf className="text-xl" />
                        <span>Vista previa del PDF aparecerá aquí</span>
                    </div>
                    )}
                </div>
            </div>
        </form>
      </div>
      <SnackbarComponent/>
    </CustomModal>
  );
};

export default ModalServiceInfo;