import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CustomButton from "../../../../ui/CustomButtom";
import { Option } from "../../../../../interfaces/order";
import { useAppState } from "../../../../../hooks/useAppState";



const MiPlan = () => {
    const {user,setServicePublishType,setServicePublishStep,setModal,planes,setIsActiveCompany, company} = useAppState();

    const formatFecha = (fecha: string) => {
      const [fechaParte, horaParte] = fecha.split(" ");
      const [dia, mes, año] = fechaParte.split("/");
    
      const fechaISO = `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T${horaParte}`;
      const date = new Date(fechaISO);
    
      if (isNaN(date.getTime())) return "Fecha inválida";
    
      return date.toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };
    

  const isLoading = planes === null;

    const options: Option[] = [
        {
            title: "¡Plan Clásico!",
            type: "Clásico",
            description: "Aparece con prioridad media y atrae más visitas.",
            price: company ?  59.99 : 24.99,
            buttonText: user?.planes?.some(p => p.estado === "Activo" && p.nombre === "Clásico") ? "Plan actual" :"Publicar con Plan Clásico",
            features: [
                "Aparece en el mapa por 6 meses",
                "Hasta 2 promociones",
                "Mayor visibilidad",
                "Aparece primero en resultados",
                `${ company ? "Cursos de video disponibles": "Cursos de audio disponibles"}`,
                "Publicar máximo hasta 2 Huariques"
            ]
        },
        {
            title: company ?  "¡Plan Básico!" : "¡Plan Gratis!",
            type: company ?  "Básico" : "Gratis",
            description: "Ideal para comenzar.",
            price: company ?  9.99 : "Gratis",
            buttonText: user?.planes?.some(p => p.estado === "Activo" && p.nombre === (company ?  "Básico" : "Gratis")) ? "Plan actual" :"Publicar con Plan Básico",
            features: [
                "Aparece en el mapa por 30 días",
                "1 promoción destacada",
                "Sin prioridad en búsquedas",
                `${ company ? "Cursos de video disponibles": "Cursos de audio disponibles"}`,
                "Publicar máximo hasta 1 Huariques"
            ]
        },
        {
            title: "¡Plan Chévere!",
            type: "Chévere",
            description: "¡La mejor visibilidad!, tendrá máxima prioridad y más exposición.",
            price: company ?  99.99 : 49.99,
            buttonText: user?.planes?.some(p => p.estado === "Activo" && p.nombre === "Chévere") ? "Plan actual" :"Publicar con Plan Chévere",
            features: [
                "Aparece en el mapa por 1 año",
                "Hasta 3 promociones",
                "Máxima visibilidad",
                "Prioridad en resultados de búsqueda",
                `${ company ? "Cursos de video disponibles": "Cursos de audio disponibles"}`,
                "Aparece en el carrusel o sección destacada",
                "Poder subir un video (además de fotos)",
                "Publicar máximo hasta 3 Huariques"
            ]
        }
    ];

    const option = options.find(opt => {
        // Validar que el tipo coincida y que también se tenga en cuenta el tipo "Gratis"/"Básico"
        if (planes?.nombre === "Gratis" || planes?.nombre === "Básico") {
          return (
            opt.type === planes?.nombre &&
            ((company && opt.type === "Básico") ||
              (!company && opt.type === "Gratis"))
          );
        }
        return opt.type === planes?.nombre;
      });

    const handleClickOtrosPlanes=()=>{
      setIsActiveCompany(false);
      const plans=[
        { type: "Gratis", id: 1, typeUser: "independiente",precio:0.00},
        { type: "Clásico", id: 2, typeUser: "independiente",precio:24.99 },
        { type: "Chévere", id: 3, typeUser: "independiente",precio:49.99 },
        { type: "Básico", id: 4, typeUser: "business",precio:9.99 },
        { type: "Clásico", id: 5, typeUser: "business",precio:59.99 },
        { type: "Chévere", id: 6, typeUser: "business",precio:99.99 },
      ]
      const typePlan = plans.find(p=>p.type === user?.planes?.[0].nombre && p.precio === user?.planes?.[0]?.montoCulqi);
        if(typePlan?.typeUser === "business"){
            setServicePublishType("business");
        }else{
            setServicePublishType("independiente");
        }
        setModal(true);
        setServicePublishStep("payOptions");
    }

  return (
    <div className="w-full max-w-xl mx-auto bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6 shadow-lg text-yellow-900 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center gap-3 mb-6 justify-center">
        <EmojiEventsIcon className="text-yellow-600 text-4xl animate-bounce" />
        <h2 className="text-2xl font-extrabold tracking-tight">Tu Plan Actual</h2>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 text-[15px] ${isLoading && "animate-pulse"}`}>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-yellow-100 h-14 rounded-lg" />
          ))
        ) : (
          <>
            <Info label="Nombre" value={planes?.nombre} />
            <Info label="Estado" value={planes?.estado} valueClass="text-green-700 font-semibold" />
            <Info label="Renovación automática" value="No" />
            <Info label="Precio" value={`S/. ${planes?.montoCulqi?.toFixed(2)}`} />
            <Info label="Inicio" value={formatFecha(planes.fechaInicio)} />
            <Info label="Fin" value={formatFecha(planes.fechaFin)} />
            {option?.features && option?.features?.length > 0 && (
                <div className="mt-6">
                <h4 className="font-bold text-yellow-900 mb-2">Características de tu plan:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    {option.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                    ))}
                </ul>
                </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 text-center">
        <CustomButton
          variantType="primary"
          type="submit"
          size="small"
          isLoading={isLoading}
          className="!normal-case !w-auto"
          onClick={handleClickOtrosPlanes}
          disabled={planes?.nombre === "Chévere"}
        >
          Ver otros planes
        </CustomButton>
      </div>
    </div>
  );
};

const Info = ({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) => (
  <div className="hover:bg-yellow-100 p-2 rounded-lg transition-all duration-300">
    <p className="font-semibold text-sm text-yellow-800">{label}:</p>
    <p className={`text-base font-medium ${valueClass}`}>{value}</p>
  </div>
);

export default MiPlan;
