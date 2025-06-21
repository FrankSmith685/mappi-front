import React from "react";
import CustomModal from "../../../../ui/CustomModal";
import { useAppState } from "../../../../../hooks/useAppState";

const ModalPublishType: React.FC = () => {
  const { modal, setModal, servicePublishStep,setServicePublishType,setServicePublishStep } = useAppState();

  const onContinueTypeSection = (tipo: string) => {
    setServicePublishStep("personalInfo");
    if (tipo === "Empresa") {
      setServicePublishType("business");
    }else{
      setServicePublishType("independiente");
    }
  };

  return (
    <CustomModal
      open={modal}
      typeSection={servicePublishStep}
      onClose={() => setModal(false)}
      onContinueTypeSection={onContinueTypeSection}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-gray-900 text-center px-0 sm:px-10">
        <h2 className="font-semibold text-lg sm:text-2xl leading-6">
          ¿Quieres vender como empresa o independiente?
        </h2>
        <p className="text-sm sm:text-base">
          Recuerda que puedes publicar tus huariques como empresa o independiente, tú decide cómo.
        </p>
      </div>
    </CustomModal>
  );
};

export default ModalPublishType;
