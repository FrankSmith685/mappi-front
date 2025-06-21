/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ModalPersonalInfo from "../../../components/panel/options/MisHuariques/modals/ModalPersonalInfo";
import ModalPublishType from "../../../components/panel/options/MisHuariques/modals/ModalPublishType";
import { NoServiceFound } from "../../../components/panel/options/MisHuariques/NoServiceFound";
import CustomButton from "../../../components/ui/CustomButtom";
import { useAppState } from "../../../hooks/useAppState";
import { useServices } from "../../../hooks/useServices";
import { User } from "../../../interfaces/user";
import ModalBusinessInfo from "../../../components/panel/options/MisHuariques/modals/ModalBusinessInfo";
import ModalServiceInfo from "../../../components/panel/options/MisHuariques/modals/ModalServiceInfo";
import ModalLocationInfo from "../../../components/panel/options/MisHuariques/modals/ModalLocationInfo";
import ModalPayOptions from "../../../components/panel/options/MisHuariques/modals/ModalPayOptions";
import ModalFinished from "../../../components/panel/options/MisHuariques/modals/ModalFinished";
import ServiceCard from "../../../components/panel/options/MisHuariques/Cards/serviceCard";
import { Service } from "../../../interfaces/service";
import { FaBullhorn, FaMapMarkedAlt } from "react-icons/fa";
import MiPlan from "../../../components/panel/options/MisHuariques/Plan/MiPlan";
import { usePlanes } from "../../../hooks/usePlanes";
import CustomModal from "../../../components/ui/CustomModal";
import { useGeocoder } from "../../../hooks/useGeocoder";
import { useArchives } from "../../../hooks/useArchives";
import { useUser } from "../../../hooks/useUser";
import { useCompany } from "../../../hooks/useCompany";

