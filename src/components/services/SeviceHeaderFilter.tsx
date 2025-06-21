/* eslint-disable react-hooks/exhaustive-deps */
import { Controller, useForm } from "react-hook-form";
import CustomSelect from "../ui/CustomSelect";
import { SelectChangeEvent } from "@mui/material";
import { useAppState } from "../../hooks/useAppState";
import CustomButton from "../ui/CustomButtom";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomInput from "../ui/CustomInput";
import { useServices } from "../../hooks/useServices";
import { Service } from "../../interfaces/service";
import { useEffect, useState } from "react";
import { SubCategory } from "../../interfaces/subcategory";
import useSnackbar from "../ui/CustomAlert";


const ServicesHeaderFilter = () => {
    const {isSidebarCollapsedService,user, setActiveHuariquePublic , currentLocationService,setCurrentLocationService,departmentsAll, category, subCategory,setSearchService,searchService,districtsAll,serviceAll,setSelectedService} = useAppState();
    const navigate= useNavigate();
    const {getServicesByUbigeo,ObtenerServicios} = useServices();
    const [searchParams] = useSearchParams();
    const d = searchParams.get("d");
    const decodedDistrito = d ? atob(d) : 1392;
    const { control, setValue, watch } = useForm({
      defaultValues: {
        ciudad: decodedDistrito,
        categoria: "",
        subcategoria: "",
      },
    });
    
    const [baseServices, setBaseServices] = useState<Service[]>([]);
    const [allSubCategories, setAllSubCategories] = useState<SubCategory[]>([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);

    const { showSnackbar, SnackbarComponent } = useSnackbar();

    useEffect(() => {
      setAllSubCategories(subCategory);
      setFilteredSubCategories(subCategory);
    }, [subCategory]);

    const [allServices, setAllServices] = useState<Service[]>([]);
    const [allServiceByCategory,setAllServiceByCategory] = useState<Service[]>([])
    
    function obtenerServiciosPromesa() {
      return new Promise((resolve) => {
        ObtenerServicios(false,true,(data) => {
          resolve(data as Service[]);
        });
      });
    }

    async function obtenerCiudadesConConteo() {
    const todosLosServicios = await obtenerServiciosPromesa() as Service[];

    const ciudadesConConteo = departmentsAll.map(cat => {
      const subcategoriasHijas = districtsAll.filter(sub => sub.idPadre === cat.id);
      const idsSubcategorias = subcategoriasHijas.map(sub => Number(sub.id));

      const hayServicioCercano = serviceAll.some(serv =>
        idsSubcategorias.includes(Number(serv.idUbigeo))
      );

      let count = 0;

      if (hayServicioCercano) {
        count = serviceAll.filter(serv =>
          idsSubcategorias.includes(Number(serv.idUbigeo))
        ).length;
      } else {
        count = todosLosServicios.filter(serv =>
          idsSubcategorias.includes(Number(serv.idUbigeo))
        ).length;
      }

      return { ...cat, count };
    });

    return ciudadesConConteo;
  }

  

    const categoriasConConteo = category.map(cat => {
      const subcategoriasHijas = subCategory.filter(sub => sub.idPadre === cat.id);
      const idsSubcategorias = subcategoriasHijas.map(sub => Number(sub.id));
      const count = allServices.filter(service => idsSubcategorias.includes(Number(service.idCategoria))).length;
      return { ...cat, count };
    });
    
    const subCategoriasConConteo = filteredSubCategories.map(subcat => {
      const count = allServiceByCategory.filter(service => Number(subcat.id) == Number(service.idCategoria)).length;

      return { ...subcat, count };
    });

    useEffect(() => {
      if(baseServices.length == 0){
        if (currentLocationService.servicesNear?.length > 0) {
          setAllServices(currentLocationService.servicesNear);
          setBaseServices(currentLocationService.services);
        } else {
          setAllServices(currentLocationService.services);
          setBaseServices(currentLocationService.services);
        }
      }
    }, [currentLocationService.servicesNear, currentLocationService.services,baseServices.length]);

    const handleSearch = () => {
      const encodedUbigeo = currentLocationService.d;
      if (encodedUbigeo) {
        const decodedUbigeo = Number(atob(encodedUbigeo.toString()));
        getServicesByUbigeo(decodedUbigeo, searchService?.toString(),(success,data)=>{
          if(success){
            setCurrentLocationService({
              ...currentLocationService,
              services:data as Service[]
            });
          }
        });
      }
      setValue("categoria", "");
      setValue("subcategoria", "");
      setSelectedService({});
    };
    const selectedCategoria = watch("categoria");

    const handleChangeCiudad = (value: string) => {
      const encodedDistrito = btoa(value);
      const currentParams = new URLSearchParams(window.location.search);
      const m = currentParams.get("m") || "map";
      const s = currentParams.get("s");
      // const newUrl = `/servicios?m=${m}&d=${encodedDistrito}${s ? `&s=${s}` : ""}`;
      const newUrl = `/servicios?m=${m}&d=${encodedDistrito}`;
      if (encodedDistrito) {
        getServicesByUbigeo(Number(value), null ,(success,data,dataNear)=>{
          if(success){
            const services= data as Service[];
            const servicesNear = dataNear as Service[];
            const selectDepartamento = departmentsAll.find(dep => dep.id == Number(value))
            const isEmpty = (arr?: Service[]) => !arr || arr.length === 0;
            const hasServices = services && services.length > 0;

            let servicesText = null;
            let servicesNearText = null;
            let finalServices = services as Service[];
            let finalServicesNear = servicesNear as Service[];

            if (isEmpty(servicesNear)) {
              finalServicesNear = [];
              if (hasServices) {
                servicesNearText = `No hay servicios cercanos, mostrando todos los servicios en ${selectDepartamento?.nombre}.`;
              } else {
                finalServices = [];
                servicesText = "No se encontraron servicios disponibles en esta zona.";
              }
              
            }

            setBaseServices(finalServices);

            setCurrentLocationService({
              m,
              d: encodedDistrito,
              s: s || null,
              services: finalServices,
              loading: false,
              servicesNear: finalServicesNear,
              servicesText,
              servicesNearText,
            });
            setAllServices(servicesNear.length > 0 ? finalServicesNear : finalServices);
            if(servicesNear.length > 0){
              
              ObtenerServicios(true);
              return;
            }else{
              ObtenerServicios(false);
              return;
            }
          }
        });
    }
      navigate(newUrl, { replace: true });
      setValue("ciudad", value);
      setValue("categoria", "");
      setValue("subcategoria", "");
      setSearchService("");
      setSelectedService({});
    };

    const handleChangeCategoria = (value: string) => {
      const selectCategory = category.find((cat) => Number(cat.id) === Number(value));
      const filterSubCategory = allSubCategories.filter(subC => subC.idPadre === selectCategory?.id);
      setFilteredSubCategories(filterSubCategory);
      const encodedUbigeo = currentLocationService.d;
      
      const currentParams = new URLSearchParams(window.location.search);
      const m = currentParams.get("m") || "map";
      const newUrl = `/servicios?m=${m}&d=${encodedUbigeo}`;
      navigate(newUrl, { replace: true });
    
      if (encodedUbigeo) {
        const decodedUbigeo = Number(atob(encodedUbigeo.toString()));
        getServicesByUbigeo(decodedUbigeo, selectCategory?.nombre?.toString(), (success, _data ,dataNear) => {
          if (success) {
            const servicesNear = dataNear as Service[];
              const validateDistrict = districtsAll.filter(dist => dist.idPadre === decodedUbigeo);
              const districtIds = validateDistrict.map(dist => dist.id);
              const validateService = baseServices.some(serv => districtIds.includes(Number(serv.idUbigeo)));
            
            const hasCategoryServicesBase = validateService ? baseServices && baseServices.length > 0 : false;
            const hasNearbyServices = servicesNear && servicesNear.length > 0;
    
            let servicesText: string | null = null;
            let servicesNearText: string | null = null;
    
            const selectDepartamento = departmentsAll.find(dep => Number(dep.id) === decodedUbigeo);

            if(hasCategoryServicesBase){
              if(!hasNearbyServices){
                servicesNearText = `No hay servicios cercanos, mostrando todos los servicios en ${selectDepartamento?.nombre}.`;
                ObtenerServicios(false);
              }else{
                ObtenerServicios(true);
              }
            }else{
              servicesText = "No se encontraron servicios disponibles en esta zona.";
            }
    
            setCurrentLocationService({
              ...currentLocationService,
              d: encodedUbigeo,
              services: hasCategoryServicesBase ? baseServices : [],
              loading: false,
              servicesNear: servicesNear,
              servicesText,
              servicesNearText,
            });
            setAllServiceByCategory(servicesNear.length > 0 ? servicesNear : baseServices);
          }
        });
      }
    
      setValue("subcategoria", "");
      setSearchService("");
      setSelectedService({});
    };
    

    const handleChangeSubcategoria = (value: string) => {
      const encodedUbigeo = currentLocationService.d;
    
      if (encodedUbigeo) {
        const currentParams = new URLSearchParams(window.location.search);
        const m = currentParams.get("m") || "map";
        const newUrl = `/servicios?m=${m}&d=${encodedUbigeo}`;
        navigate(newUrl, { replace: true });
        
        const decodedUbigeo = Number(atob(encodedUbigeo.toString()));
        const filteredServices = allServiceByCategory.filter(
          service => Number(service.idCategoria) === Number(value)
        );

        const hasSubCategoryServicesBase = baseServices && baseServices.length > 0;
        const hasNearbyServices = filteredServices && filteredServices.length > 0;
    
        let servicesText: string | null = null;
        let servicesNearText: string | null = null;

        const selectDepartamento = departmentsAll.find(dep => Number(dep.id) === decodedUbigeo);

        if(hasSubCategoryServicesBase){
          if(!hasNearbyServices){
            servicesNearText = `No hay servicios cercanos, mostrando todos los servicios en ${selectDepartamento?.nombre}.`;
            ObtenerServicios(false);
          }else{
            ObtenerServicios(true);
          }
        }else{
          servicesText = "No se encontraron servicios disponibles en esta zona.";
        }

        setCurrentLocationService({
        ...currentLocationService,
        d: encodedUbigeo,
        services: baseServices,
        loading: false,
        servicesNear: filteredServices,
        servicesText,
        servicesNearText,
        });
      }  
      setSearchService("");
      setSelectedService({});
    };

    const handleClickGoPanel = () => {
      if (user) {
        navigate("/panel/mis-huariques");
        setActiveHuariquePublic(true);
      } else {
        showSnackbar("Debes iniciar sesión para acceder al panel", "warning");
      }
    };


    const [ciudadesConConteo, setCiudadesConConteo] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const cargarCiudades = async () => {
        const ciudades = await obtenerCiudadesConConteo();
        const opciones = ciudades.map(dept => ({
          value: dept.id.toString(),
          label: `${dept.nombre} (${dept.count})`,
        }));
        setCiudadesConConteo(opciones);
      };
      cargarCiudades();
  }, [departmentsAll.length, serviceAll]);

  return (
    <>
      <div
        className={`w-full transition-all duration-300 ease-in-out overflow-hidden flex items-center justify-center ${
          isSidebarCollapsedService ? "max-h-[400px] shadow" : " max-h-0 lg:max-h-[200px]"
        }`}
      >
        <div className={` h-auto lg:h-[80px] bg-white lg:py-0 py-4  lg:border-none  lg:bg-gray-100 w-full px-6 sm:px-10  flex lg:flex-row flex-col justify-center items-center gap-3 !z-[50] b-white lg:justify-between` }>
          <div className="w-full lg:hidden">
              <CustomInput
                  name="busqueda"
                  placeholder="Busca tu huarique favorito..."
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                  isSearch={true}
                  onSearchClick={handleSearch}
                  className="!w-full"
              />
          </div>
          
          <div className="w-full">
            <Controller
              name="ciudad"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Ciudades"
                  name={field.name}
                  value={field.value}
                  onChange={(event: SelectChangeEvent<unknown>) => {
                    const value = event.target.value as string;
                    field.onChange(value);
                    handleChangeCiudad(value);
                  }}
                  options={ciudadesConConteo}
                  className="text-left"
                />
              )}
            />
          </div>

          <div className="w-full">
            <Controller
              name="categoria"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Categoría"
                  name={field.name}
                  value={field.value}
                  onChange={(event: SelectChangeEvent<unknown>) => {
                    const value = event.target.value as string;
                    field.onChange(value);
                    handleChangeCategoria(value);
                  }}
                  options={
                    categoriasConConteo?.map((cate) => {
                      const id = cate?.id?.toString() || '';
                      return {
                        value: id,
                        label: `${cate.nombre} (${cate.count})`,
                      };
                    }) || []
                  }
                  
                  className="text-left"
                />
              )}
            />
          </div>

          <div className="w-full">
            <Controller
              name="subcategoria"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Subcategoría"
                  name={field.name}
                  value={field.value}
                  onChange={(event: SelectChangeEvent<unknown>) => {
                    const value = event.target.value as string;
                    field.onChange(value);
                    handleChangeSubcategoria(value);
                  }}
                  options={
                    subCategoriasConConteo?.map((sub) => {
                      const id = sub?.id?.toString() || '';
                      return {
                        value: id,
                        label: `${sub.nombre} (${sub.count})`,
                      };
                    }) || []
                  }
                  
                  disabled={!selectedCategoria}
                  className="text-left"
                />
              )}
            />
          </div>

          <div className="w-full">
              <CustomButton variantType="primary-v2" type="submit" size="medium" className="!px-2 !text-sm lg:!text-base !leading-5 flex !items-center !justify-center !capitalize !rounded-lg" onClick={handleClickGoPanel}>
                  Publicar huarique
                  <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </CustomButton>
          </div>
        </div>
      </div>
      <SnackbarComponent/>
    </>
  );
};

export default ServicesHeaderFilter;
