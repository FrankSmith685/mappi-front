import React, { useEffect, useState } from "react";
import CustomModal from "../../../../ui/CustomModal";
import { useAppState } from "../../../../../hooks/useAppState";
import CustomInput from "../../../../ui/CustomInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import CustomSelect from "../../../../ui/CustomSelect";
import { SelectChangeEvent } from "@mui/material";
import { useGeocoder } from "../../../../../hooks/useGeocoder";
import { useLocationAutocomplete } from "../../../../../hooks/useLocationAutocomplete";
import { dataUbigeo } from "../../../../../interfaces/ubigeo";
import CustomMap from "../../../../ui/CustomMap";
import { imageBaseUrl } from "../../../../../api/apiConfig";
import { useServices } from "../../../../../hooks/useServices";
import { useUser } from "../../../../../hooks/useUser";
import { User } from "../../../../../interfaces/user";
import { useCompany } from "../../../../../hooks/useCompany";
import { Service } from "../../../../../interfaces/service";
import { useArchives } from "../../../../../hooks/useArchives";

interface LatLng {
    lat: number;
    lng: number;
}

const ModalLocationInfo: React.FC = () => {
    type ProfileFormValues = z.infer<typeof schema>;
    const { 
        modal, 
        setModal, 
        servicePublishStep,
        setServicePublishStep,
        setModifiedUser,
        modifiedUser,
        user,
        setCurrentLocationAux,
        modifiedService,
        setModifiedCompany,
        company,
        setArchiveByUser,
        archiveByUser,
        servicePublishType,
        setModifiedService,
        service,
        departmentsAll,
        districtsAll,
        modifiedCompany,
        currentLocationAux,
        subCategory,
        setCompany,
        setService,
        setUser,
        deleteIdsArchive,
        setArchiveByService,
        serviceList,
        setServiceList,
        setMovieService,
        deleteMovieService,
        setLetterService,
        deleteLetterService
    } = useAppState();


    const schema = z.object({
        city: z.number(),
        district: z.number(),
        address: z.string(),
    });
    const {getGeocoder} = useGeocoder();
    const {saveService,getServiceId} = useServices();
    const {updateUser,getUser} = useUser();
    const {saveCompany, getCompany} = useCompany();
    const { deleteArchivo,deleteMovieArchivo, deleteLetterArchivo} = useArchives(); 



    const { register, handleSubmit, formState: { errors }, reset,control } = useForm<ProfileFormValues>({
          resolver: zodResolver(schema),
          mode: "onChange"
    });
    const [formInitialized, setFormInitialized] = useState(false);
    const {
        suggestions,
        value: suggestedValue,
        setValue: setSuggestedValue,
        handleSelect,
        suggestionAccepted,
        setSuggestionAccepted,
    } = useLocationAutocomplete();

    useEffect(() => {
        if (currentLocationAux) {
            reset({
                city: currentLocationAux.department.value,
                district: currentLocationAux.district.value,
                address: currentLocationAux.address,
            });
            setFormInitialized(true);
        }
    }, [currentLocationAux, reset,formInitialized]);

    const onReturn = () => {
        setServicePublishStep("serviceInfo");
    }

    const onSubmit = async (data: ProfileFormValues) => {
        deleteArchivo("Servicios",deleteIdsArchive?.services ?? []);
        deleteMovieArchivo(deleteMovieService);
        deleteLetterArchivo(deleteLetterService);
        if(user?.planes && user.planes.length > 0){
            setServicePublishStep("finished")
        }else{
            setServicePublishStep("payOptions")
        }
        const dataServicio={
            servInterno: service ? service.id : 0,
            ServDireccion: data.address,
            ServDescripcion: modifiedService?.descripcion,
            ServTieneDelivery: modifiedService?.tieneDelivery,
            servActivo:true,
            servLatitud: modifiedService?.latitud,
            ServLongitud: modifiedService?.longitud,
            UbigInterno: modifiedService?.idUbigeo,
            UsuaInterno: user?.id,
            SubcInterno: modifiedService?.idCategoria,
            ServHorario: modifiedService?.horario,
            ServNombre: modifiedService?.nombreServicio,
            // ServPlan: service ? service.plan_ : "null",
        }

        // AQUI GUARDAR EL SERVICIO
        await saveService(dataServicio  as Service,true);
        // AQUI GUARDAR EL USUARIO
        await updateUser(modifiedUser as User, (()=>{}),true);
        // AQUI GUARDAR EL COMPANY
        if(servicePublishType == "business"){
            // Eliminar imagen "PORTADA y LOGO"
            if(deleteIdsArchive?.company?.logo != null){
                deleteArchivo("Empresas",Number(deleteIdsArchive?.company?.logo))
            }
            if(deleteIdsArchive?.company?.portada != null){
                deleteArchivo("Empresas",Number(deleteIdsArchive?.company?.portada))
            }
            
            const dataCompany={
                Id: company ? company.id : 0,
                Direccion: modifiedCompany?.direccion,
                Latitud: modifiedCompany?.latitud,
                Longitud:modifiedCompany?.longitud,
                IdUbigeo:modifiedCompany?.idUbigeo,
                Empresa:modifiedCompany?.empresa,
                Ruc:modifiedCompany?.ruc,
                idUsuario:user?.id
            }
            await saveCompany(dataCompany,true);
        }

        if(servicePublishType == "independiente"){
            if(deleteIdsArchive?.independent?.logo != null){
                deleteArchivo("Usuarios",Number(deleteIdsArchive?.independent?.logo))
            }
            if(deleteIdsArchive?.independent?.portada != null){
                deleteArchivo("Usuarios",Number(deleteIdsArchive?.independent?.portada))
            }
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
                setMovieService(null)
                setLetterService(null)
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

    const handleChangeCiudad=(value:string)=>{
        const departmentsAllAux = departmentsAll.find((department)=>department.id === parseInt(value));
        const districtsAllAux =  districtsAll.find((district)=>district.idPadre === departmentsAllAux?.id );
        const districtbydepartment = districtsAll.filter((district) => district.idPadre == departmentsAllAux?.id);
        
        const address = departmentsAllAux?.nombre + ", " + districtsAllAux?.nombre;
        setSuggestedValue(address);
        setSuggestionAccepted(false);
        getGeocoder(undefined,undefined,address,(data=>{
            const fomattedDataLocation = {
                idUbigeo: departmentsAllAux?.id,
                latitud: data.latitude ?? null,
                longitud: data.longitude ?? 0,
                direccion: address ?? null,
                ciudad: departmentsAllAux?.nombre ?? null
            }
            setModifiedUser({
                ...modifiedUser,
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
                    address: data.address
                };
                
                setModifiedService({
                    ...modifiedService,
                    
                    ...fomattedDataLocations,
                })
            }
        }));
    }

    const handleChangeDistrito=(value:string)=>{
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
            if(modifiedCompany){
                setModifiedCompany({
                    ...modifiedCompany,
                    ...fomattedDataLocation,
                });
            }
            if(modifiedService){
                const fomattedDataLocations = {
                    idUbigeo:districtsAllAux?.id,
                    latitud: data.latitude,
                    longitud: data.longitude,
                    address: data.address
                };
                setModifiedService({
                    ...modifiedService,
                    ...fomattedDataLocations,
                })
            }
            // setFormInitialized(false);
        }));
    }

    const onChangeAddressInput = (value:string) => {
        setSuggestionAccepted(true);
        const departmentAux = departmentsAll.find((department) => department.id.toString() === currentLocationAux.idUbigeo.toString());
        const districtAux = districtsAll.filter((district) => district.idPadre?.toString() === departmentAux?.id.toString());
        const districtByCompany:dataUbigeo | undefined = districtAux.find((district) => district.id.toString() === currentLocationAux.district.value?.toString());
        const splittedValues = value.split(", ");
        const city = departmentAux?.nombre;
        const newAddress = splittedValues[2];
        const changedAddress = buildAddress(city ?? "", districtByCompany ? [districtByCompany] : [], newAddress ?? "");
        setSuggestedValue(changedAddress);
    };

    const buildAddress = (city:string, district:dataUbigeo[], newAdress:string) => {
        const buildedAddress = `${city}, ${district[0]?.nombre}, ${newAdress ||
            ""}`;
        setCurrentLocationAux({
            ...currentLocationAux,
            address: buildedAddress
        });
        // setFormInitialized(false);

        return buildedAddress;
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
                  if(modifiedCompany){
                    setModifiedCompany({
                        ...modifiedCompany,
                        ...fomattedDataLocation,
                      });
                  }
                  if(modifiedService){
                    const fomattedDataLocations = {
                        latitud: data.latitude,
                        longitud: data.longitude,
                        address: data.address
                    };
                    setModifiedService({
                        ...modifiedService,
                        ...fomattedDataLocations,
                    })
                    }
                    // setFormInitialized(false);
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

    const iconCategory = (): string | undefined => {
        const subCategoryService = subCategory.find(
          (subc) => subc?.id == modifiedService?.idCategoria
        );
        if (subCategoryService?.idPadre === 12) {
          if (subCategoryService?.id === 80) {
            return `${imageBaseUrl}mapp_292`;
          }
          return `${imageBaseUrl}mapp_293`;
        }else if(subCategoryService?.idPadre === 11){
            if (subCategoryService?.id === 64) {
                return `${imageBaseUrl}mapp_294`;
              }
              return `${imageBaseUrl}mapp_295`;
        }else if(subCategoryService?.idPadre === 10){
            if (subCategoryService?.id === 79) {
                return `${imageBaseUrl}mapp_296`;
            }else if(subCategoryService?.id === 55){
                return `${imageBaseUrl}mapp_297`;
            }else if(subCategoryService?.id === 56){
                return `${imageBaseUrl}mapp_298`;
            }
            return `${imageBaseUrl}mapp_299`;
        }else if(subCategoryService?.idPadre === 13){
            if (subCategoryService?.id === 82) {
                return `${imageBaseUrl}mapp_300`;
            }
            return `${imageBaseUrl}mapp_301`;
        }
    };
    
    const onMarkerDragEnd = async (event: LatLng) => {
        getGeocoder(event.lat, event.lng,undefined, (data) => {
            setSuggestedValue(data?.address ?? '');
            setSuggestionAccepted(false);
            const fomattedDataLocation = {
                idUbigeo: Number(data?.idUbigeo),
                latitud: data.latitude ?? null,
                longitud: data.longitude ?? 0,
                direccion: data.address ?? null,
                ciudad: data?.department?.label ?? null
            }
            setModifiedUser({
                ...modifiedUser,
                ...fomattedDataLocation
            });
            setCurrentLocationAux({
                idUbigeo: data?.idUbigeo ?? '',
                department: { value: data?.department?.value ?? 0, label: data?.department?.label?? "", quantity: data?.department?.quantity ?? 0 },
                district:{ value: data?.district?.value ?? 0, label: data?.district?.label ?? "", quantity: data?.district?.quantity ?? 0 },
                latitude:data.latitude,
                longitude:data.longitude,
                address: data.address ?? '',
                districtbydepartment:data.districtbydepartment
            })
            if(servicePublishType === "business"){
                const fomattedDataLocations = {
                    idUbigeo:data?.district?.value,
                    latitud: data.latitude,
                    longitud: data.longitude,
                    direccion: data.address
                };
                setModifiedCompany({
                ...modifiedCompany,
                ...fomattedDataLocations,
                })
            }
            if(modifiedService){
                const fomattedDataLocations = {
                    idUbigeo:data?.district?.value,
                    latitud: data.latitude,
                    longitud: data.longitude,
                    address: data.address
                };
                setModifiedService({
                    ...modifiedService,
                    ...fomattedDataLocations,
                })
            }
            // setFormInitialized(false);
        });
    };

    const defaultContainerStyle = {
        width: "100%",
        height: "300px",
    };

return (
    <CustomModal
        open={modal}
        typeSection={servicePublishStep}
        title={service && service?.id ? 'Editar Ubicación': 'Registrar Ubicación'}
        onReturn={onReturn}
        onClose={ResetClose}
        onContinue={handleSubmit(onSubmit)}
        continueText="Guardar y Finalizar"
    >
        <div className="flex flex-col items-center justify-center gap-4 text-gray-900 text-center w-full">
            <h2 className="text-gray-900 text-lg font-medium text-start w-full">Registrar Ubicación</h2>
            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Ciudad y Distrito */}
                <div className="w-full flex justify-center items-start flex-col gap-4 sm:flex-row">
                    {/* Ciudad */}
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
                                className="text-left"
                            />
                        )}
                    />
                    {/* Distrito */}
                    <Controller
                        name="district"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect
                                label="Distrito"
                                name={field.name}
                                value={field.value}
                                onChange={(event: SelectChangeEvent<unknown>) => {
                                    const value = event.target.value as string;
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
                        value={suggestionAccepted ? suggestedValue : currentLocationAux?.address || ""}
                    />
                    <div className="px-2 text-start">
                        {(suggestions.status === "OK" && suggestionAccepted) && (
                            <ul className="bg-white shadow-lg rounded-xl mt-2 border border-gray-200 divide-y divide-gray-100">
                            {renderSuggestions()}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <CustomMap
                        lat={currentLocationAux.latitude}
                        lng={currentLocationAux.longitude}
                        draggable
                        icon={iconCategory()}
                        onMarkerDragEnd={(pos) => onMarkerDragEnd(pos)}
                        activeMarker={true}
                        mapContainerStyle={defaultContainerStyle}
                    />

                </div>
            </form>
        </div>

    </CustomModal>
    );
};

export default ModalLocationInfo;