/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import HomePage from "../pages/home/HomePage";
import ForgotPage from "../pages/auth/ForgotPage";
import ProtectedRoute from "./ProtectedRoute";
import PanelPage from "../pages/panel/PanelPage";
import PublicRoute from "./PublicRoute";
import NotFoundPage from "../pages/404/NotFoundPage";
import { useEffect, useRef } from "react";
import { useUser } from "../hooks/useUser";
import { useAppState } from "../hooks/useAppState";
import { useUbigeo } from "../hooks/useUbigeo";
import useLocationUbigeo from "../hooks/useCurrentLocation";
import { useGeocoder } from "../hooks/useGeocoder";
// import { useJsApiLoader } from "@react-google-maps/api";
import { useCompany } from "../hooks/useCompany";
import { useCategory } from "../hooks/useCategory";
import { useSubCategories } from "../hooks/useSubCategories";
import { useServices } from "../hooks/useServices";
import ServiciosPage from "../pages/servicios/ServiciosPage";
import UpdatePasswordPage from "../pages/auth/UpdatePassword";
import TerminosCondiciones from "../pages/legal/TerminosCondiciones";
import AdminRoute from "./AdminRoute";
import AdminPage from "../pages/admin/AdminPage";

const AppRouter = () => {
  const { getUser } = useUser();
  const { getCompany } = useCompany();
  const {token,departmentsAll,districtsAll,setCurrentPositionService, category, subCategory} = useAppState();
  
  const {getDepartmentsAll, getDistrictsAll} = useUbigeo();
  const { permission,location, error } = useLocationUbigeo();
  const {getGeocoder} = useGeocoder();
  const {getCategory} = useCategory();
  const {getSubCategory} = useSubCategories();
  const {servicesByUser} = useServices();
  
  useEffect(() => {
    getUser();
    getCompany();
    servicesByUser(false);
  }, [token]);

  useEffect(() => {
    const loadDataDepartments = async () => {
      await getDepartmentsAll();
      
    };
    if(departmentsAll.length == 0){
      loadDataDepartments();
    }
  }, [departmentsAll.length]);

  useEffect(()=>{
    const loadDataDistricts = async () => {
      await getDistrictsAll();
    }
    if(districtsAll.length == 0){
      loadDataDistricts();
    }
  },[districtsAll.length]);

  useEffect(()=>{
    const loadDataCategory = async () => {
      await getCategory();
    }
    if(category.length == 0){
      loadDataCategory();
    }
  },[category.length])

  useEffect(()=>{
    const loadDataSubCategory = async () => {
      await getSubCategory();
    }
    if(subCategory.length == 0){
      loadDataSubCategory();
    }
  },[subCategory.length])


  const lastPermission = useRef<PermissionState | null>(null);

  useEffect(() => {
    if( permission != "granted"){
      getGeocoder(-12.0464, -77.0428);
    }
    if (location && lastPermission.current !== permission) {
      lastPermission.current = permission;
      if (!error && permission === "granted") {
        getGeocoder(location.lat, location.lon);
      }
    }
  }, [permission, location, departmentsAll.length,districtsAll]); 

  useEffect(() => {
  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0,
  };

  let initialPositionFetched = false;

  const getInitialPosition = () => {
    if (initialPositionFetched) return;
    initialPositionFetched = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPositionService({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error al obtener ubicación inicial:", error);
        if (error.code === 1) console.error("Permiso denegado");
        if (error.code === 2) console.error("Posición no disponible");
        if (error.code === 3) console.error("Tiempo de espera agotado");
      },
      geoOptions
    );
  };

  getInitialPosition();

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      setCurrentPositionService({
        latitud: position.coords.latitude,
        longitud: position.coords.longitude,
      });
    },
    (error) => {
      console.error("Error en watchPosition:", error);
      getInitialPosition();
    },
    geoOptions
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}, []);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas (siempre accesibles) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/terminos-condiciones-de-uso" element={<TerminosCondiciones />} />

        {/* Rutas solo para NO autenticados */}
        <Route element={<PublicRoute />}>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/iniciar" element={<LoginPage />} />
          <Route path="/recuperar" element={<ForgotPage />} />
          <Route path="/actualizar-contrasena" element={<UpdatePasswordPage />} />
          <Route path="/registro" element={<RegisterPage />} />
        </Route>

        {/* Rutas protegidas (solo para autenticados) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/panel" element={<PanelPage />} />
          <Route path="/panel/:option" element={<PanelPage />} />
        </Route>

        {/* Ruta de Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/panel-admin" element={<AdminPage />} />
          <Route path="/panel-admin/:option" element={<AdminPage />} />
        </Route>


        {/* Rutas de Servicios */}
        <Route path="/servicios" element={<ServiciosPage />} />

        {/* Página 404 para rutas inexistentes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
