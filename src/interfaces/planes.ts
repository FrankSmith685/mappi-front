export interface Planes{
    puInterno?: number,
    planInterno?: number,
    planToken?: string,
    planMontoCulqi?: number,
    duracion?:number,
    fechaInicio?:string,
    fechaFin?: string
}

export interface GetPlanes{
    nombre: string,
    montoCulqi: number,
    estado: string,
    limiteHuarique:number,
    duracion:number,
    fechaInicio:string,
    fechaFin: string
}

export interface PlanesResponse {
    message?: string;
    data?:GetPlanes[];
    success: boolean;
}