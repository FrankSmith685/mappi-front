export interface ServicePremium {
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
    solicitudes: string;
    fotoPrincipal: number;
    idPromociones: string;
    horario: string;
    telefono: string;
    montoCulqi: number;
    esGenerico: boolean;
    resenas: string;
  }
  
  export interface ServicePremiumResponse {
    message: string;
    data: ServicePremium[];
    success: boolean;
  }
  