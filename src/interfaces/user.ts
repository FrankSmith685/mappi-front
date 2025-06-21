export interface UserResponse {
    message: string;
    data?: User | null;
    success: boolean;
}


interface PlanUser{
    nombre: string,
    montoCulqi: number,
    estado: string,
    limiteHuarique: number,
    duracion: number,
    fechaInicio: string,
    fechaFinal: string,
}

export interface User {
    id?: number;
    nombres?: string;
    apellidos?: string | null;
    dni?: string | null;
    correo?: string;
    sexo?: "Varón" | "Mujer";
    fecNacimiento?: string | null;
    ciudad?: string | null;
    contacto?: string | null;
    password?: string | null;
    idUbigeo?: number;
    latitud?: number;
    longitud?: number;
    direccion?: string | null;
    esUsuario?: boolean;
    idImgPerfil?: number;
    idCv?: number;
    tieneEmpresa?: boolean;
    tieneHuarique?: boolean;
    capacitacionCompleto?: number;
    capacitacionStatus?: string;
    capacitacionEsHabilitado?: boolean;
    capacitacionTipo?: string | null;
    usua_Token?: string | null;
    planes?: PlanUser[];
    imgPerfil?: number;
    imgPortada?: number;
    codigo?:string;
    nuevaContrasena?:string; 
    confirmarNuevaContrasena?:string; 
}

export interface UserAll {
    id?: number;
    nombre?: string;
}
