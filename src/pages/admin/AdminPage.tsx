import { useParams, useNavigate } from "react-router-dom";
import { JSX, useEffect, useState } from "react";
import HeaderLeft from "../../components/admin/sidebar/HeaderLeft";
import DashboardAdminPage from "../../components/admin/DashboardAdminPage";
import UserAdminPage from "../../components/admin/UserAdminPage";
import ArchivosAdminPage from "../../components/admin/ArchivosAdminPage";
import { FaBars } from "react-icons/fa";
import ReportesAdminPage from "../../components/admin/ReportesAdminPage";
import ProyectosAdminPage from "../../components/admin/ProyectosAdminPage";
import AjustesAdminPage from "../../components/admin/AjustesAdminPage";

// Definir las opciones disponibles
const options = ["dashboard", "users","files","projects","reports","settings"] as const;
type OptionType = (typeof options)[number];

const components: Record<OptionType, JSX.Element> = {
  "dashboard": <DashboardAdminPage />,
  "users": <UserAdminPage />,
  "files": <ArchivosAdminPage/>,
  "projects": <ProyectosAdminPage/>,
  "reports": <ReportesAdminPage/>,
  "settings": <AjustesAdminPage/>
};

const AdminPage = () => {
    const { option } = useParams();
    const navigate = useNavigate();
    const [isSidebarCollapsed,setIsSidebarCollapsed] = useState<boolean>(false);

  const validOption = options.includes(option as OptionType)
    ? (option as OptionType)
    : "dashboard";

  useEffect(() => {
    if (!option || !options.includes(option as OptionType)) {
      navigate("/panel-admin/dashboard", { replace: true });
    }
  }, [option, navigate]);



  return (
    <div className="w-full flex flex-col relative">
      <div className="flex w-full relative">
        
        <div className="absolute top-0 left-0 h-full z-50 ">
          <div className="fixed h-full">
            <HeaderLeft isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          </div>
        </div>
        <div className={`${!isSidebarCollapsed ? 'md:pl-[354px]' : 'md:pl-[104px]'} pt-[40px] px-[24px] h-full flex-grow relative`}>

          {isSidebarCollapsed && (
            <div
              className="fixed inset-0 bg-black opacity-10 z-40 md:hidden"
              onClick={() => setIsSidebarCollapsed(false)}
            ></div>
          )}
          <div className="relative">
            {/* Botón para abrir el sidebar en móviles */}
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="md:hidden text-2xl text-gray-700 mb-4 flex items-center gap-2"
            >
                <FaBars />
                <span className="text-base">Menú</span>
            </button>

            {/* Contenido principal */}
            <div>
                {components[validOption]}
            </div>
            </div>

          
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
