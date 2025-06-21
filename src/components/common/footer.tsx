import CustomImage from "../ui/CustomImage";
import CustomLink from "../ui/CustomLink";


export const Footer: React.FC = () => {
    return (
        <footer
            className="w-full flex flex-col items-center justify-center pt-3 bg-gradient-custom-primary"
        >
            <div className="w-full h-full flex items-center justify-center px-5">
                <CustomImage
                    name="logo_02"
                    alt="logo_02"
                    className="w-full h-40 object-contain"
                />
            </div>
            <hr className="w-[90%] md:w-[95%] my-3 border-gray-300" />
            <div className="w-full flex flex-col md:flex-row items-center justify-between px-5 md:px-10 gap-2 md:gap-4 pb-2">
                <p className="text-sm md:text-base text-center md:text-left !text-gray-900">
                    © Copyright 2023 mappi.pe
                </p>

                <div className="text-sm md:text-base text-center md:text-right ">
                    <CustomLink href="/terminos-condiciones-de-uso" className="!text-gray-900 !text-sm md:!text-base">Términos y condiciones de uso</CustomLink>
                </div>
            </div>
        </footer>
    );
};
