import axios from "axios";

export const handleApiError = (error: unknown, callback?: (success: boolean, message?: string) => void) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Error desconocido";

    if (status) {
      callback?.(false, message);
    } else {
      callback?.(false, "Error en la respuesta del servidor");
    }
  } else {
    callback?.(false, "Error inesperado al procesar la solicitud");
  }
};
