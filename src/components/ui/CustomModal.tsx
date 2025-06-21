import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import CustomImage from "./CustomImage";
import CustomButton from "./CustomButtom";
import { FaAngleLeft } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface CustomModalProps {
  open: boolean;
  isEdit?: boolean;
  title?: string;
  typeSection: string;
  onReturn?: () => void;
  onClose?: () => void;
  onContinueTypeSection?: (tipo: string) => void;
  onContinue?: () => void;
  continueText?: string;
  children?: React.ReactNode;
  isPersonalized?: boolean
}

const CustomModal: React.FC<CustomModalProps> = ({ open,isEdit = false,title, typeSection, onReturn, onClose, onContinue, onContinueTypeSection, continueText = "Continuar", children, isPersonalized = false }) => {

  // Efecto para manejar `aria-hidden` en `#root`
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.setAttribute("aria-hidden", open ? "true" : "false");
    }
    return () => {
      if (root) root.removeAttribute("aria-hidden");
    };
  }, [open]);

  return (
    <Dialog open={open} 
    onClose={(_event, reason) => {
      // Solo cerrar el modal si la razón no es "backdropClick"
      if (reason !== "backdropClick") {
        if (onClose) {
          onClose();
        }
      }
    }}
    fullWidth sx={{ "& .MuiDialog-paper": { width: "500px", borderRadius: "20px" } }} disableEscapeKeyDown>
      <DialogTitle className="flex justify-center items-center relative w-full ">
        {typeSection === "typeSelection" || typeSection === "finished"  ? (
          <>
            <CustomImage
              name="logo_01"
              alt="logo_01"
              className="cursor-pointer w-[180px] sm:w-[220px] md:w-[250px]"
            />
          </>
        ) : (

            <div className={`${isEdit ? 'justify-start' : 'justify-center'} flex items-center relative w-full gap-4 sm:gap-0`}>
              {
                !isEdit && <>
                  <FaAngleLeft className={`${typeSection === "null" ? 'hidden' : ''} sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:left-0 text-2xl sm:text-3xl text-gray-900  cursor-pointer w-auto`} onClick={onReturn}/>
                </>
              }
                
                <h2 className="text-custom-primary text-xl sm:text-[27px] font-[600] w-full sm:w-auto">{title}</h2>
            </div>
        )}
        <div className="absolute top-0 right-0">  
            <IconButton onClick={onClose} aria-label="close">
            <IoClose className="text-3xl font-bold text-gray-900 "/>
            </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <>
        {
          !isPersonalized ? (
            <DialogActions>
              {typeSection === "typeSelection" ? (
                <div className="flex items-center justify-center p-4 w-full">
                  <div className="w-full flex flex-col gap-4">
                    <CustomButton
                      variantType="primary"
                      type="submit"
                      size="medium"
                      isLoading={false}
                      className="!normal-case"
                      onClick={() => onContinueTypeSection && onContinueTypeSection("Empresa")}
                    >
                      Publicar como Empresa
                    </CustomButton>
                    <CustomButton
                      variantType="terciary"
                      type="submit"
                      size="medium"
                      isLoading={false}
                      className="!normal-case"
                      onClick={() => onContinueTypeSection && onContinueTypeSection("Independiente")}
                    >
                      Publicar como Independiente
                    </CustomButton>
                  </div>
                </div>
              ) : (
                  <div className="flex items-center justify-center p-4 w-full">
                      <CustomButton
                          variantType="primary"
                          type="submit"
                          size="medium"
                          isLoading={false}
                          className="!normal-case"
                          onClick={onContinue}
                      >
                          {continueText}
                      </CustomButton>
                  </div>
              )}
            </DialogActions>
          ) : null
        }
      </>
    </Dialog>
  );
};

export default CustomModal;
