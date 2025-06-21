export interface CategoryResponse {
    message: string;
    data?: Category | null;
    success: boolean;
}

export interface Category {
    id?: number;
    idPadre?: number | null;
    cantidad?: number | 0;
    nombre?: string;
    nombre2?: string;
}

