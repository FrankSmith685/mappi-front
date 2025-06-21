import { useAppState } from "../../../hooks/useAppState";
import CustomImage from "../../ui/CustomImage";
import { FaCog, FaAngleDoubleLeft, FaAngleDoubleRight, FaSignOutAlt } from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";

import { FaHome, FaUser, FaFileAlt, FaProjectDiagram, FaChartBar, FaTools } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";

const menuItems = [
  { name: "Dashboard", icon: <FaHome />, path: "/panel-admin/dashboard" },
  { name: "Usuarios", icon: <FaUser />, path: "/panel-admin/users" },
  { name: "Gestión de Archivos", icon: <FaFileAlt />, path: "/panel-admin/files" },
  { name: "Proyectos", icon: <FaProjectDiagram />, path: "/panel-admin/projects" },
  { name: "Reportes", icon: <FaChartBar />, path: "/panel-admin/reports" },
  { name: "Ajustes", icon: <FaTools />, path: "/panel-admin/settings" },
];


interface HeaderLeftProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}
const HeaderLeft = ({ isCollapsed, toggleSidebar }: HeaderLeftProps) => {
  const { user } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();
  const {logout} = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Buenos días";
    if (hour >= 12 && hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
};


  return (
    <div
      className={`
        transition-all duration-300 ease-in-out
        h-full overflow-hidden   bg-white z-50
        fixed top-0 left-0 md:static
        ${isCollapsed
          ? 'w-[80px] border-r border-orange-600'
          : 'w-0 md:w-[330px]  md:border-r md:border-orange-600'
        }
        ${!isCollapsed ? '' : 'block'}
      `}
    >
      {/* Header superior del sidebar */}
      <div className={`${!isCollapsed ? 'justify-between md:justify-center' : 'md:justify-between'}w-full h-[100px] bg-gradient-custom-primary-v2 flex items-center justify-center  p-2`}>
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Mostrar logo solo cuando está expandido y en md+ */}
          <div className="hidden md:block">
            {!isCollapsed && (
              <CustomImage
                name="logo_04"
                alt="Ejemplo de imagen optimizada"
                className="!w-auto !h-[60px] cursor-pointer"
              />
            )}
          </div>

          {!isCollapsed && (
            <div className="hidden md:flex flex-col justify-center">
              <p className="text-white text-sm font-light leading-none opacity-80">Bienvenido</p>
              <p className="text-white text-lg font-semibold tracking-wide animate-fade-in">
                {getGreeting()}, <span className="capitalize">{user?.nombres}</span>
              </p>
            </div>
          )}
        </div>

        {/* Botón de colapsar sidebar */}
        <div className="flex items-center gap-3 text-white text-lg">
          {!isCollapsed && (
            <FaCog
              className="hidden md:block hover:scale-110 transition text-2xl cursor-pointer"
              title="Configuración"
            />
          )}
          <button onClick={toggleSidebar} className="focus:outline-none hidden md:flex">
            {isCollapsed ? (
              <FaAngleDoubleRight title="Expandir menú" className="text-2xl cursor-pointer" />
            ) : (
              <FaAngleDoubleLeft title="Colapsar menú" className="text-2xl cursor-pointer hidden md:block" />
            )}
          </button>
          <FaCog
              className="block md:hidden hover:scale-110 transition text-2xl cursor-pointer"
              title="Configuración"
            />
        </div>
      </div>

      {/* Menú */}
      <div className="flex flex-col mt-4 gap-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(item.path);
              if (window.innerWidth < 768) toggleSidebar(); // Cerrar en móvil después de navegar
            }}
            className={`
              flex items-center gap-3 px-4 py-3 cursor-pointer 
              transition rounded-lg mx-2
              ${isActive(item.path) ? 'bg-custom-primary text-white' : 'text-gray-700 hover:bg-orange-100'}
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <span className="text-lg">{item.icon}</span>
            {!isCollapsed && <span className="text-base font-medium hidden md:inline">{item.name}</span>}
          </div>
        ))}
      </div>
      <div
  onClick={handleLogout}
  className={`
    flex items-center gap-3 px-4 py-3 cursor-pointer
    transition rounded-lg mx-2 mt-2
    text-gray-700 hover:bg-red-100 hover:text-red-600
    ${isCollapsed ? "justify-center" : ""}
  `}
>
  <FaSignOutAlt className="text-lg" />
  {!isCollapsed && (
    <span className="text-base font-medium hidden md:inline">
      Cerrar sesión
    </span>
  )}
</div>
    </div>
  );
};


export default HeaderLeft;
