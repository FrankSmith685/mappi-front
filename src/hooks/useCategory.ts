import { api } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import { CategoryResponse } from "../interfaces/categories";
import { useAppState } from "./useAppState";

export const useCategory = () => {
    const {setCategory} = useAppState();

    const getCategory = async () => {
        try {
            const response = await api.get<CategoryResponse>(`/Categorias/ObtenerCategorias`);
            const { data, success } = response.data;
            if (success) {
                const categories = Array.isArray(data) ? data : data ? [data] : [];
                setCategory(categories);
            }
            
        } catch (error) {
            handleApiError(error);
        }
    };

    return {
        getCategory
    };
};