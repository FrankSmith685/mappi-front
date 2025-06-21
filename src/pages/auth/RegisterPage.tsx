import { AuthHeader } from "../../components/auth/authHeader";
import AdPromotionSection from "../../components/auth/register/adPromotionSection";
import FormRegister from "../../components/auth/register/formRegister";
import RegisterSteps from "../../components/auth/register/registerStep";
import { Footer } from "../../components/common/footer";
import CustomImage from "../../components/ui/CustomImage";

const RegisterPage = () => {
    const promotion = [
        { text: "Geolocalización para que ubiquen tu local", imageSrc: "location_01" },
        { text: "Personaliza tu local digital con logo y portada", imageSrc: "user_01" },
        { text: "Ingresa tu WhatsApp para delivery", imageSrc: "whatsapp_01" }
    ]

    const steps = [
        { step: 1, img: "info_01", title: "Paso 1", description: "Descripción del paso 1" },
        { step: 2, img: "info_02", title: "Paso 2", description: "Descripción del paso 2" },
        { step: 3, img: "info_03", title: "Paso 3", description: "Descripción del paso 3" },
        { step: 4, img: "info_04", title: "Paso 4", description: "Descripción del paso 4" },
    ];

  return (
    <div className="w-full flex justify-center items-center">
        <div className="w-full flex justify-center items-center relative g-container !px-0">
            <div className="w-full h-full absolute inset-0">
                <div className="relative">
                    <div className="w-full h-full fixed inset-0 z-10">
                        <CustomImage
                            name="desktop_register"
                            alt="desktop_register"
                            className={` size-custom object-cover hidden md:flex`}
                        />
                        <CustomImage
                            name="mobile_register"
                            alt="mobile_register"
                            className={`md:hidden size-custom object-cover`}
                        />
                        <div className="absolute inset-0 w-full h-full bg-custom-primary-transparent"></div>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-auto z-20 space-y-6">
                <div className="w-full bg-white">
                    <AuthHeader/>
                </div>
                <div className="g-container !h-auto flex items-center justify-center gap-12 flex-col-reverse lg:flex-row">
                    <div className="w-full lg:w-[1000px] max-w-[500px] h-full bg-white rounded-xl ">
                        <FormRegister/>
                    </div>
                    <div className="w-full h-full ">
                        <AdPromotionSection
                            title="¡Haz publicidad en la única plataforma de huariques del Perú!"
                            features={promotion}
                            registrationText="¡Registra tu negocio ahora mismo!"
                        />
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex flex-col items-center justify-center h-20 w-full bg-white text-gray-900 text-center z-20 ">
                        <h2 className="text-3xl lg:text-4xl font-medium">
                            Empezar a <strong className="font-bold text-custom-orange">vender</strong> es sencillo
                        </h2>
                    </div>
                    <RegisterSteps itemRegister={steps} />
                    <div className="w-full bg-white pt-6">
                        <Footer/>
                    </div> 
                </div> 
            </div>
        </div>
    </div>
  );
};

export default RegisterPage;
