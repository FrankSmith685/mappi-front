import { NoServiceIcon } from "../../../../assets/icons/noServiceIcon";

export const NoServiceFound = () => {
    return (
        <div className="flex items-center justify-center flex-wrap w-full h-full">
            <div className="flex justify-center flex-wrap gap-0">
                <div className="flex justify-center w-full">
                    <NoServiceIcon className="fill-gray-300 xs:h-[150px] xs:w-[150px] w-[130px] h-[130px]" />
                </div>
                <p className="my-[16px] text-center w-[90%] xs:w-[250px] text-gray-300 font-semibold">
                    Tus huariques publicados se mostrarán aquí
                </p>
            </div>
        </div>
    );
};
