import { useParams, useNavigate } from "react-router-dom";
import { JSX, useEffect } from "react";
import { HeaderTop } from "../../components/panel/HeaderTop";
import { HeaderLeft } from "../../components/panel/HeaderLeft";
import { useAppState } from "../../hooks/useAppState";
import MiPerfil from "./options/MiPerfil";
import MisHuariques from "./options/MisHuariques";
import Capacitacion from "./options/Capacitacion";

// Definir las opciones disponibles
const options = ["mi-perfil", "mis-huariques","capacitacion"] as const;
type OptionType = (typeof options)[number];

const components: Record<OptionType, JSX.Element> = {
  "mi-perfil": <MiPerfil />,
  "mis-huariques": <MisHuariques />,
  "capacitacion": <Capacitacion/>
};

const PanelPage = () => {
  const { option } = useParams();
  const navigate = useNavigate();
  const { isSidebarCollapsed, setIsSidebarCollapsed,scrollRef } = useAppState();

  const validOption = options.includes(option as OptionType)
    ? (option as OptionType)
    : "mi-perfil";

  useEffect(() => {
    if (!option || !options.includes(option as OptionType)) {
      navigate("/panel/mi-perfil", { replace: true });
    }
  }, [option, navigate]);



  return (
    <div className="w-full flex flex-col relative" ref={scrollRef}>
      <div className="w-full relative flex items-start justify-center !z-[100]">
        <HeaderTop />
      </div>

      <div className="flex w-full relative">
        <div className="absolute top-0 left-0 pt-[80px] h-full z-50 ">
          <div className="fixed h-full">
          <HeaderLeft />
          </div>
          
        </div>
        <div className={`${!isSidebarCollapsed ? 'pl-[0px] md:pl-[120px]' : 'pl-[0] md:pl-[120px]'} pt-[80px] h-full flex-grow relative `}>
          {isSidebarCollapsed && (
            <div
              className="fixed inset-0 bg-black opacity-10 z-40 md:hidden"
              onClick={() => setIsSidebarCollapsed(false)}
            ></div>
          )}
          {components[validOption]}
        </div>
      </div>
    </div>
  );
};

export default PanelPage;
