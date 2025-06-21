import { useState, ReactNode } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface UseSnackbarReturn {
    showSnackbar: (msg: string, type?: AlertColor) => void;
    SnackbarComponent: () => ReactNode;
}

const useSnackbar = (): UseSnackbarReturn => {
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [severity, setSeverity] = useState<AlertColor>("error");

    const showSnackbar = (msg: string, type: AlertColor = "error") => {
        setMessage(msg);
        setSeverity(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const SnackbarComponent = () => (
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
            <Alert severity={severity} onClose={handleClose} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );

    return { showSnackbar, SnackbarComponent };
};

export default useSnackbar;
