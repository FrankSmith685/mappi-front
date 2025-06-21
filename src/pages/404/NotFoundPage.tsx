import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import CustomButton from "../../components/ui/CustomButtom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const rol = localStorage.getItem("rol");
    const token = localStorage.getItem("token");

    if (token && rol === "admin") {
      navigate("/panel-admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleClickInicio = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 text-center animate-fade-in">
      <div className="text-custom-primary text-6xl mb-4 animate-bounce">
        <FaExclamationTriangle />
      </div>
      <h1 className="text-5xl font-extrabold text-custom-primary mb-2">404</h1>
      <p className="text-xl text-gray-700 mb-4">¡Oops! Página no encontrada.</p>
      <p className="text-md text-gray-500 mb-8">
        La página que buscas no existe o ha sido movida.
      </p>
      <CustomButton
        variantType="primary"
        type="submit"
        size="medium"
        className="!w-auto"
        onClick={handleClickInicio}
      >
        Volver al inicio
      </CustomButton>
    </div>
  );
};

export default NotFoundPage;
