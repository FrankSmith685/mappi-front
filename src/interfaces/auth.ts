export interface LoginData {
    email: string;
    password: string;
}
export interface RegisterData {
    id: number;
    nombres: string;
    apellidos: string;
    contacto: string;
    correo: string;
    dni: string;
    password: string;
    sexo: string;
    idUbigeo: number;
    latitud: number;
    longitud: number;
    direccion: string | null;
    capacitacionCompleto: number;
    capacitacionStatus: string;
    capacitacionEsHabilitado: boolean;
    capacitacionTipo: string | null;
    googleToken?: string | null;
}

  
export interface AuthResponse {
    message: string;
    token?: string | null;
    success: boolean;
    exists?: boolean;
}


export interface UpdateGoogleTokenRequest {
    idUsuario?: number;
    googleToken?: string;
}