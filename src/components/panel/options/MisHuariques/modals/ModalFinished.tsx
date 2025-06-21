import React from "react";
import CustomModal from "../../../../ui/CustomModal";
import { useAppState } from "../../../../../hooks/useAppState";

const ModalFinished: React.FC = () => {
    const { 
        modal, 
        setModal, 
        servicePublishStep,
        setService,
        setModifiedService,
    } = useAppState();
    

    const ResetClose=()=>{
        setModal(false);
        setService(null);
        setModifiedService(null);
    }

    const handleContinuar=()=>{
        setModal(false);
        setService(null);
        setModifiedService(null);
    }

  return (
    <CustomModal
      open={modal}
      typeSection={servicePublishStep}
      title="Registrar Datos Personales"
      onClose={ResetClose}
      onContinue={handleContinuar}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-gray-900 text-center w-full">
        <div className="w-full flex items-center justify-center text-custom-primary text-2xl font-medium text-center flex-col ">
            <h2 className="w-full">Sobrino, tu huarique</h2>
            <h2 className="w-full"> ¡YA ESTÁ EN EL MAPA¡</h2>
        </div>
        <p className="w-full text-gray-800">Ahora prepárate para atendender a tus nuevos clientes con mucho sabor,comprensión y ternura. ¡YA TU SA!</p>
      </div>
    </CustomModal>
  );
};

export default ModalFinished;