import { FaBars } from "react-icons/fa";
import { GoBackMapIcons } from "../../assets/icons/gobackMapIcons";
import { useAppState } from "../../hooks/useAppState";
import CustomImage from "../ui/CustomImage";
import { useNavigate } from "react-router-dom";
import CustomSpinnerText from "../ui/CustomSpinerText";

export const HeaderTop = () => {
    const { user,setIsSidebarCollapsed, isSidebarCollapsed, navigateCurrentService,setSelectedService } = useAppState();
    const navigate = useNavigate();
    const handleClickGoBackMap=()=>{
        if(navigateCurrentService){
            navigate(navigateCurrentService);
            setSelectedService({});
        }else{
            navigate("/servicios?m=map&d=MTM5Mg==")
        }
    }
    return (
        <div className="fixed w-full">
            <div className="w-full h-[80px] bg-white flex justify-center items-center !z-[100] b-white shadow pr-[12px] md:pr-[24px] lg:pr-[48px] md:justify-between">
                <div className={`${isSidebarCollapsed ? '' : 'rounded-br-4xl' } cursor-pointer md:rounded-br-4xl w-[100px] sm:w-[120px] md:w-[300px] h-full  bg-gradient-custom-primary-v2 flex items-center justify-center`} onClick={() => (window.location.href = "/")}>
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
                <div className="flex-1 md:hidden flex items-center justify-center">
                    {
                        user ? (
                            <h2 className="text-gray-900 text-lg md:text-xl font-bold cursor-pointer hover:underline hover:text-orange-600">
                                {user?.nombres}
                            </h2>
                        ) : (
                            <CustomSpinnerText/>
                        )
                    }
                </div>
                <div className="w-auto ">
                    <div className="hidden md:flex items-center justify-center gap-[24px]">
                        {
                            user ? (
                            <h2 className="text-gray-900 text-base md:text-xl font-bold cursor-pointer hover:underline hover:text-orange-600">
                                {user?.nombres}
                            </h2>
                            ): (
                                <CustomSpinnerText/>
                            )
                        }
                        <div onClick={handleClickGoBackMap}>
                            <GoBackMapIcons  className="w-9 h-9  cursor-pointer fill-gray-900 stroke-gray-900 stroke-2 transition-transform duration-300 hover:fill-custom-orange hover:stroke-orange-500 hover:scale-105"/>
                        </div>
                    </div>
                    <div className="flex md:hidden items-center justify-center">
                        <FaBars className="w-9 h-9 text-orange-600 hover:cursor-pointer" onClick={()=>setIsSidebarCollapsed(!isSidebarCollapsed)}/>
                    </div>
                </div>
            </div>
        </div>
    );
};
