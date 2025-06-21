import { forwardRef } from "react";
import { Button, ButtonProps, CircularProgress } from "@mui/material";

type ButtonVariant =
  | "primary"
  | "primary-v2"
  | "primary-outline"
  | "primary-outline-white"
  | "primary-outline-transparent"
  | "secondary"
  | "secondary-outline"
  | "danger"
  | "danger-outline"
  | "terciary";

interface CustomButtonProps extends Omit<ButtonProps, "color"> {
  variantType?: ButtonVariant;
  isLoading?: boolean;
}

const getVariantStyles = (variant: ButtonVariant) => {
  const commonStyles = {
    fontSize: "14px", // text-xs
    transition: "all 0.3s ease-in-out",
    transform: "scale(1)",
    lineHeight: "1rem", // leading-
  };

  switch (variant) {
    case "primary":
      return {
        ...commonStyles,
        backgroundColor: "#ff6c4f",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#E64A19",
          transform: "scale(1.05)",
        },
        "&.Mui-disabled": {
          color: "#fff",
          backgroundColor: "#ff6c4f",
          opacity: 0.6,
        },
      };
    case "primary-v2":
      return {
        ...commonStyles,
        background: "linear-gradient(to bottom, #FF8949 5%, #FF6333 33%, #FF4722 66%, #FF200C 100%)",
        borderRadius: "20px",
        color: "#fff",
        "&:hover": { opacity: 0.8, transform: "scale(1.05)" },
      };
    case "primary-outline":
      return {
        ...commonStyles,
        border: "1px solid #ff6c4f",
        color: "#ff6c4f",
        "&:hover": { backgroundColor: "#FFF3E0", transform: "scale(1.05)" },
      };
    case "primary-outline-white":
      return {
        ...commonStyles,
        border: "1px solid #FFF3E0",
        color: "#FFF3E0",
        "&:hover": { backgroundColor: "rgba(255, 243, 224, 0.1)", color: "#FFE0B2", transform: "scale(1.05)" },
      };
    case "primary-outline-transparent":
      return {
        ...commonStyles,
        color: "#FFF3E0",
        backgroundColor: "transparent",
        "&:hover": { backgroundColor: "rgba(255, 243, 224, 0.1)", color: "#FFE0B2", transform: "scale(1.05)" },
      };
    case "secondary":
      return {
        ...commonStyles,
        backgroundColor: "#757575",
        color: "#fff",
        "&:hover": { backgroundColor: "#616161", transform: "scale(1.05)" },
      };
    case "secondary-outline":
      return {
        ...commonStyles,
        border: "1px solid #757575",
        color: "#757575",
        "&:hover": { backgroundColor: "#F5F5F5", transform: "scale(1.05)" },
      };
    case "danger":
      return {
        ...commonStyles,
        backgroundColor: "#D32F2F",
        color: "#fff",
        "&:hover": { backgroundColor: "#B71C1C", transform: "scale(1.05)" },
      };
    case "danger-outline":
      return {
        ...commonStyles,
        border: "1px solid #D32F2F",
        color: "#D32F2F",
        "&:hover": { backgroundColor: "#FFEBEE", transform: "scale(1.05)" },
      };
    case "terciary":
      return {
        ...commonStyles,
        backgroundColor: "#0f2428",
        color: "#fff",
        "&:hover": { opacity: 0.9, transform: "scale(1.05)" },
      };
    default:
      return commonStyles;
  }
};

const getSizeStyles = (size?: ButtonProps["size"]) => {
    switch (size) {
      case "small":
        return { fontSize: "0.8rem", height: "40px", paddingLeft: "12px", paddingRight: "12px" };
      default:
        return { height: "56px", paddingLeft: "16px", paddingRight: "16px" }; // Tamaño medio por defecto
    }
  };
  
  // ForwardRef para compatibilidad con react-hook-form
  const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
    ({ variantType = "primary",isLoading = false, size = "medium", children, sx, ...props }, ref) => {
      return (
        <Button
          ref={ref}
          fullWidth
          disabled={isLoading}
          className=" !transition-all !duration-300 !transform hover:!scale-105"
          sx={{
            borderRadius: "8px", 
            fontWeight: "bold",
            // transition: "all 0.3s ease-in-out", // Transición más fluida
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Sombra inicial
            
            "@media (max-width: 640px)": {
              height: "40px",
              fontSize: "14px",
            },
  
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.2)", // Más sombra al hacer hover
            },
  
            "&:active": {
              transform: "scale(0.97)", // Efecto de pulsación
              boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.15)",
            },
  
            "&:focus": {
              borderColor: "#ff6c4f",
              outline: "2px solid #ff6c4f",
            },
  
            ...getVariantStyles(variantType),
            ...getSizeStyles(size),
            ...sx,
          }}
          size={size}
          {...props}
        >
           {isLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : children}
        </Button>
      );
    }
  );
  
  
CustomButton.displayName = "CustomButton";
export default CustomButton;
