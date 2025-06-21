import React  from "react";
import { useAppState } from "../../../../../hooks/useAppState";
import { Box, Modal } from "@mui/material";
import CustomImage from "../../../../ui/CustomImage";
import { MdOutlineClose } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import CustomButton from "../../../../ui/CustomButtom";
import { User } from "../../../../../interfaces/user";
import { Option, OrderResponse } from "../../../../../interfaces/order";
import useSnackbar from "../../../../ui/CustomAlert";
import { usePlanes } from "../../../../../hooks/usePlanes";
import { Planes } from "../../../../../interfaces/planes";
import { useGeocoder } from "../../../../../hooks/useGeocoder";
import { useServices } from "../../../../../hooks/useServices";
import { Service } from "../../../../../interfaces/service";
  
declare global {
    interface Window {
      askOrder: (
        amount: number,
        user: User,
        callback: (orderResponse: OrderResponse) => void,
        apiURL: string,
        sk: string
      ) => void;
      setCulqiSettings: (amount: number, orderId: string, planId: number) => void;
      openCulqi: () => void;
      handleUpdate: (planId: number,amount: number) => void;
    }
  }
export {};

const ModalPayOptions: React.FC = () => {
    const { 
        modal, 
        setModal,
        setServicePublishStep,
        setServicePublishType,
        servicePublishType,
        user,
        setService,
        setModifiedService,
        setUser,
        districtsAll,
        departmentsAll,
        setCurrentLocationAux,
        company,
        setModifiedCompany,
        isActiveCompany,
        serviceList,
        setServiceList,
        archiveByService
    } = useAppState();

    const {savePlanes} = usePlanes();
    const {getServiceId} = useServices();

    const apiURL: string = import.meta.env.VITE_API_URL;
    const sk: string = import.meta.env.VITE_APP_SK;

    const { showSnackbar, SnackbarComponent } = useSnackbar();
    const {getGeocoder} = useGeocoder();

    const currentPlanPrice = user?.planes?.[0]?.montoCulqi ?? 0;
    const options: Option[] = [
        {
            title: "¡Plan Clásico!",
            type: "Clásico",
            description: "Aparece con prioridad media y atrae más visitas.",
            priceOne: servicePublishType === "business" ? 59.99 : 24.99,
            price: servicePublishType === "business" 
            ? (user?.planes?.length && user?.planes?.[0]?.montoCulqi < 59.99
                ? 59.99 - user?.planes?.[0]?.montoCulqi
                : 59.99)
            : (user?.planes?.length && user?.planes?.[0]?.montoCulqi < 24.99
                ? 24.99 - user?.planes?.[0]?.montoCulqi
                : 24.99),
            buttonText: user?.planes?.some(p => p.estado === "Activo" && p.nombre === "Clásico" && p.montoCulqi == (servicePublishType === "business" ? 59.99 : 24.99) ) ? "Plan actual" :"Publicar con Plan Clásico",
            features: [
                "Aparece en el mapa por 6 meses",
                "Hasta 2 promociones",
                "Mayor visibilidad",
                "Aparece primero en resultados",
                `${ servicePublishType === "business"? "Cursos de video disponibles": "Cursos de audio disponibles"}`,
                "Publicar máximo hasta 2 Huariques"
            ],
            priceAux: user?.planes?.some(p => p.estado === "Activo") 
            ? (servicePublishType === "business" ? 59.99 : 24.99) - currentPlanPrice 
            : 0
        },
        {
            title: servicePublishType === "business" ?  "¡Plan Básico!" : "¡Plan Gratis!",
            type: servicePublishType === "business" ?  "Básico" : "Gratis",
            description: "Ideal para comenzar.",
            priceOne: servicePublishType === "business" ? 9.99 : "Gratis",
            price: servicePublishType === "business" ?  9.99 : "Gratis",
            buttonText: user?.planes?.some(p => p.estado === "Activo" && p.nombre === (servicePublishType === "business"  ?  "Básico" : "Gratis") && (servicePublishType !== "business" || p.montoCulqi == 9.99)) ? "Plan actual" : "Publicar con Plan Básico",
            features: [
                "Aparece en el mapa por 30 días",
                "1 promoción destacada",
                "Sin prioridad en búsquedas",
                `${ servicePublishType === "business"? "Cursos de video disponibles": "Cursos de audio disponibles"}`,
                "Publicar máximo hasta 1 Huariques"
            ],
            priceAux: user?.planes?.some(p => p.estado === "Activo") 
            ? (servicePublishType === "business" ? 9.99 : 0) - currentPlanPrice 
            : 0
        },
        {
            title: "¡Plan Chévere!",
            type: "Chévere",
            description: "¡La mejor visibilidad!, tendrá máxima prioridad y más exposición.",
            priceOne: servicePublishType === "business" ? 99.99 : 49.99,
            price: servicePublishType === "business"
                ? (user?.planes?.length && user?.planes?.[0]?.montoCulqi < 99.99
                    ? 99.99 - user?.planes?.[0]?.montoCulqi
                    : 99.99)
                : (user?.planes?.length && user?.planes?.[0]?.montoCulqi < 49.99
                    ? 49.99 - user?.planes?.[0]?.montoCulqi
                    : 49.99),

            buttonText: user?.planes?.some(p => p.estado === "Activo" && p.nombre === "Chévere" && p.montoCulqi == (servicePublishType === "business" ? 99.99 : 49.99) ) ? "Plan actual" :"Publicar con Plan Chévere",
            features: [
                "Aparece en el mapa por 1 año",
                "Hasta 3 promociones",
                "Máxima visibilidad",
                "Prioridad en resultados de búsqueda",
                `${ servicePublishType === "business"? "Cursos de video disponibles": "Cursos de audio disponibles"}`,
                "Aparece en el carrusel o sección destacada",
                "Poder subir un video (además de fotos)",
                "Publicar máximo hasta 3 Huariques"
            ],
            priceAux: user?.planes?.some(p => p.estado === "Activo") 
            ? (servicePublishType === "business" ? 99.99 : 49.99) - currentPlanPrice 
            : 0
        }
    ];

    window.handleUpdate=async(planId,amount)=>{

        const plans=[
            { type: "Gratis", id: 1, typeUser: "independiente"},
            { type: "Clásico", id: 2, typeUser: "independiente" },
            { type: "Chévere", id: 3, typeUser: "independiente" },
            { type: "Básico", id: 4, typeUser: "business" },
            { type: "Clásico", id: 5, typeUser: "business" },
            { type: "Chévere", id: 6, typeUser: "business" },
        ]

        const selectPlan= plans.find(p=>p.id === planId && p.typeUser === servicePublishType);

        const previousPlan = user?.planes?.[0];

        let finalAmount = amount;
        if (previousPlan) {
            if (amount < previousPlan.montoCulqi) {
            finalAmount = previousPlan.montoCulqi + amount;
            }
        }

        const nuevoPlan = {
            nombre: selectPlan?.type ?? '',
            montoCulqi: finalAmount,
            estado: "Activo",
            limiteHuarique: selectPlan?.type === "Gratis" ? 1 : selectPlan?.type === "Básico" ? 1 : selectPlan?.type === "Clásico" ? 2 : selectPlan?.type === "Chévere" ? 3 : 1,
            duracion: 0,
            fechaInicio: '',
            fechaFinal: ''
        };

        setUser({
            ...user,
            planes: [nuevoPlan]
        });
        if( isActiveCompany && servicePublishType === "business" && !company){
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
                  getServiceId(Number(archiveByService?.id), (success, data) => {
                    if (success) {
                        const updatedList = serviceList?.map(s =>
                            s.id === archiveByService?.id
                                ? { ...s, idPromociones: data?.idPromociones }
                                : s
                        );
                        setServiceList(updatedList as Service[]);
                    }
                });
              })
        }else{
            setServicePublishStep("finished");
        }
    }

    const handleClickClose=()=>{
        setModal(false);
        setServicePublishStep("typeSelection");
        setServicePublishType("independiente");
        setService(null);
        setModifiedService(null);
    }

    const highlightService = (price:number | string,type: string) => {
        const plans=[
            { type: "Gratis", id: 1, typeUser: "independiente"},
            { type: "Clásico", id: 2, typeUser: "independiente" },
            { type: "Chévere", id: 3, typeUser: "independiente" },
            { type: "Básico", id: 4, typeUser: "business" },
            { type: "Clásico", id: 5, typeUser: "business" },
            { type: "Chévere", id: 6, typeUser: "business" },
        ]

        const selectPlan= plans.find(p=>p.type === type && p.typeUser === servicePublishType);
        const parsedPrice = typeof price === 'string'
            ? parseFloat(parseFloat(price).toFixed(2))
            : parseFloat(price.toFixed(2));

            window?.askOrder(parsedPrice * 100, user as User, (orderResponse) => {
            window.setCulqiSettings(parsedPrice * 100, orderResponse.id,selectPlan?.id ?? 0);
            window.openCulqi();
        }, apiURL, sk);
    };
    const handleClickContinuar = async (price: number | string,type:string , priceOne: number)=>{
        const isPlanActive = user?.planes?.find(p => p.estado === "Activo");
        
        
        const planPriority: Record<string, number> = {
            "Gratis": 0,
            "Básico": 1,
            "Clásico": 2,
            "Chévere": 3
          };
          const activePlanPriority = isPlanActive ? planPriority[isPlanActive.nombre] : -1;
          const newPlanPriority = planPriority[type];
        if ( !isPlanActive || newPlanPriority > activePlanPriority || priceOne > Number(user?.planes?.[0].montoCulqi)) {
            if(options.some(opt=>opt.type===price)){ //GRATIS
                setServicePublishStep("finished");
                const plans=[
                    { type: "Gratis", id: 1, typeUser: "independiente"},
                    { type: "Clásico", id: 2, typeUser: "independiente" },
                    { type: "Chévere", id: 3, typeUser: "independiente" },
                    { type: "Básico", id: 4, typeUser: "business" },
                    { type: "Clásico", id: 5, typeUser: "business" },
                    { type: "Chévere", id: 6, typeUser: "business" },
                ]

                const selectPlan= plans.find(p=>p.type === type && p.typeUser === servicePublishType);

                const dataPlan={
                    PuInterno: 0,
                    PlanInterno: selectPlan?.id,
                    PlanToken: null,
                    PlanMontoCulqi: 0.00,
                }
                // GUARDAR EL PLAN
                await savePlanes(dataPlan as Planes);
                return;
            }else{
                highlightService(price,type);
                  
            }
        }else{
            showSnackbar("¡Ups! Ya estás disfrutando de un buen plan. Si quieres aún más beneficios, elige uno superior.", "error");
        }
    }
    
    return (
        <>
            <Modal open={modal}>
                <Box className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  overflow-auto max-w-full w-full bg-transparent !p-2 xs:!p-8 sm:!px-20 sm:!py-8 md:!p-8 max-h-screen`}>
                    <div className="flex items-center justify-center h-full md:gap-3 lg:gap-7 overflow-hidden gap-[20px] flex-col md:flex-row order-2 md:order-1 ">
                        {options.map((option, index) => (
                            <div className="flex flex-col relative items-center bg-white rounded-[10px] shadow-lg text-center px-[20px] py-[15px] overflow-hidden w-full max-w-[400px] sm:w-[400px] md:w-full" key={index}>
                                <CustomImage
                                    name="logo_01"
                                    alt="logo_01"
                                    className="cursor-pointer w-[150px] sm:w-[180px] lg:w-[180px]"
                                />
                                <div className="absolute top-2 right-2 cursor-pointer align-self-end">
                                    <MdOutlineClose className="h-[28px] w-[28px] transition-transform duration-200 ease-in-out hover:scale-105" onClick={handleClickClose}/>
                                </div>
                                <div className="w-full flex flex-col gap-2 p-0 md:p-0 lg:p-0">
                                    <p className="font-bold text-2xl w-full leading-6 text-gray-900">{option.title}</p>
                                    <p className="font-bold text-gray-700 text-custom-normal mb-[0.415rem] md:mb-0  w-full leading-[1.2] md:h-screen max-h-[50px] text-sm lg:text-base">{option.description}</p>
                                    <p className="font-bold w-full border border-gray-900 font-roboto mb-[0.415rem] bg-white text-custom-primary rounded-lg h-auto sm:h-[60px] flex flex-col items-center justify-center text-2xl sm:text-3xl md:text-2xl lg:text-4xl py-1 sm:py-2">
                                        {servicePublishType === "independiente" && option.type === "Gratis" ? (
                                            option.priceOne
                                        ) : typeof option.priceOne === "number" &&
                                            typeof option.priceAux === "number" &&
                                            user?.planes?.length &&
                                            user?.planes?.[0]?.montoCulqi < option.priceOne ? (
                                            <>
                                            <span className={`${user.planes.length && user.planes[0].nombre != "Gratis" ? '' : 'hidden'} text-sm sm:text-base text-gray-400 line-through`}>
                                                S/. {option.priceOne.toFixed(2)}
                                            </span>
                                            <span className="text-custom-orange font-extrabold text-2xl sm:text-3xl">
                                                S/. {option.priceAux.toFixed(2)}
                                            </span>
                                            </>
                                        ) : (
                                            `S/. ${option.priceOne}`
                                        )}
                                        </p>
                                    <CustomButton
                                        variantType="primary"
                                        type="submit"
                                        size="medium"
                                        isLoading={false}
                                        className="!normal-case !text-base"
                                        onClick={()=>handleClickContinuar(option?.price,option?.type ?? 'null',Number(option?.priceOne))}
                                        disabled={
                                            user?.planes?.some(p =>
                                              p.estado === "Activo" &&
                                              p.nombre === option.type &&
                                              (servicePublishType !== "business" || p.montoCulqi == option.priceOne)
                                            )
                                          }
                                          
                                    >
                                        {option.buttonText}
                                    </CustomButton>
                                    <div className="w-full md:max-h-[310px] md:h-screen lg:h-[230px]">
                                        {option.features && (
                                            <ul className="mt-4 space-y-1 ">
                                                {option.features.map((feature, i) => (
                                                <li key={i} className="flex items-start justify-start gap-1">
                                                    <FaCheckCircle className="text-green-500 min-w-[20px] mt-1" />
                                                    <span className="text-gray-800 leading-snug text-start text-sm ">{feature}</span>
                                                </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                </Box>
            </Modal>
            <SnackbarComponent />
        </>
    )
}
export default ModalPayOptions;