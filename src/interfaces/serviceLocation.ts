import { Service } from "./service";

export interface CurrentLocationService {
    m:string | null,
    d:string | null,
    s:string | null,
    services:Service[],
    loading:boolean,
    servicesNear: Service[],
    servicesText:string | null,
    servicesNearText: string | null
}

export interface CurrentPositionService {
    latitud:number | null,
    longitud:number | null,
}
