import { useAppState } from "../../hooks/useAppState";
import CustomButton from "../ui/CustomButtom";
import { useNavigate } from "react-router-dom";
import CustomLink from "../ui/CustomLink";
import CustomSpinnerText from "../ui/CustomSpinerText";

export const HeaderTop = () => {
    const { user,token } = useAppState();
    const navigate = useNavigate();
    return (
        <div className="fixed w-full z-40 ">
            <div className="w-full h-[80px] flex justify-end items-center bg-gradient-custom-primary-v2 px-3 md:px-6 lg:px-12 gap-6">
            
                {token ? ( 
                    user ? (
                        <CustomLink href="/panel/mi-perfil" className="!text-white !text-lg md:!text-xl !font-bold !cursor-pointer">
                            {user.nombres}
                        </CustomLink>
                    ) : (
                        <CustomSpinnerText/>
                    )
                ) : (
                    <>
                        <div className="w-auto h-full flex items-center justify-center">
                            <CustomButton
                                variantType="primary-outline-transparent"
                                type="button"
                                size="medium"
                                className="!text-sm sm:!text-base !capitalize"
                                onClick={() => navigate("/registro")}
                            >
                                Registrate
                            </CustomButton>
                        </div>
                        <div className="w-auto h-full flex items-center justify-center">
                            <CustomButton
                                variantType="primary-outline-white"
                                type="button"
                                size="medium"
                                className="!text-sm sm:!text-base !capitalize"
                                onClick={() => navigate("/iniciar")}
                            >
                                Iniciar Sesión
                            </CustomButton>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
