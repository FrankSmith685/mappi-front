import { useState } from "react";
import { getDistrictsByAddress } from "../utils/location";
import { useAppState } from "./useAppState";
// import useCurrentLocation from "./useCurrentLocation";

type AddressResult = {
    address: string;
    district: string;
    address_components?: { long_name: string; short_name: string; types: string[] }[];
    // otros campos adicionales según tu tipo
};

export const useGeocoder = () => {
    const [address, setAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const {departmentsAll, districtsAll,setCurrentLocation} = useAppState();

    type District = {
        id: number;
        idPadre: number | null;
        cantidad: number;
        nombre: string;
        nombre2: string;
    };

    type LocationData = {
        idUbigeo: string;
        department: { value: number; label: string; quantity: number };
        district: { label: string; quantity: number; value: number };
        latitude: number;
        longitude: number;
        address: string;
        districtbydepartment?: District[];
    };

    type GeocoderCallbackData = {
        latitude: number;
        longitude: number;
        address?: string;
        idUbigeo?: string;
        department?: { value: number; label: string; quantity: number };
        district?: { label: string; quantity: number; value: number };
        districtbydepartment?: District[];
      };
      

    const getGeocoder = (lat?: number, lng?: number, address?: string, callback?: (data: GeocoderCallbackData) => void) => {
        const geocoder = new window.google.maps.Geocoder();
        if (address) {
            geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results?.length) {
                    const location = results[0].geometry.location;
                    const latitude = location.lat();
                    const longitude = location.lng();

                    if (callback) callback({ latitude, longitude });
                } else {
                    setError("No se encontró la dirección.");
                }
            });
        } 
        else if (lat !== undefined && lng !== undefined) {
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results?.length) {
                    handleGeocodeResults(results, lat, lng, callback);
                } else {
                    setError("No se encontró la dirección.");
                }
            });
        } else {
            setError("Debes proporcionar lat/lng o una dirección.");
        }
    };
    
    const handleGeocodeResults = (results: google.maps.GeocoderResult[], lat: number, lng: number, callback?: (data: LocationData) => void) => {
        const addressResults: AddressResult[] = results.map((result) => {
            const district = result.address_components?.find((component) => component.types.includes("administrative_area_level_2"))?.long_name || "";
            return {
                address: result.formatted_address,
                district: district,
                address_components: result.address_components
            };
        });
    
        setAddress(results[0].formatted_address);
    
        getDistrictsByAddress(addressResults, districtsAll, departmentsAll, lat, lng, results[0].formatted_address, (data) => {
            if (typeof callback === 'function') {
                callback(data);
            }else{
                setCurrentLocation(data);
            }
        });
    };
    

    return { getGeocoder, address, error };
};
