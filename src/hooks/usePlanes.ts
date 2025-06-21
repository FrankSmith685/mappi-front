import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import { GetPlanes, Planes, PlanesResponse } from "../interfaces/planes";
import { useAppState } from "./useAppState";


export const usePlanes = () => {

    const { setUser,user,servicePublishType } = useAppState();

        const savePlanes = async(dataPlanes : Planes)=>{
            try{
                const response = await apiWithAuth.post<PlanesResponse>(
                    `/planes/guardar`, dataPlanes
                );
                const { success } = response.data;
                const plans=[
                    { type: "Gratis", id: 1, typeUser: "independiente"},
                    { type: "Clásico", id: 2, typeUser: "independiente" },
                    { type: "Chévere", id: 3, typeUser: "independiente" },
                    { type: "Básico", id: 4, typeUser: "business" },
                    { type: "Clásico", id: 5, typeUser: "business" },
                    { type: "Chévere", id: 6, typeUser: "business" },
                ]
                const selectPlan= plans.find(p=>p.id === dataPlanes.planInterno && p.typeUser === servicePublishType);
                const nuevoPlan = {
                    nombre: selectPlan?.type ?? '',
                    montoCulqi: dataPlanes.planMontoCulqi ?? 0,
                    estado: "Activo",
                    limiteHuarique: selectPlan?.type === "Gratis" ? 1 : selectPlan?.type === "Básico" ? 1 : selectPlan?.type === "Clásico" ? 2 : selectPlan?.type === "Chévere" ? 3 : 1,
                    duracion: 0,
                    fechaInicio: '',
                    fechaFinal: ''
                };
                if (success) {
                    setUser({
                        ...user,
                        planes: [nuevoPlan]
                    });                    
                }
            }catch(error){
                handleApiError(error);
            }
        }

        const getPlanes = async (callback: (dataPlanes: GetPlanes[]) => void = () => {}) => {
            try {
                const response = await apiWithAuth.get<PlanesResponse>("/planes/ObtenerPlanes");
                const { data, success } = response.data;
        
                if (success && data) {
                    callback(data);
                } else {
                    console.warn("No se pudo obtener planes.");
                }
            } catch (error) {
                handleApiError(error);
            }
        };

    return {
        savePlanes,
        getPlanes
    };
};
