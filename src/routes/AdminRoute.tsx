import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  return token && rol === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute