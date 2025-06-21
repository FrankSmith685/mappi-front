import { useNavigate } from "react-router-dom";
import CustomButton from "../ui/CustomButtom";
import CustomImage from "../ui/CustomImage";
import { FaChevronRight } from "react-icons/fa";
import { useAppState } from "../../hooks/useAppState";

export const HeaderLeft = () => {
    const {setSelectedService} = useAppState();
    const navigate=useNavigate();

    const handleClickGoService=()=>{
        navigate(`/servicios?m=map&d=${btoa('1392')}`)
        setSelectedService({});
    }

    return (
        <div className="w-full h-full flex justify-center items-center  bg-white lg:rounded-tr-[250px] lg:w-[380px] lg:shadow-2xl flex-col gap-4 px-[50px] pt-[80px] lg:pt-0 lg:fixed !z-50">
            <div className="flex items-center justify-center flex-col ">
                <div className="flex items-center justify-center">
                    <CustomImage
                        name="logo_03"
                        alt="logo_03"
                        className="w-[200px] sm:w-[228px] cursor-pointer"
                    />
                </div>
                <h2 className="font-raphtalia text-gray-900 text-2xl sm:text-3xl -mt-[30px] text-center leading-[1em]">Los mejores huariques estan aquí</h2>
            </div>
            <div className="lg:w-full w-auto ">
                <CustomButton variantType="primary-v2" type="submit" size="medium" className="!px-10 !text-sm sm:!text-base flex !items-center !justify-center !capitalize" onClick={handleClickGoService}>
                        Buscar Comida
                        <FaChevronRight className="w-3 h-3 sm:w-5 sm:h-5 ml-2" />
                </CustomButton>
            </div>
        </div>
    );
};
