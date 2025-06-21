import { useLocation, useNavigate } from "react-router-dom";
import CustomImage from "../ui/CustomImage";

export const AuthHeader = () => {
  const location = useLocation();
  const isRegistro = location.pathname === "/registro";

  const navigate=useNavigate();

  return (
    <div
      className={` w-full h-[80px]  flex justify-center items-center z-50 ${
        isRegistro ? "bg-white" : "bg-gradient-custom-primary lg:h-full lg:rounded-tr-[200px] lg:w-[53%]"
      }`}
    >  
      <div onClick={()=>navigate("/")}>
        <CustomImage
          name={`${isRegistro ? 'logo_01' : 'logo_02'}`}
          alt="Ejemplo de imagen optimizada"
          className={` w-[120px] cursor-pointer ${!isRegistro ? 'lg:w-[250px]': 'w-[140px] md:w-[180px]'}`}
        />
      </div>
    </div>
  );
};
