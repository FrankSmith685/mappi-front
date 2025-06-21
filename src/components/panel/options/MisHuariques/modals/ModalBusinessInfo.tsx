import React, { useEffect, useRef, useState } from "react";
import CustomModal from "../../../../ui/CustomModal";
import { useAppState } from "../../../../../hooks/useAppState";
import CustomInput from "../../../../ui/CustomInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import CustomSelect from "../../../../ui/CustomSelect";
// import CustomDate from "../../../../ui/CustomDate";
// import { User } from "../../../../../interfaces/user";
import { SelectChangeEvent } from "@mui/material";
import { useGeocoder } from "../../../../../hooks/useGeocoder";
import { useLocationAutocomplete } from "../../../../../hooks/useLocationAutocomplete";
import { dataUbigeo } from "../../../../../interfaces/ubigeo";
import CustomButton from "../../../../ui/CustomButtom";
import { FaImage, FaSpinner, FaTimes, FaUserCircle } from "react-icons/fa";
import CustomImage from "../../../../ui/CustomImage";
import { useCompany } from "../../../../../hooks/useCompany";
import { useServices } from "../../../../../hooks/useServices";
import { Service } from "../../../../../interfaces/service";

const ModalBusinessInfo: React.FC = () => {
    type ProfileFormValues = z.infer<typeof schema>;
    const { 
        modal, 
        setModal, 
        servicePublishStep, 
        // modifiedUser, 
        departmentsAll, 
        setServicePublishStep,  
        setModifiedUser,
        districtsAll,
        user,
        setCurrentLocationAux,
        modifiedCompany,
        currentLocationAux,
        setModifiedCompany,
        company,
        archiveByUser,
        setArchiveByUser,
        service,
        setModifiedService,
        modifiedService,
        setService,
        isActiveCompany,
        setIsActiveCompany,
        servicePublishType,
        setCompany,
        setDeleteIdsArchive,
        deleteIdsArchive,
        setArchiveByService,
        serviceList,
        setServiceList,
        setMovieService,
        setLetterService
    } = useAppState();
    const {getGeocoder} = useGeocoder();
    const logoInputRef = useRef<HTMLInputElement | null>(null);
    const portadaInputRef = useRef<HTMLInputElement | null>(null);
    const {saveCompany, getCompany} = useCompany();
    const {getServiceId} = useServices();

    const schema = z.object({
        nameCompany: z.string().min(1, "El campo nombre de la empresa es obligatorio"),
        ruc: z.string().regex(/^(10|20)\d{9}$/, "El campo RUC debe comenzar con '10' o '20' y tener 11 dígitos"),
        district: z.number(),
        address: z.string(),
    });

    const { register, handleSubmit,getValues, formState: { errors }, reset, watch, trigger,control } = useForm<ProfileFormValues>({
          resolver: zodResolver(schema),
          mode: "onChange",
    });

    const {
        suggestions,
        value: suggestedValue,
        setValue: setSuggestedValue,
        handleSelect,
        suggestionAccepted,
        setSuggestionAccepted,
    } = useLocationAutocomplete();

    const [formInitialized, setFormInitialized] = useState(false);
    useEffect(() => {
        if (modifiedCompany || currentLocationAux) {
            // const department = departmentsAll.find((d) => d.id === Number(currentLocationAux?.idUbigeo))
            // const district = districtsAll.find((d)=>d.id === serviceSelect?.idUbigeo);
            
            reset({
                nameCompany: modifiedCompany?.empresa || "",
                ruc: modifiedCompany?.ruc || "",
                district: service ? Number(currentLocationAux?.district.value) : modifiedCompany?.idUbigeo ,
                address: service ? currentLocationAux?.address : modifiedCompany?.direccion || "",
            });
            setFormInitialized(true);
        }
    }, [modifiedCompany, reset, formInitialized,currentLocationAux,service]);
    
    const onReturn = () => {
        const data = getValues();
        const formattedData = {
            empresa: data.nameCompany,
            ruc: data.ruc,
            idUbigeo: data.district,
            direccion: data.address,
        };
        setModifiedCompany({
            ...modifiedCompany,
            ...formattedData,
        });
        setServicePublishStep("personalInfo");
    }

    const onSubmit = (data : ProfileFormValues) => {
        const formattedData = {
            empresa: data.nameCompany,
            ruc: data.ruc,
            idUbigeo: data.district,
            direccion: data.address
        };
        setModifiedCompany({
            ...modifiedCompany,
            ...formattedData,
        });

        if(isActiveCompany){
            setServicePublishStep("finished");
            setIsActiveCompany(false);
            // if(servicePublishType == "business"){
                const dataCompany={
                    Id: company ? company.id : 0,
                    Direccion: data.address,
                    Latitud: modifiedCompany?.latitud ?? user?.latitud,
                    Longitud:modifiedCompany?.longitud ?? user?.longitud,
                    IdUbigeo:data.district,
                    Empresa:data.nameCompany,
                    Ruc:data.ruc,
                    idUsuario:user?.id
                }
                saveCompany(dataCompany,true,true);
                
            // }
        }else{
            setServicePublishStep("serviceInfo");
            const formattedData = {
                empresa: data.nameCompany,
                ruc: data.ruc,
                idUbigeo: data.district,
                direccion: data.address
            };
            setModifiedCompany({
                ...modifiedCompany,
                ...formattedData,
            });
        }

        
    };

    const handleChangeDistrito=(value:string)=>{
        const modifiedCompanyData = getValues();
        const districtsAllAux =  districtsAll.find((district)=>district.id.toString() == value.toString() );
        const departmentsAllAux = departmentsAll.find((department)=>department.id === districtsAllAux?.idPadre);

        const address = departmentsAllAux?.nombre + ", " + districtsAllAux?.nombre;
        setSuggestedValue(address);
        setSuggestionAccepted(false);
        getGeocoder(undefined,undefined,address,(data=>{
            const fomattedDataLocation = {
                idUbigeo: districtsAllAux?.id,
                latitud: data.latitude ?? null,
                longitud: data.longitude ?? 0,
                direccion: address ?? null
            }
            setCurrentLocationAux({
                ...currentLocationAux,
                idUbigeo: departmentsAllAux?.id?.toString() ?? "",
                department: { value: departmentsAllAux?.id ?? 0, label: departmentsAllAux?.nombre?? "", quantity: departmentsAllAux?.cantidad ?? 0 },
                district:{ value: districtsAllAux?.id ?? 0, label: districtsAllAux?.nombre?? "", quantity: districtsAllAux?.cantidad ?? 0 },
                latitude:data.latitude,
                longitude:data.longitude,
                address:address,
            })

            const fomattedModifiedCompany = {
                empresa:modifiedCompanyData.nameCompany,
                ruc:modifiedCompanyData.ruc
            }
            setModifiedCompany({
                ...modifiedCompany,
                ...fomattedModifiedCompany,
                ...fomattedDataLocation,
                
            });

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
    }

    const [isLoadingImagen,setIsLoadingImagen] = useState(false);

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

                setArchiveByUser({
                    ...archiveByUser,
                    company: {
                    portada: null,
                    logo:null,
                    isLoading:true
                    },
                });
                setArchiveByService({
                    service:[],
                    id:0,
                    isLoading:true
                })
                setMovieService(null)
                setLetterService(null)
            }
            

        }else{
            setFormInitialized(false)
            setModifiedUser(user);
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
            if(company){
                setModifiedCompany(company);
            }
            setService(null);
            setModifiedService(null);

            if(servicePublishType === "business"){
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
    
    const renderSuggestions = () => {
        const suggestionsInPeru = suggestions.data.filter((suggestion) => {
          const {
            structured_formatting: { secondary_text },
          } = suggestion;
          return secondary_text.includes("Perú");
        });
      
        if (suggestionsInPeru.length > 0) {
          return suggestionsInPeru.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion;
      
            return (
              <li
                key={place_id}
                onClick={handleSelect(suggestion, (data) => {
                const modifiedCompanyData= getValues();
                  const fomattedDataLocation = {
                    latitud: data.latitude ?? 0,
                    longitud: data.longitude ?? 0,
                    direccion: data.address ?? null,
                  };
                  setCurrentLocationAux({
                    ...currentLocationAux,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    address: data.address,
                  });
                  const fomattedModifiedCompany = {
                        empresa:modifiedCompanyData.nameCompany,
                        ruc:modifiedCompanyData.ruc
                    }
                  setModifiedCompany({
                    ...modifiedCompany,
                    ...fomattedModifiedCompany,
                    ...fomattedDataLocation,
                  });
                  if(modifiedService){
                        const fomattedDataLocations = {
                            longitud: data.longitude,
                            latitud: data.latitude,
                            address: data.address
                        };
                        setModifiedService({
                            ...modifiedService,
                            ...fomattedDataLocations,
                        })
                    }
                })}
                className="px-4 py-3 hover:bg-blue-100 cursor-pointer transition-all duration-150"
              >
                <p className="font-semibold text-gray-800">{main_text}</p>
                <p className="text-sm text-gray-500">{secondary_text}</p>
              </li>
            );
          });
        } else {
          return (
            <li className="px-4 py-3 text-sm text-gray-500">
              No se encontraron sugerencias en Perú
            </li>
          );
        }
    };

    const onChangeAddressInput = (value:string) => {
        setSuggestionAccepted(true);
        const departmentAux = departmentsAll.find((department) => department.id.toString() === currentLocationAux.idUbigeo.toString());
        const districtAux = districtsAll.filter((district) => district.idPadre?.toString() === departmentAux?.id.toString());
        const districtByCompany:dataUbigeo | undefined = districtAux.find((district) => district.id.toString() === modifiedCompany?.idUbigeo?.toString());
        const splittedValues = value.split(", ");
        const city = departmentAux?.nombre;
        const newAddress = splittedValues[2];
        const changedAddress = buildAddress(city ?? "", districtByCompany ? [districtByCompany] : [], newAddress ?? "");
        setSuggestedValue(changedAddress);
    };

    const buildAddress = (city:string, district:dataUbigeo[], newAdress:string) => {
        const modifiedCompanyData=getValues();
        const buildedAddress = `${city}, ${district[0]?.nombre}, ${newAdress ||
            ""}`;
        const fomattedModifiedCompany = {
            empresa:modifiedCompanyData.nameCompany,
            ruc:modifiedCompanyData.ruc
        }
        setModifiedCompany({
            ...modifiedCompany,
            ...fomattedModifiedCompany,
            direccion: buildedAddress
        });

        return buildedAddress;
    }

    // Logo y Portada
    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setArchiveByUser({
                    ...archiveByUser,
                    company: {
                      ...archiveByUser?.company,
                      logo:{
                        base64:reader.result as string,
                        name:file.name
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
            reader.onloadend = () => {
                setArchiveByUser({
                    ...archiveByUser,
                    company: {
                      ...archiveByUser?.company,
                      portada: {
                        base64:reader.result as string,
                        name:file.name
                      },
                      isLoading:true
                    },
                });
            }
            reader.readAsDataURL(file);
        }
    };

    const handleClickDeleteLogo=()=>{
        if(archiveByUser?.company?.logo?.isLoading){
            const selectedLogo = archiveByUser?.company?.logo?.base64;
            if (selectedLogo) {
                const match = selectedLogo.match(/empr_(\d+)$/);
                if (match) {
                  const companyId = match[1];
                  setDeleteIdsArchive({
                    ...deleteIdsArchive,
                    company:{
                        ...deleteIdsArchive?.company,
                        logo:Number(companyId),
                    } 
                })
                }
              }
        }else{
            getCompany((data) => {
                setDeleteIdsArchive({
                    ...deleteIdsArchive,
                    company:{
                        ...deleteIdsArchive?.company,
                        logo:data.idLogo,
                    } 
                })
            });
        }

        setArchiveByUser({
            ...archiveByUser,
            company: {
                ...archiveByUser?.company,
                logo: null,
                isLoading:true
            },
        });
        if (logoInputRef.current) {
            logoInputRef.current.value = "";
        }
        
    }

    const handleClickDeletePortada=()=>{
        if(archiveByUser?.company?.isLoading){
            const selectedPortada = archiveByUser?.company?.portada?.base64;
            if (selectedPortada) {
                const match = selectedPortada.match(/usua_(\d+)$/);
                if (match) {
                  const companyId = match[1];
                  setDeleteIdsArchive({
                    ...deleteIdsArchive,
                    company:{
                        ...deleteIdsArchive?.company,
                        portada:Number(companyId),
                    } 
                })
                }
              }
        }else{
            getCompany((data) => {
                setDeleteIdsArchive({
                    ...deleteIdsArchive,
                    company:{
                        ...deleteIdsArchive?.company,
                        portada:data.idPortada,
                    } 
                })
            });
        }

        setArchiveByUser({
            ...archiveByUser,
            company: {
                ...archiveByUser?.company,
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
      typeSection={isActiveCompany ? "null" : servicePublishStep}
      title={company ? 'Editar Empresa' : 'Registrar Empresa'}
      onReturn={onReturn}
      onClose={ResetClose}
      onContinue={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-gray-900 text-center w-full">
        <h2 className="text-gray-900 text-lg font-medium text-start w-full">Datos de la Empresa</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Nombre de la empresa */}
            <div className="w-full">
                <CustomInput
                    label="Nombre de la empresa"
                    placeholder="Nombre de la empresa"
                    errorMessage={errors.nameCompany?.message}
                    required
                    {...register("nameCompany", { onChange: () => trigger("nameCompany") })}
                    value={watch("nameCompany") ?? ""}
                />
            </div>
            {/* Ruc de la empresa */}
            <div className="w-full">
            <CustomInput
                label="RUC de la empresa"
                placeholder="Ingrese el RUC de la empresa"
                errorMessage={errors.ruc?.message}
                required
                {...register("ruc", { 
                    onChange: () => trigger("ruc"),
                    pattern: {
                        value: /^(10|20)\d{9}$/,
                        message: "El campo RUC debe comenzar con '10' o '20' y tener 11 dígitos"
                    }
                })}
                value={watch("ruc") ?? ""}
                inputMode="numeric"
                onKeyDown={(e) => {
                    const input = e.currentTarget as HTMLInputElement;
                    const selectedText = window.getSelection()?.toString() || "";
                    if (
                        ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)
                    ) return;
                    const currentValue = input?.value ?? "";
                    if (currentValue.length >= 11 && selectedText.length === 0) {
                        e.preventDefault();
                        return;
                    }
                    if (!/^\d$/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
            />
            </div>
            {/* Distrito */}
            <div className="w-full">
                <Controller
                    name="district"
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label="Distrito"
                            name={field.name}
                            value={field.value}
                            onChange={(event: SelectChangeEvent<unknown>) => {
                                const value = event.target.value as string; // Convierte a string
                                field.onChange(value);
                                handleChangeDistrito(value);
                            }}                                                   
                            options={currentLocationAux.districtbydepartment?.map((district) => ({
                                value: district.id,
                                label: district.nombre,
                            })) || []}
                            errorMessage={errors.district?.message}
                            className="text-left"
                        />
                    )}
                />
            </div>
            {/* Dirección */}
            <div className="w-full">
                <CustomInput
                    label="Dirección de la empresa"
                    placeholder="Dirección de la empresa"
                    required
                    {...register("address", {
                        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                            onChangeAddressInput(event.target.value);
                        }
                    })}
                    value={suggestionAccepted ? suggestedValue : modifiedCompany?.direccion || ""}
                />
                <div className="px-2 text-start">
                    {(suggestions.status === "OK" && suggestionAccepted) && (
                        <ul className="bg-white shadow-lg rounded-xl mt-2 border border-gray-200 divide-y divide-gray-100">
                        {renderSuggestions()}
                        </ul>
                    )}
                </div>
            </div>
            {/* Logo y Portada */}
            <div className={`w-full flex justify-center items-start flex-col gap-4 sm:flex-row`}>
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
                            {archiveByUser?.company?.logo?.base64 ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img
                                        src={archiveByUser?.company?.logo.base64}
                                        alt="Logo Preview"
                                        className="object-contain h-full max-w-full"
                                    />
                                    <button
                                        onClick={handleClickDeleteLogo}
                                        className="absolute top-2 right-2 bg-white text-gray-600 cursor-pointer hover:text-red-800 rounded-full p-1 shadow-md transition"
                                    >
                                        <FaTimes className="text-sm" />
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
                            <div className="flex justify-center items-center w-full h-full">
                                <FaSpinner className="animate-spin text-gray-500 text-3xl" />
                            </div>
                        ) : (
                            <>
                                {archiveByUser?.company?.portada?.base64 ? (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                            <img
                                                src={archiveByUser?.company?.portada.base64}
                                                alt="Logo Preview"
                                                className="object-contain h-full max-w-full"
                                            />
                                            <button
                                                onClick={handleClickDeletePortada}
                                                className="absolute top-2 right-2 bg-white text-gray-600 cursor-pointer hover:text-red-800 rounded-full p-1 shadow-md transition"
                                            >
                                                <FaTimes className="text-sm" />
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

export default ModalBusinessInfo;