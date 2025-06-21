import { useNavigate } from "react-router-dom";
import { HeaderLeft } from "../../components/home/HeaderLeft";
import { HeaderTop } from "../../components/home/HeaderTop";
import { RightSide } from "../../components/home/RightSide";
import { useEffect, useState } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rol = localStorage.getItem("rol");
    const token = localStorage.getItem("token");

    if (token && rol === "admin") {
      navigate("/panel-admin/dashboard", { replace: true });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full flex justify-center items-start relative !px-0">
        <div className="w-full bg-white relative lg:flex lg:items-start lg:justify-center">
          <HeaderTop />
          <div className="lg:absolute lg:top-0 lg:left-0 lg:h-full">
            <HeaderLeft />
          </div>
          <div className="w-full bg-white lg:pl-[380px]">
            <RightSide />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
