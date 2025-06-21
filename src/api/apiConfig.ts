import axios, { AxiosInstance } from "axios";

// Usa `import.meta.env` en Vite
const baseURL: string = import.meta.env.VITE_API_URL;
const imageUrl: string = import.meta.env.VITE_IMAGE_URL;

// Crear instancia base de Axios
export const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Crear instancia de Axios con autenticación
export const apiWithAuth: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// **Interceptor para agregar dinámicamente el token**
apiWithAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// URL base para imágenes
export const imageBaseUrl: string = imageUrl;
