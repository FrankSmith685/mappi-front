export interface ServiceByUser {
    id: number;
    nombreServicio: string;
    calificacion: number | null;
    idUsuario: number;
    tipo: string;
    nombre: string;
    idCategoria: number;
    descripcion: string;
    diasDePublicacion: number;
    fechaPublicacion: string;
    direccion: string;
    ciudad: string;
    idUbigeo: number;
    latitud: number;
    longitud: number;
    empleadorNomCom: string;
    descripcionEmpr: string;
    cargo: string;
    idLogo: number;
    idPortada: number;
    empleadorNombre: string;
    requisitos: string;
    tieneDelivery: boolean;
    solicitudes: string | null;
    fotoPrincipal: number;
    idPromociones: string;
    idVideoPromocion: number;
    idPdfCarta?: number;
    horario: string;
    telefono: string;
    montoCulqi: number;
    esGenerico: boolean;
    resenas: string | null;
}
  
export interface ServiceByUserResponse {
    message?: string;
    data?: ServiceByUser[];
    totalServices?: number;
    success: boolean;
}