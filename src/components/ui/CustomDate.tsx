import { forwardRef } from "react";
import { TextField, TextFieldProps } from "@mui/material";

interface DateInputProps extends Omit<TextFieldProps, "color" | "error"> {
  label?: string;
  name: string;
  errorMessage?: string;
  size?: "small" | "medium";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  maxDate?: string | number;
}

const getInputSize = () => (window.innerWidth < 640 ? "small" : "medium");

const CustomDate = forwardRef<HTMLDivElement, DateInputProps>(
  ({ label, name, errorMessage, size = getInputSize(), color = "primary", maxDate ,...rest }, ref) => {

    let computedMaxDate = undefined;

    if (typeof maxDate === "number") {
      // Calcula la fecha máxima permitida (ej: hace 18 años desde hoy)
      const today = new Date();
      today.setFullYear(today.getFullYear() - maxDate);
      computedMaxDate = today.toISOString().split("T")[0];
    } else if (typeof maxDate === "string") {
      computedMaxDate = maxDate; // Usa la fecha proporcionada directamente
    }


    return (
      <div style={{ position: "relative", width: "100%" }}>
        <TextField
          ref={ref}
          id={name}
          name={name}
          label={label}
          type="date"
          fullWidth
          size={size}
          color={color}
          error={!!errorMessage}
          helperText={errorMessage}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: computedMaxDate }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": {
                borderColor: "#ccc",
                transition: "border-color 0.3s ease",
              },
              "&:hover fieldset": {
                borderColor: "#888",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ff6c4f",
              },
            },
            "& .MuiInputLabel-root": {
              fontSize: "16px",
              "@media (max-width: 640px)": {
                fontSize: "14px",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#ff6c4f",
            },
            "& .MuiFormHelperText-root": {
              marginTop: "1px",
              fontSize: "12px",
              lineHeight: "1.2",
              color: errorMessage ? "#d32f2f" : "#666",
              
            },
          }}
          {...rest}
        />
      </div>
    );
  }
);

CustomDate.displayName = "CustomDate";

export default CustomDate;
