export interface SubCategoryResponse {
    message: string;
    data?: SubCategory | null;
    success: boolean;
}

export interface SubCategory {
    id?: number;
    idPadre?: number | null;
    cantidad?: number | 0;
    nombre?: string;
    nombre2?: string;
}