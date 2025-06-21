  export interface LogAndPortAndService{
    base64?: string | null;
    name?: string | null;
    isLoading?: boolean | true;
  }
  
  export interface videoService{
    base64?: string | null;
    name?: string | null;
    isLoading?: boolean | true;
    id?: number;
  }

  export interface documentService{
    base64?: string | null;
    name?: string | null;
    isLoading?: boolean | true;
    id?: number;
  }

  interface CompanyOrIndependent {
    logo?: LogAndPortAndService | null;
    portada?: LogAndPortAndService | null;
    isLoading?: boolean | true;
  }
  
  export interface ArchiveByUser {
    company?: CompanyOrIndependent | null;
    independent?: CompanyOrIndependent | null;
  }

  export interface ArchiveByService {
    service?: LogAndPortAndService [] | null;
    id?: number;
    isLoading:boolean | true;
  }

  export interface ArchiveByServiceResena {
    resena?: LogAndPortAndService [] | null;
    id?: number;
    isLoading:boolean | true;
  }

  export interface dataResponse {
    archInterno: number,
    archTipo: string,
    archTabla: string,
    archContenidoTipo: string,
    archTamaño: number,
    archContenido?: string,
    archNombre?:string,
  }

  export interface ArchiveResponse {
    message?: string;
    data?: dataResponse;
    success: boolean;
  }

export interface dateGetArchive{
  archInterno: number,
  archNombre: string,
  archTipo: string,
  archTabla: string,
  arcH_Tamaño:number,
  urlS3:string
}

export interface getArchiveResponse {
  messae?: string;
  data?:dateGetArchive[];
  success: boolean;
}

export interface postArchiveResponse{
  messae?: string;
  data?:dataResponse;
  success: boolean;
}


interface IdsCompanyOrIndependent {
  logo?: number | null;
  portada?: number | null;
}


export interface deleteIDsArchives{
  services?: number[] | null;
  resena?: number[] | null;
  company?: IdsCompanyOrIndependent | null;
  independent?: IdsCompanyOrIndependent | null;
}


export interface deleteArchiveResponse{
  messae?: string;
  id?:number;
  success: boolean;
}


export interface AllArchiveResponse{
  estado?:string,
  archivos?: dataResponse[]
}
