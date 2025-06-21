import { api } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import { UbigeoResponse } from "../interfaces/ubigeo";
import { useAppState } from "./useAppState";

export const useUbigeo = () => {
    const {setDepartmentsAll,setDistrictsAll} = useAppState();

    const getDepartmentsAll = async () => {
        try {
            const response = await api.get<UbigeoResponse>(`/Ubigeos/ObtenerDepartamentos/1`);
            const { data, success } = response.data;
            if (success) {
                setDepartmentsAll(data);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const getDistrictsAll = async () => {
        try {
            const response = await api.get<UbigeoResponse>(`/Ubigeos/ObtenerTodosLosDistritos`);
            const { data, success } = response.data;
            if (success) {
                setDistrictsAll(data);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    return {
        getDepartmentsAll,
        getDistrictsAll,
    };
};