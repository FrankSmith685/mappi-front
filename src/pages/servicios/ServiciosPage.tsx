/* eslint-disable react-hooks/exhaustive-deps */
import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ServicesHeader from "../../components/services/ServicesHeader";
const LazyMap = lazy(() => import('../../components/services/type/map'));
const LazyList = lazy(() => import('../../components/services/type/list'));
import { useAppState } from "../../hooks/useAppState";
import { Service } from "../../interfaces/service";
import { useServices } from "../../hooks/useServices";
import useSnackbar from "../../components/ui/CustomAlert";
import CustomButton from "../../components/ui/CustomButtom";
import { FaListUl, FaMapMarkedAlt } from "react-icons/fa";
import ModalOptionSession from "../../components/services/modal/ModalOptionSession";
import ModalOpinion from "../../components/services/modal/ModalOpinion";

const ServiciosPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {getServicesByUbigeo, ObtenerServicios} = useServices();
  const {currentLocationService,setCurrentLocationService,setNavigateCurrentService,navigateCurrentService, setActiveModalOPtionSession ,activeModalOptionSession, activeModalOption, setActiveModalOPtion, currentPositionService, departmentsAll,serviceAll, setSelectedService,selectedService,setServiceActive,serviceActive, setModal, user} = useAppState();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const [containerHeight, setContainerHeight] = useState("calc(100vh - 160px)");

   useEffect(() => {
    const updateHeight = () => {
      const height = window.innerWidth <= 1023 ? "calc(100vh - 80px)" : "calc(100vh - 160px)";
      setContainerHeight(height);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const m = searchParams.get("m");
  const d = searchParams.get("d");
  const s = searchParams.get("s");
  const [localLoading,setLocalLoading]= useState(true);

  const currentLocationServiceData=(services: Service[],servicesNear: Service[],nombre: string ,encodedUbigeo: string)=>{
    const isEmpty = (arr?: Service[]) => !arr || arr.length === 0;
    const hasServices = services && services.length > 0;

    let servicesText = null;
    let servicesNearText = null;
    let finalServices = services as Service[];
    let finalServicesNear = servicesNear as Service[];

    if (isEmpty(servicesNear)) {
      finalServicesNear = [];
      if (hasServices) {
        servicesNearText = `No hay servicios cercanos, mostrando todos los servicios en ${nombre}.`;
          ObtenerServicios(false);
      } else {
        finalServices = [];
        servicesText = "No se encontraron servicios disponibles en esta zona.";
          ObtenerServicios(false);
      }
      
    }
    setCurrentLocationService({
      m,
      d: encodedUbigeo,
      s: s || null,
      services: finalServices,
      loading: false,
      servicesNear: serviceActive ? finalServices : finalServicesNear ,
      servicesText,
      servicesNearText,
    });

    setServiceActive(false);
   
  }

  useEffect(() => {
    if(departmentsAll.length > 0){
      if(currentPositionService.latitud != null && currentPositionService.longitud != null){
        if(currentLocationService.loading && localLoading){
          setLocalLoading(false);
          if (!m && !d && !s) {
          const newUrl = `/servicios?m=${currentLocationService.m}&d=${currentLocationService.d}`;
          const encodedUbigeo = currentLocationService.d;
          navigate(newUrl, { replace: true });
        
          if (encodedUbigeo) {
            const decodedUbigeo = atob(encodedUbigeo);
            getServicesByUbigeo(Number(decodedUbigeo), null, (success, data,dataNear) => {
              if (success) {
                const services= data as Service[];
                const servicesNear = dataNear as Service[];
                const selectDepartamento = departmentsAll.find(dep => dep.id == Number(atob(encodedUbigeo)) )
                
                currentLocationServiceData(services,servicesNear,selectDepartamento?.nombre as string,encodedUbigeo);
                setSelectedService({}); 
              }
            });
            
          }
          return;
        }
          if ((m === "map" || m === "list")) {
            const newUrl = `/servicios?m=${m}&d=${d || currentLocationService.d}${s ? `&s=${s}` : ""}`;
            navigate(newUrl, { replace: true });
            const encodedUbigeo = d || currentLocationService.d;
            if (encodedUbigeo) {
                const decodedUbigeo = atob(encodedUbigeo);
                getServicesByUbigeo(Number(decodedUbigeo), null, (success, data, dataNear) => {
                if (success) {
                  const services= data as Service[];
                  const servicesNear = dataNear as Service[];
                  const selectDepartamento = departmentsAll.find(dep => dep.id == Number(atob(encodedUbigeo)) )
                  currentLocationServiceData(services,servicesNear,selectDepartamento?.nombre as string,encodedUbigeo);
                  const decodedId = atob(String(s));
                  const foundService = services.find(
                    (servicio) => String(servicio?.id) === decodedId.toString()
                  );
                  if (foundService) {
                    setSelectedService(foundService);
                  }
                  return;
                }
              })
            }
          }
        }
      }
    }
  }, [m, d, s, navigate,currentPositionService,currentLocationService.loading,departmentsAll.length]);


  useEffect(()=>{
    if(serviceAll.length == 0){
      ObtenerServicios(true);
    }
  },[navigate,currentPositionService])

  useEffect(()=>{
    if(currentLocationService.servicesText != null){
      showSnackbar(currentLocationService.servicesText.toString(), "warning");
      setCurrentLocationService({
        ...currentLocationService,
        servicesText:null,
      });
    }
  },[currentLocationService.servicesText]);

  useEffect(()=>{
    if(currentLocationService.servicesNearText != null){
      showSnackbar(currentLocationService.servicesNearText.toString(), "info");
      setCurrentLocationService({
        ...currentLocationService,
        servicesNearText:null,
      });
    }
  },[currentLocationService.servicesNearText]);


  const handleClickComparteOpinion=()=>{
    if(!user){
      setActiveModalOPtionSession(true);
      setActiveModalOPtion(false);
      setModal(true);
    }else{
      setActiveModalOPtion(true);
      setActiveModalOPtionSession(false);
      setModal(true);
    }
  }

  const handleClickOptionMapOrList = () => {
    const currentView = searchParams.get("m");
    const distrito = searchParams.get("d");
    const servicio = searchParams.get("s");
    const newView = currentView === "map" ? "list" : "map";
    let newUrl = `/servicios?m=${newView}&d=${distrito}`;
    if (servicio) {
      newUrl += `&s=${servicio}`;
    }
    navigate(newUrl);
  };

  useEffect(() => {
    const isNavigateService = localStorage.getItem("navigateService");

    const locationReady = currentLocationService && !currentLocationService.loading;
    const hasServices = currentLocationService?.servicesNear?.length > 0;

    if (isNavigateService !== null && isNavigateService !== 'null' && locationReady && hasServices) {
        setModal(true);
        setActiveModalOPtion(true);
        setActiveModalOPtionSession(false);
        localStorage.removeItem("navigateService");
      // }
    }
  }, [currentLocationService]);

 useEffect(() => {
    const currentView = searchParams.get("m");
    const distrito = searchParams.get("d");
    const newUrl = `/servicios?m=${currentView}&d=${distrito}`;
    setNavigateCurrentService(newUrl as string);
}, [navigateCurrentService,searchParams, currentLocationService]);


  return(
    <>
      <ServicesHeader/>
      <div className={`w-full h-full`}>
        <Suspense fallback={
          <div className="w-full flex items-center justify-center bg-gray-200 animate-pulse" style={{ height: containerHeight }}>
            <div className="text-center">
              <div className="w-12 h-12 mb-4 mx-auto border-4 border-orange-700 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg font-semibold text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        }>
          {
            m === 'map' ? (
              <div className="w-full relative">
                <LazyMap />
                <div className={`${Object.keys(selectedService).length > 0 ? 'px-4 sm:right-4 lg:right-[435px]' : 'right-0 sm:right-4'} w-full sm:w-auto absolute top-4  flex sm:flex-row flex-col gap-2 sm:gap-4 items-center justify-center`}>
                  <CustomButton variantType="terciary" type="submit" size="medium" className="!max-w-[500px] sm:!w-[285px] !px-2 !text-sm lg:!text-base !leading-5 flex !items-center !justify-center !capitalize !rounded-lg" onClick={handleClickComparteOpinion}>
                    Comparte tu opinion
                  </CustomButton>
                  <CustomButton variantType="terciary" type="submit" size="medium" className=" !max-w-[500px] sm:!w-[285px] !px-2 !text-sm lg:!text-base !leading-5 flex !items-center !justify-center !capitalize !rounded-lg" onClick={handleClickOptionMapOrList}>
                    <FaListUl className="w-4 h-4 mr-2" />
                    Huarique recomendado Lista
                  </CustomButton>
                </div>
              </div>
            ):(
              <div className="w-full relative">
                <LazyList />
                <div className={`${Object.keys(selectedService).length > 0 ? 'px-4 sm:right-4 lg:right-[435px]' : 'right-0 sm:right-4'} w-full sm:w-auto absolute top-4  flex sm:flex-row flex-col gap-2 sm:gap-4 items-center justify-center`}>
                  <CustomButton variantType="terciary" type="submit" size="medium" className="!max-w-[500px] sm:!w-[285px] !px-2 !text-sm lg:!text-base !leading-5 flex !items-center !justify-center !capitalize !rounded-lg" onClick={handleClickComparteOpinion}>
                    Comparte tu opinion
                  </CustomButton>
                  <CustomButton variantType="terciary" type="submit" size="medium" className=" !max-w-[500px] sm:!w-[285px] !px-2 !text-sm lg:!text-base !leading-5 flex !items-center !justify-center !capitalize !rounded-lg" onClick={handleClickOptionMapOrList}>
                    <FaMapMarkedAlt className="w-4 h-4 mr-2" />
                    Huarique recomendado Mapa
                  </CustomButton>
                </div>
              </div>
            )
          }
        </Suspense>
      </div>
      <SnackbarComponent/>
      {/* Modal */}
      {
        activeModalOptionSession && (
          <>
            <ModalOptionSession/>
          </>
        )
      }
      {
        activeModalOption && (
          <>
            <ModalOpinion/>
          </>
        )
      }
      
    </>
  )
};

export default ServiciosPage;
