export interface Service {
    id?: number;
    nombreServicio?: string;
    calificacion?: number | null;
    idUsuario?: number;
    tipo?: string;
    nombre?: string;
    idCategoria?: number;
    descripcion?: string;
    diasDePublicacion?: number;
    fechaPublicacion?: string;
    direccion?: string;
    ciudad?: string;
    idUbigeo?: number;
    latitud?: number;
    longitud?: number;
    empleadorNomCom?: string;
    descripcionEmpr?: string;
    cargo?: string;
    idLogo?: number;
    idPortada?: number;
    empleadorNombre?: string;
    requisitos?: string;
    tieneDelivery?: boolean;
    solicitudes?: string | null;
    fotoPrincipal?: number;
    idPromociones?: string;
    idVideoPromocion?: number;
    idPdfCarta?: number;
    horario?: string;
    telefono?: string;
    montoCulqi?: number;
    esActivo?: string;
    esGenerico?: boolean;
    resenas?: string | null;
}

export interface UserResena {
    ServInterno?: number,
    ServDireccion?: string,
    ServDescripcion?: string,
    ServTieneDelivery?: boolean,
    ServActivo?: boolean,
    ServLatitud?: number,
    ServLongitud?: number,
    UbigInterno?: number,
    UsuaInterno?: number,
    SubcInterno?: number,
    ServHorario?: string,
    ServNombre?: string
}

export interface Resena {
    ReseInterno?: number;
    ReseValor?: string;
    ReseCalificacion?: number;
    UsuaInterno?: number;
    reseFechaCreacion?:string;
    multimediaIds?:string;
}

export interface ResenaById {
    id?: number;
    fecha?:string;
    resena?: string;
    calificacion?: number;
    idUsuario?: number;
    idServicio?:number;
    multimediaIds?:string | null;
    
}


export interface ResenaByIdResponse {
    message?: string;
    data?: Resena[];
    success: boolean;
}

export interface ResenaResponse {
    message?: string;
    data?: Service[];
    id?:number;
    idResena?: number;
    success: boolean;
}

export interface ResenaPostResponse{
    message?: string;
    data?: Service;
    id?:number;
    idResena?: number;
    success: boolean;
}
