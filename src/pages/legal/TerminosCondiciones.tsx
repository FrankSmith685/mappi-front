import { useNavigate } from "react-router-dom";
import CustomImage from "../../components/ui/CustomImage";

const TerminosCondiciones = () => {
    const navigate=useNavigate();
  return (
    <>
        <div className="w-full z-40 ">
            <div className="w-full h-[80px] flex justify-center items-center bg-gradient-custom-primary-v2 px-3 md:px-6 lg:px-12 gap-6">
                <div className="w-[140px] cursor-pointer !h-[150px]" onClick={()=>navigate("/")}>
                    <CustomImage
                        name={`logo_02`}
                        alt="logo_01"
                        className={` w-[140px] cursor-pointer !h-[150px]`}
                        
                    />
                </div>
            </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-10 text-justify text-gray-800">
            <h1 className="text-3xl font-bold text-center text-custom-primary mb-6">
                Términos y Condiciones de Uso de Datos Personales
            </h1>

            <p className="mb-4">
                De conformidad con la Ley N° 29733, Ley de Protección de Datos Personales (en adelante, la Ley), y su reglamento, aprobado por el Decreto Supremo N° 003-2013-JUS (en adelante, el Reglamento), el titular autoriza el tratamiento de los datos personales que facilite a la empresa PBA Technologies SAC (en adelante, MAPPI), a través de su PLATAFORMA WEB, por el presente REGISTRO.
            </p>

            <p className="mb-4">
                Al completar el presente registro y aceptar previamente los términos que rigen el tratamiento de los datos personales, MAPPI procederá a guardar la información del titular en la base de datos que posee en condición de titular, por tiempo indefinido o hasta que usted revoque el consentimiento otorgado. La información que brindará el titular de los datos personales a MAPPI se encontrará referida a nombres y apellidos, fecha de nacimiento, teléfono, correo electrónico, documento de identidad, RUC, etc.
            </p>

            <p className="mb-4">
                MAPPI (sito en CALLE NUEVA ESPARTA MZ D11 LOTE 34 LOS CEDROS DE VILLA, CHORRILLOS), declara ser la titular del banco de datos personales y utilizará su información para las siguientes finalidades: 
                <br />i) remisión de información sobre las promociones, ofertas y nuevas funcionalidades relevantes de su interés, 
                <br />ii) contactarlo para orientarlo sobre algún problema en el uso de la plataforma que afecte el producto digital que adquirió, 
                <br />iii) realización de campañas de publicidad, eventos de marketing, etc., 
                <br />iv) realización de encuestas de satisfacción y 
                <br />v) otras finalidades conexas a las antes mencionadas.
            </p>

            <p className="mb-4">
                Adicionalmente, y de ser aceptado por el titular, la empresa queda autorizada a remitirle información sobre nuevas plataformas digitales y funcionalidades del sistema desarrollados por PBA Technologies para lo cual utilizará los medios digitales registrados en el presente formulario.
            </p>

            <p className="mb-4 font-bold">
                En ambos casos, se informa al usuario que el contacto que efectuará MAPPI podrá hacerse por llamada telefónica, SMS, correo electrónico, WhatsApp, entre otros medios que considere oportunos a efectos de cumplir las finalidades mencionadas.
            </p>

            <p className="mb-4">
                En caso de que el titular desee ejercer sus derechos de acceso, cancelación, oposición, revocatoria de consentimiento, modificación o cualquier otro contemplado en la Ley, deberá enviar una comunicación al buzón <a href="mailto:protecciondatos@mappi.pe" className="text-blue-600 underline">protecciondatos@mappi.pe</a>.
            </p>

            <p className="mb-4">
                Se pone en conocimiento de los titulares del registro, mediante los cuales otorguen sus datos personales, que pueden incluir preguntas obligatorias y facultativas, las cuales podrán ser identificadas en cada uno de estos. Las consecuencias de la concesión de datos personales facultan a MAPPI a utilizarlos de acuerdo a las finalidades señaladas precedentemente. La negativa en la entrega de los datos personales del titular imposibilita a MAPPI el registro en su base de datos y atender sus requerimientos para usar la plataforma <strong>Mappi.PE</strong>.
            </p>
            </div>
    </>
  );
};

export default TerminosCondiciones;
