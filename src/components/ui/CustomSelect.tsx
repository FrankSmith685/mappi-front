import { forwardRef } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  SelectProps,
} from "@mui/material";

interface SelectOption {
  value: string | number | boolean;
  label: string;
}

interface CustomSelectProps extends Omit<SelectProps, "error"> {
  label: string;
  name: string;
  options: SelectOption[];
  errorMessage?: string;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
}
const getInputSize = () => (window.innerWidth < 640 ? "small" : "medium");

const CustomSelect = forwardRef<HTMLDivElement, CustomSelectProps>(
  ({ label, name, value, onChange, options = [], errorMessage, color = "primary", ...rest }, ref) => {
    return (
      <FormControl
        fullWidth
        error={!!errorMessage}
        size={getInputSize()}
        sx={{
            
            "& .MuiFormHelperText-root": {
                marginTop: "1px",
                lineHeight: "1.2",
                fontSize: "12px",
            },
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            borderColor: "#ccc",
            transition: "border-color 0.3s ease",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
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
        }}
      >
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          ref={ref}
          labelId={`${name}-label`}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          label={label}
          color={color}
          {...rest}
        >
          {options.map((option) => (
            <MenuItem key={option.value as string | number} value={option.value as string | number}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

export default CustomSelect;
