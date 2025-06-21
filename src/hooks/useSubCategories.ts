import { api } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import { SubCategoryResponse } from "../interfaces/subcategory";
import { useAppState } from "./useAppState";

export const useSubCategories = () => {
    const {setSubCategory} = useAppState();

    const getSubCategory = async () => {
        try {
            const response = await api.get<SubCategoryResponse>(`/SubCategorias/ObtenerSubCategorias`);
            const { data, success } = response.data;
            if (success) {
                const subcategories = Array.isArray(data) ? data : data ? [data] : [];
                setSubCategory(subcategories);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    return {
        getSubCategory
    };
};