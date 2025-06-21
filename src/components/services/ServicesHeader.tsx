import CustomImage from "../ui/CustomImage";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../hooks/useAppState";
import { FaBars } from "react-icons/fa";
import CustomInput from "../ui/CustomInput";
import ServicesHeaderFilter from "./SeviceHeaderFilter";
import { useServices } from "../../hooks/useServices";
import { Service } from "../../interfaces/service";
import CustomButton from "../ui/CustomButtom";

const ServicesHeader=()=>{
    const {isSidebarCollapsedService,setIsSidebarCollapsedService,currentLocationService,setCurrentLocationService,setSearchService,searchService} = useAppState();
    const {getServicesByUbigeo} = useServices();
    // const [isSidebarCollapsed,setIsSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    const {user} = useAppState();

    // const [search, setSearch] = useState("");

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
    };


    const handleClickInicio=()=>{
        setCurrentLocationService({
            ...currentLocationService,
            m:'map',
            d:'MTM5Mg==',
            s:null,
            services:[],
            loading:true,
            servicesNear:[],
        });
        navigate("/");
    }

    const handleClickPanelUser=()=>{
        navigate("/panel/mi-perfil")
    }

    return(
        <div className="w-full">
            <div className="w-full h-[80px] bg-white flex justify-center items-center !z-[100] b-white shadow pr-[12px] md:pr-[24px] lg:pr-[48px] md:justify-between">
                <div className={`rounded-br-4xl cursor-pointer md:rounded-br-4xl w-[100px] sm:w-[120px] md:w-[300px] h-full  bg-gradient-custom-primary-v2 flex items-center justify-center`} onClick={handleClickInicio}>
                    <CustomImage
                        name="logo_02"
                        alt="logo_02"
                        className="md:w-[150px] hidden md:flex"
                    />
                    <CustomImage
                        name="logo_04"
                        alt="logo_04"
                        className="w-[50px] md:hidden"
                    />
                </div>
                <div className="flex-1 lg:hidden flex items-center justify-center">
                    {
                        user ? (
                            <h2 className="text-gray-900 text-lg md:text-xl font-bold cursor-pointer hover:underline hover:text-orange-600">
                                {user?.nombres}
                            </h2>
                        ) : (
                            // <CustomSpinnerText/>
                            <div className="gap-1 sm:gap-4 flex sm:flex-row flex-col ">
                                <div className="w-auto h-full flex items-center justify-center">
                                    <CustomButton
                                        variantType="primary-outline"
                                        type="button"
                                        size="medium"
                                        className="!text-sm sm:!text-sm !capitalize !text-custom-primary !h-[30px] sm:!h-[40px]"
                                        onClick={() => navigate("/registro")}
                                    >
                                        Registrate
                                    </CustomButton>
                                </div>
                                <div className="w-auto h-full flex items-center justify-center">
                                    <CustomButton
                                        variantType="primary-outline"
                                        type="button"
                                        size="medium"
                                        className="!text-sm sm:!text-sm !capitalize !text-custom-primary !h-[30px] sm:!h-[40px]"
                                        onClick={() => navigate("/iniciar")}
                                    >
                                        Iniciar Sesión
                                    </CustomButton>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="px-2 lg:px-10 md:w-full md:max-w-[400px] lg:max-w-[500px] hidden lg:flex">
                    <CustomInput
                        name="busqueda"
                        placeholder="Busca tu huarique favorito..."
                        value={searchService}
                        onChange={(e) => setSearchService(e.target.value)}
                        isSearch={true}
                        onSearchClick={handleSearch}
                        size="medium"
                        className="!w-full"
                    />
                </div>
                <div className="w-auto">
                    <div className="hidden lg:flex items-center justify-center gap-[24px]">
                        
                        {
                            user ? (
                            <h2 className="text-gray-900 text-base md:text-xl font-bold cursor-pointer hover:underline hover:text-orange-600" onClick={handleClickPanelUser}>
                                {user?.nombres}
                            </h2>
                            ): (
                                // <CustomSpinnerText/>
                                <div className="flex gap-4">
                                    <div className="w-auto h-full flex items-center justify-center">
                                        <CustomButton
                                            variantType="primary-outline"
                                            type="button"
                                            size="medium"
                                            className="!text-sm sm:!text-sm !capitalize !text-custom-primary"
                                            onClick={() => navigate("/registro")}
                                        >
                                            Registrate
                                        </CustomButton>
                                    </div>
                                    <div className="w-auto h-full flex items-center justify-center">
                                        <CustomButton
                                            variantType="primary-outline"
                                            type="button"
                                            size="medium"
                                            className="!text-sm sm:!text-sm !capitalize !text-custom-primary"
                                            onClick={() => navigate("/iniciar")}
                                        >
                                            Iniciar Sesión
                                        </CustomButton>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className="flex lg:hidden items-center justify-center">
                        <FaBars className="w-9 h-9 text-orange-600 hover:cursor-pointer" onClick={()=>setIsSidebarCollapsedService(!isSidebarCollapsedService)}/>
                    </div>
                </div>
            </div>
            <ServicesHeaderFilter/>
        </div>
    )
}

export default ServicesHeader;