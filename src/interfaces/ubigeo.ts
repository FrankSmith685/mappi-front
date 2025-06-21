export interface dataUbigeo {
    id: number;
    idPadre: number | null;
    cantidad: number;
    nombre: string;
    nombre2: string;
  }
  
  export interface UbigeoResponse {
    message: string;
    data: dataUbigeo[];
    success: boolean;
  }

  type District = {
    id: number;
    idPadre: number | null;
    cantidad: number;
    nombre: string;
    nombre2: string;
};

export interface LocationData {
  address: string;
  department: { value: number; label: string; quantity: number };
  district: { label: string; quantity: number; value: number };
  districtbydepartment?: District[];
  idUbigeo: string;
  latitude: number;
  longitude: number;
}
