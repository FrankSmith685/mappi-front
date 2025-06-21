export interface CompanyResponse {
    message: string;
    data?: Company | null;
    success: boolean;
}

export interface Company {
    id?: number;
    cargo?: "Gerente" | "Representante Legal";
    direccion?: string;
    idUbigeo?: number;
    empresa?: string;
    idUsuario?: number;
    ruc?: string;
    idLogo?: number | null;
    idPortada?: number | null;
    latitud?: number | null;
    longitud?: number | null;
}