const MisHuariques: React.FC = () => {
  const { 
    setModal, 
    setServicePublishStep, 
    setServicePublishType, 
    servicePublishStep,
    setModifiedUser, 
    user, 
    setCurrentLocationAux,
    company,
    setModifiedCompany,
    service,
    setModifiedService,
    serviceList,
    districtsAll,
    departmentsAll,
    setService,
    modal,
    setUser,
    setPlanes,
    setIsActiveCompany,
    archiveByUser,
    archiveByService,
    setServiceList,
    setCompany,
    setArchiveByService,
    setMovieService,
    setLetterService,
    setActiveHuariquePublic,
    activeHuariquePublic
    
  } = useAppState();
  const { servicesByUser, deleteService,getServiceId } = useServices();
  const [loading, setLoading] = useState<boolean>(true);
  const { getPlanes } = usePlanes();
  const [totalInactivo,setTotalInactivo] = useState<number>(0);
  const {getGeocoder} = useGeocoder();
  const {getArchiveByUserOrCompany, getArchiveByServices,getArchiveMovieByService, getArchivePdfByService} = useArchives();
  const {getUser, updateUser} = useUser();
  const {getCompany} = useCompany();


  useEffect(()=>{
    if(user && user.id){
      getPlanes((data) => {
        if(data.length == 0){
          setPlanes(null);
          setUser({
            ...user,
            planes: []
          });
        }else{
          setPlanes(data[0]);
          const nuevoPlan = {
            nombre: data[0].nombre,
            montoCulqi: data[0].montoCulqi,
            estado: data[0].estado,
            limiteHuarique: data[0].limiteHuarique,
            duracion: data[0].duracion,
            fechaInicio: data[0].fechaInicio,
            fechaFinal: data[0].fechaFin
          };
          setUser({
            ...user,
            planes: [nuevoPlan]
          });
        }
      })
    }
  },[user?.id,modal]);

  useEffect(()=>{
    if(user && user.id){
      servicesByUser(true, (success,data, message, totalServices) => {
        if (success) {
          if(data && totalServices){
            const inactiveServices = data?.filter(is=>is.esActivo === "false");
            if(inactiveServices.length > 0){
              setTotalInactivo(inactiveServices?.length);
            }
          }
          setLoading(false);
        }else{
          console.error("Error obteniendo servicios:", message);
        }
      })
    }
  },[user?.id,modal]);

  useEffect(()=>{
    if(user && user.id){
      if(!user.capacitacionEsHabilitado && user.planes && user.planes?.length > 0){
        if(company){
          const dataUser={
            capacitacionEsHabilitado:true,
            capacitacionTipo:"video"
          }
          updateUser(dataUser)
        }else{
          const dataUser={
            capacitacionEsHabilitado:true,
            capacitacionTipo:"audio"
          }
          updateUser(dataUser)
        }
      }
    }
  },[user?.id,modal])

  const handleClickPublic = () => {
    setArchiveByService({
      service:[],
      id:0,
      isLoading:true
    })
    setMovieService(null);
    setLetterService(null);
    if(company){
      getArchiveByUserOrCompany(Number(company?.idLogo),Number(company?.idPortada),"Empresas");
      setServicePublishType("business");
        if(user?.planes && user?.planes?.length > 0){
          if(user?.planes?.some(p => serviceList && serviceList?.length < p.limiteHuarique)){
            setModal(true);
            setServicePublishStep("personalInfo");
            const district = districtsAll.find((d)=>d.id === company?.idUbigeo);
            const department = departmentsAll.find((d) => d.id === district?.idPadre)
            const districtsAllAux = districtsAll.filter((d)=>d.idPadre === department?.id);
  
            const fomattedDataLocationAux = {
              idUbigeo: department?.id.toString() ?? '0',
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
              latitude: company?.latitud ?? 0,
              longitude: company?.longitud ?? 0,
              address: company?.direccion ?? "",
              districtbydepartment: districtsAllAux,
            };
            
            setCurrentLocationAux(fomattedDataLocationAux);
            
            const fomattedDataLocation = {
              idUbigeo: department?.id ? department?.id : 1392,
              latitud: company?.latitud,
              longitud: company?.longitud,
              direccion: company?.direccion,
              ciudad: department?.nombre ?? null
            };
            setModifiedUser({
              ...user as User,
              ...fomattedDataLocation as User
            });
            if(!service){
              const fomattedDataLocation = {
                idUbigeo:company?.idUbigeo,
                latitud: company?.latitud ?? 0,
                longitud: company?.longitud ?? 0,
                address: company?.direccion ?? null,
                horario: "00:00 - 01:00",
                tieneDelivery:false,
              };
              setModifiedService({
                ...fomattedDataLocation,
              })
            }
          }
        }else{
          setModal(true);
          setServicePublishStep("personalInfo");
          const district = districtsAll.find((d)=>d.id === company?.idUbigeo);
            const department = departmentsAll.find((d) => d.id === district?.idPadre)
            const districtsAllAux = districtsAll.filter((d)=>d.idPadre === department?.id);
  
            const fomattedDataLocationAux = {
              idUbigeo: department?.id.toString() ?? '0',
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
              latitude: company?.latitud ?? 0,
              longitude: company?.longitud ?? 0,
              address: company?.direccion ?? "",
              districtbydepartment: districtsAllAux,
            };
            
            setCurrentLocationAux(fomattedDataLocationAux);
            
            const fomattedDataLocation = {
              idUbigeo: department?.id ? department?.id : 1392,
              latitud: company?.latitud,
              longitud: company?.longitud,
              direccion: company?.direccion,
              ciudad: department?.nombre ?? null
            };
            setModifiedUser({
              ...user as User,
              ...fomattedDataLocation as User
            });
            if(!service){
              const fomattedDataLocation = {
                idUbigeo:company?.idUbigeo,
                latitud: company?.latitud ?? 0,
                longitud: company?.longitud ?? 0,
                address: company?.direccion ?? null,
                horario: "00:00 - 01:00",
                tieneDelivery:false,
              };
              setModifiedService({
                ...fomattedDataLocation,
              })
            }
        }
    }else{ //No tiene Empresa
      getArchiveByUserOrCompany(Number(user?.imgPerfil),Number(user?.imgPortada),"Usuarios");
      setServicePublishType("independiente");
      if(totalInactivo == 0 && serviceList?.length == 0){
        setModal(true);
        setServicePublishStep("typeSelection");
        const storedLocation = localStorage.getItem("currentLocation");
        if (storedLocation) {
          const parsed = JSON.parse(storedLocation);
          const fomattedDataLocation = {
            idUbigeo: parsed.idUbigeo ? parseInt(parsed.idUbigeo) : 1392,
            latitud: parsed.latitude ?? 0,
            longitud: parsed.longitude ?? 0,
            direccion: parsed.address ?? null,
            ciudad: parsed.department?.label ?? null
          };
          setModifiedUser({
            ...user as User,
            ...fomattedDataLocation as User
          });
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
        }
      }
      else{ //Ya existe servicios inactivos
        if(user?.planes && user?.planes?.length > 0){
          if(user?.planes?.some(p => serviceList && serviceList?.length < p.limiteHuarique)){
            setModal(true);
            setServicePublishStep("personalInfo");
            const storedLocation = localStorage.getItem("currentLocation");
            if (storedLocation) {
                const parsed = JSON.parse(storedLocation);
                const fomattedDataLocation = {
                  idUbigeo: parsed.idUbigeo ? parseInt(parsed.idUbigeo) : 1392,
                  latitud: parsed.latitude ?? 0,
                  longitud: parsed.longitude ?? 0,
                  direccion: parsed.address ?? null,
                  ciudad: parsed.department?.label ?? null
                };
                
                setModifiedUser({
                  ...user as User,
                  ...fomattedDataLocation as User
                });
                setCurrentLocationAux(parsed);
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
          }
        }else{
          setModal(true);
          setServicePublishStep("personalInfo");
          const storedLocation = localStorage.getItem("currentLocation");
            if (storedLocation) {
                const parsed = JSON.parse(storedLocation);
                const fomattedDataLocation = {
                  idUbigeo: parsed.idUbigeo ? parseInt(parsed.idUbigeo) : 1392,
                  latitud: parsed.latitude ?? 0,
                  longitud: parsed.longitude ?? 0,
                  direccion: parsed.address ?? null,
                  ciudad: parsed.department?.label ?? null
                };
                
                setModifiedUser({
                  ...user as User,
                  ...fomattedDataLocation as User
                });
                setCurrentLocationAux(parsed);
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
        }
      }
    }
    setActiveHuariquePublic(false);
  };

  useEffect(()=>{
    if(activeHuariquePublic){
      handleClickPublic();
    }
  },[activeHuariquePublic,loading]);

  const handleEditService=(id: number)=>{
    const serviceSelect = serviceList?.find((s)=>s.id == id);
    const district = districtsAll.find((d)=>d.id === serviceSelect?.idUbigeo);
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
      latitude: serviceSelect?.latitud ?? 0,
      longitude: serviceSelect?.longitud ?? 0,
      address: serviceSelect?.direccion ?? "",
      districtbydepartment: districtsAllAux,
    };

    const fomattedDataLocation = {
      idUbigeo: department?.id,
      latitud: serviceSelect?.latitud ?? 0,
      longitud: serviceSelect?.longitud ?? 0,
      direccion: serviceSelect?.direccion ?? "",
      ciudad: department?.nombre
    };
    setModifiedUser({
      ...user,
      ...fomattedDataLocation
    });

    setCurrentLocationAux(fomattedDataLocationAux);
    
    setModifiedService(serviceSelect as Service);
    setService(serviceSelect as Service);
    const ids = serviceSelect?.idPromociones
    ?.split(',')
    .map(id => Number(id))
    .filter(id => !isNaN(id));
    getArchiveByServices(ids ?? [], serviceSelect as Service);
    getArchiveMovieByService(Number(serviceSelect?.idVideoPromocion),serviceSelect as Service);
    getArchivePdfByService(Number(serviceSelect?.idPdfCarta),serviceSelect as Service);
    setModal(true);
    setServicePublishStep("personalInfo");
    if(company){
      getArchiveByUserOrCompany(Number(company?.idLogo),Number(company?.idPortada),"Empresas");
      setModifiedCompany(company);
      setServicePublishType("business");
    }else{
      getArchiveByUserOrCompany(Number(user?.imgPerfil),Number(user?.imgPortada),"Usuarios");
      setServicePublishType("independiente");
    }
  }

  useEffect(()=>{
      if(!archiveByUser?.independent?.isLoading){
        getUser((data) => {
          setUser({
              ...user,
              imgPerfil: data.imgPerfil,
              imgPortada: data.imgPortada 
          })
      });
    }
  },[user?.imgPerfil, user?.imgPortada,archiveByUser?.independent?.isLoading])

  useEffect(()=>{
    if(company){
      getUser();
    }
  },[company])

  useEffect(()=>{
    if(!archiveByUser?.company?.isLoading){
      getCompany((data) => {
        setCompany({
            ...company,
            idLogo: data.idLogo,
            idPortada: data.idPortada
        })
    });
  }
},[company?.idLogo, company?.idPortada,archiveByUser?.company?.isLoading])


useEffect(()=>{
  if(!archiveByService?.isLoading && archiveByService?.id){
    getServiceId(Number(archiveByService?.id), (success, data) => {
      if (success) {
          const updatedList = serviceList?.map(s =>
              s.id === archiveByService?.id
                  ? { ...s, idPromociones: data?.idPromociones, idVideoPromocion:data?.idVideoPromocion,idPdfCarta:data?.idPdfCarta }
                  : s
          );
          setServiceList(updatedList as Service[]);
      }
    });
  }
},[service?.idPromociones,archiveByService?.isLoading])

  const handleDestacarService=()=>{
    if(company){
      setServicePublishType("business");
      setUser(
        {
          ...user,
          tieneEmpresa:true,
        }
      )
    }else{
      setServicePublishType("independiente");
      setUser(
        {
          ...user,
          tieneEmpresa:true,
        }
      )
    }
    setModal(true);
    setServicePublishStep("payOptions");
  }
  const [modaDelete,setModalDelete] = useState(false);
  const [idService,setIdService] = useState(0);
  const handleDeleteService=(id:number)=>{
    setModalDelete(true);
    setIdService(id);
  }

  const handleConfirmDelete=()=>{
    deleteService(idService);
    setModalDelete(false);
  }

  const handleDeleteCancel=()=>{
    setModalDelete(false);
    setIdService(0);
  }

  const handleClickUpdateCompany=()=>{
    const plans=[
      { type: "Básico", id: 4, typeUser: "business",precio:9.99 },
      { type: "Clásico", id: 5, typeUser: "business",precio:59.99 },
      { type: "Chévere", id: 6, typeUser: "business",precio:99.99 },
    ]
    if(plans.some(p=>p.type === user?.planes?.[0].nombre && p.precio === user?.planes?.[0]?.montoCulqi)){
      getGeocoder(user?.latitud, user?.longitud,undefined, (data) => {
        const district = districtsAll.find((d)=>d.id === data?.district?.value);
        const department = departmentsAll.find((d) => d.id === district?.idPadre)
        const districtsAllAux = districtsAll.filter((d)=>d.idPadre === department?.id);

        const fomattedDataLocationAux = {
          idUbigeo: department?.id.toString() ?? '0',
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
          latitude: user?.latitud ?? 0,
          longitude: user?.longitud ?? 0,
          address: user?.direccion ?? "",
          districtbydepartment: districtsAllAux,
        };
        setCurrentLocationAux(fomattedDataLocationAux);
        
        if(!company){
          const fomattedDataLocation = {
            idUbigeo:fomattedDataLocationAux?.district.value,
            latitud: fomattedDataLocationAux.latitude ?? 0,
            longitud: fomattedDataLocationAux.longitude ?? 0,
            direccion: fomattedDataLocationAux.address ?? null,
          };
          setModifiedCompany({
            ...fomattedDataLocation,
          })
        }
        setServicePublishStep("businessInfo");
        setModal(true);
        setServicePublishType("business");
        setIsActiveCompany(true);
        
        getServiceId(Number(archiveByService?.id), (success, data) => {
            if (success) {
                const updatedList = serviceList?.map(s =>
                    s.id === archiveByService?.id
                        ? { ...s, idPromociones: data?.idPromociones, idVideoPromocion:data?.idVideoPromocion,idPdfCarta:data?.idPdfCarta }
                        : s
                );
                setServiceList(updatedList as Service[]);
            }
        });
      })
    }else{
      setModal(true);
      setServicePublishType("business");
      setServicePublishStep("payOptions");
      setIsActiveCompany(true);
    }
  }

  const [selectedTab, setSelectedTab] = useState<"huariques" | "plan">("huariques");

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="py-6 px-4 flex flex-col gap-6 w-full max-w-[85%] sm:max-w-[70%]">
        {loading && user?.id!= 0 ? (
          <div className="h-10 w-64 bg-gray-300 rounded animate-pulse mx-auto"></div>
        ) : (
          <h1 className="text-transparent bg-clip-text text-3xl sm:text-4xl font-bold text-center w-full bg-gradient-custom-primary">
            Mis Huariques
          </h1>
        )}
        {loading && user?.id!= 0 ? (
          <div className="h-4 w-80 bg-gray-300 rounded animate-pulse mx-auto"></div>
        ) : (
          <p className=" text-base md:text-lg text-gray-700 text-center">
            Administra y actualiza la información de tu huarique fácilmente.
          </p>
        )}
      </div>

      <div className="w-full max-w-5xl mx-auto">
        {
          (user?.planes && user?.planes?.length > 0) && (
            <div className="relative flex justify-center items-center mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-full p-1 flex gap-2 sm:gap-4 shadow-inner relative">
                <div
                  className={`absolute top-1 bottom-1 rounded-full bg-custom-primary transition-all duration-300 ease-in-out z-0 ${
                    selectedTab === "huariques"
                      ? "left-1 right-[calc(50%-0.25rem)]"
                      : "left-[calc(50%+0.25rem)] right-1"
                  }`}
                />

                <button
                  onClick={() => setSelectedTab("huariques")}
                  className={`relative z-10 px-4 hover:cursor-pointer py-2 min-w-[120px] flex items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                    selectedTab === "huariques"
                      ? "text-white"
                      : "text-custom-primary hover:text-orange-600"
                  }`}
                >
                  Mis huariques
                </button>
                <button
                  onClick={() => setSelectedTab("plan")}
                  className={`relative z-10 px-4 hover:cursor-pointer py-2 min-w-[120px] flex items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                    selectedTab === "plan"
                      ? "text-white"
                      : "text-custom-primary hover:text-orange-600"
                  }`}
                >
                  Mi Plan
                </button>
              </div>
            </div>
          )
        }
        
        {selectedTab === "huariques" && (
          <>
            <div className={`${(totalInactivo > 0 || serviceList && serviceList.length > 0) && !company ? 'md:flex-row' : 'sm:flex-row'} w-full flex flex-col  justify-between items-center px-6 md:px-12 lg:px-20 gap-6`}>
              {loading && user?.id != 0 ? (
                <div className="h-6 w-48 bg-gray-300 rounded animate-pulse"></div>
              ) : (
                <h2 className="text-xl lg:text-2xl font-bold text-custom-primary underline">
                  Restaurante Digital
                </h2>
              )}
              <div className="!w-auto">
                {loading && user?.id != 0 ? (
                  <div className="h-10 w-40 bg-gray-300 rounded animate-pulse"></div>
                ) : (
                  <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
                    {
                      (totalInactivo > 0 || serviceList && serviceList.length > 0) &&  !company &&
                      <>
                        {
                          user?.planes && user?.planes.some(p=>p.estado == "Activo") &&
                          <CustomButton
                            variantType="terciary"
                            type="submit"
                            size="small"
                            isLoading={false}
                            className="!w-auto !px-10 !text-base !leading-4 !capitalize transition-all duration-300 transform hover:scale-105 !text-white"
                            onClick={handleClickUpdateCompany}
                          >
                            Actualizar Empresa
                          </CustomButton>
                        }
                      </>
                    }
                    <CustomButton
                      variantType="primary"
                      type="submit"
                      size="small"
                      isLoading={false}
                      className="!w-auto !px-10 !text-base !leading-4 !capitalize transition-all duration-300 transform hover:scale-105"
                      onClick={handleClickPublic}
                      disabled={
                        !serviceList || serviceList.length === 0
                          ? false
                          : !user?.planes || user?.planes.length === 0
                            ? true
                            : !user.planes.some(p => serviceList.length < p.limiteHuarique)
                      }
                      
                    >
                      Publicar huarique
                    </CustomButton>
                  </div>
                )}
              </div>
              
            </div>
            <div className="w-full px-6 md:px-12 lg:px-20 py-[24px]"> 
              {serviceList && serviceList?.length > 0 ? (<div className="space-y-3">
                <>
                  {
                    user?.planes?.length === 0 || (user?.planes && user?.planes.some(p=>p.estado != "Activo") ) ?
                    <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-yellow-100 border border-yellow-300 rounded-2xl p-4 sm:p-5 mb-4 shadow-lg animate-fade-in hover:shadow-xl transition-shadow duration-300">
                      <div className="flex-shrink-0 text-4xl sm:text-5xl text-yellow-600 animate-bounce-slow">
                        <FaMapMarkedAlt />
                      </div>
                      <div className="flex flex-col items-center sm:items-start text-center sm:text-left text-yellow-800">
                        <p className="text-sm sm:text-base font-medium mb-1 sm:mb-2">
                          <span className="underline decoration-yellow-400 decoration-2">Tu huarique</span> aún no está en el mapa.
                        </p>
                        <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-base sm:text-lg font-semibold text-yellow-700 animate-pulse">
                          <FaBullhorn className="text-lg sm:text-xl" />
                          <span>¡Activa un plan y hazlo visible!</span>
                        </div>
                      </div>
                    </div>:<></>
                  }
                  {
                    user?.planes?.some(p => p.estado === "Activo" && p.limiteHuarique < serviceList.length) &&
                    <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-red-100 border border-red-300 rounded-2xl p-4 sm:p-5 mb-4 shadow-lg animate-fade-in hover:shadow-xl transition-shadow duration-300">
                      <div className="flex-shrink-0 text-4xl sm:text-5xl text-red-600 animate-bounce-slow">
                        <FaMapMarkedAlt />
                      </div>
                      <div className="flex flex-col items-center sm:items-start text-center sm:text-left text-red-800">
                        <p className="text-sm sm:text-base font-medium mb-1 sm:mb-2">
                          <span className="underline decoration-red-400 decoration-2">Has alcanzado el límite de huariques</span> permitidos por tu plan.
                        </p>
                        <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-base sm:text-lg font-semibold text-red-700 animate-pulse">
                          <FaBullhorn className="text-lg sm:text-xl" />
                          <span>¡Actualiza tu plan para agregar más!</span>
                        </div>
                      </div>
                    </div>
                  }
                </>
                {serviceList?.map((serviceL) => (
                  <ServiceCard
                    key={serviceL.id}
                    id={serviceL?.id ?? 0}
                    nombre={serviceL.nombre ?? ''}
                    descripcion={serviceL.nombreServicio ?? ''}
                    idPromociones={serviceL.idPromociones ?? ''}
                    onEdit={(id) => handleEditService(id)}
                    onDelete={(id) => handleDeleteService(id)}
                    onFeature={handleDestacarService}
                  />
                ))}
              </div>):(<>
                <div className="flex justify-center items-center w-full h-full">
                  {loading && user?.id != 0 ? (
                    <div className="h-64 w-full max-w-[90%] sm:max-w-[70%] bg-gray-300 rounded animate-pulse"></div>
                  ) : (
                    <NoServiceFound />
                  )}
                </div>
              </>)
              }
            </div>
          </>
        )}

        {selectedTab === "plan" && (
          <div className=" px-[12px] sm:0px">
            <MiPlan/>
          </div>
          
        )}
      </div>

      {/* Modal */}
      {servicePublishStep === "typeSelection" && <ModalPublishType />}
      {servicePublishStep === "personalInfo" && <ModalPersonalInfo />}
      {servicePublishStep === "businessInfo" && <ModalBusinessInfo />}
      {servicePublishStep === "serviceInfo" && <ModalServiceInfo />}
      {servicePublishStep === "serviceLocation" && <ModalLocationInfo />}
      {servicePublishStep === "payOptions" && <ModalPayOptions />}
      {servicePublishStep === "finished" && <ModalFinished />}

      <CustomModal
        open={modaDelete}
        typeSection="null"
        title="¿Estás seguro eliminar?"
        onClose={handleDeleteCancel}
        onContinue={handleConfirmDelete}
        continueText="Confirmar"
      >
        <div className="flex flex-col items-center justify-center gap-4 text-gray-900 text-center w-full">
          <p className="w-full text-gray-800">Esta acción eliminará el servicio. ¿Deseas continuar?</p>
        </div>
      </CustomModal>

    </div>
  );
};

export default MisHuariques;
