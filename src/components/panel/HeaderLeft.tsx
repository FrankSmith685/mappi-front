/* eslint-disable react-hooks/exhaustive-deps */
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ServicesIcon } from "../../assets/icons/serviceIcons";
import { GoBackMapIcons } from "../../assets/icons/gobackMapIcons";
import { useAppState } from "../../hooks/useAppState";
import { useAuth } from "../../hooks/useAuth";
import { CapacitacionesIcon } from "../../assets/icons/capacitacionesIcon";
import { useEffect, useState, useMemo } from "react";

export const HeaderLeft = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    navigateCurrentService,
    user,
    setSelectedService
  } = useAppState();

  const [showCapacitacion, setShowCapacitacion] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if(user?.planes && user.planes.length > 0){
      setShowCapacitacion(true);
    }
  }, [user]);

  const menuItems = useMemo(() => {
    const items = [
      {
        icon: <FaUser className="w-9 h-9" />,
        label: "Mi Perfil",
        path: "/panel/mi-perfil",
      },
      {
        icon: <ServicesIcon className="w-14 h-14" />,
        label: "Mis Huariques",
        path: "/panel/mis-huariques",
      },
      {
        icon: <GoBackMapIcons className="w-12 h-12  cursor-pointer fill-white stroke-white stroke-2 transition-transform duration-300" />,
        label: navigateCurrentService ? "Regresar al Mapa" : "Ver Mapa",
        path: navigateCurrentService ? navigateCurrentService : "/servicios?m=map&d=MTM5Mg==",
        hiddenOnMd: true,
      },
    ];

    if (showCapacitacion) {
      items.push({
        icon: <CapacitacionesIcon className="w-12 h-12" />,
        label: "Capacitación",
        path: "/panel/capacitacion",
      });
    }

    return items;
  }, [showCapacitacion, navigateCurrentService]);

  useEffect(() => {
    if (
      user &&
      user.id &&
      !user.capacitacionEsHabilitado &&
      user.planes &&
      user.planes.length === 0 &&
      location.pathname === "/panel/capacitacion"
    ) {
      navigate("/panel/mi-perfil");
    }
  }, [user, location.pathname]);
  

  return (
    <div
      className={`h-full -z-40 flex flex-col items-center bg-custom-secondary gap-4 pt-4 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed
          ? " w-[100px] sm:w-[120px] opacity-100"
          : "w-0 opacity-0 overflow-hidden md:w-[120px] md:opacity-100"
      }`}
    >
      {menuItems.map(({ icon, label, path,hiddenOnMd  }) => (
        <NavLink
          key={label}
          to={path}
          
          onClick={() => {
            if (location.pathname !== path) {
              setIsSidebarCollapsed(false);
              setSelectedService({});
            }
          }}
          className={`flex flex-col items-center justify-center w-full h-[90px] md:h-[100px] text-white cursor-pointer transition duration-300
            ${hiddenOnMd ? "md:hidden" : ""}
            ${
              location.pathname === path
                ? "bg-gray-700 bg-opacity-50 text-gray-200 pointer-events-none opacity-50"
                : "hover:bg-gray-700 hover:bg-opacity-80 hover:text-gray-300"
            }`}
        >
          {icon}
          <span className="text-sm text-center">{label}</span>
        </NavLink>
      ))}

      <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center w-full h-[90px] md:h-[100px] text-white cursor-pointer transition duration-300 hover:bg-gray-700 hover:bg-opacity-80 hover:text-gray-300"
      >
        <FaSignOutAlt className="w-9 h-9" />
        <span className="text-sm">Cerrar Sesión</span>
      </button>
    </div>
  );
};
