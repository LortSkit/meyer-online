import "./Toast.css";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import useTheme from "@mui/material/styles/useTheme";
import Typography from "@mui/material/Typography";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { tokens } from "../../theme";
import { useMemo, useState } from "react";
import { ToastContext } from "../../contexts/Toast/ToastContext";
import { useTimeout } from "usehooks-ts";

//Most code stolen from https://www.youtube.com/watch?v=52g9qcTD6ZI

type ToastProps = {
  message: string;
  close: () => void;
};

export function Toast({ message, close }: ToastProps) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useTimeout(() => {
    close();
  }, 3000);

  return (
    <Box
      display={"flex"}
      bgcolor={colors.blackAccent[700]}
      borderRadius={"5px"}
      padding={"5px"}
      sx={{ animationName: "slidein", animationDuration: "0.3s" }}
    >
      <Box display={"flex"}>
        <Box display={"flex"}>
          <Typography
            fontSize="16px"
            fontStyle="normal"
            textTransform="none"
            style={{
              wordBreak: "break-word",
              textAlign: "center",
            }}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
              maxWidth: "300px",
            }}
            children={message}
          />
        </Box>
        <Box display={"flex"} justifyContent={"top"}>
          <IconButton
            sx={{ maxHeight: "25px", maxWidth: "25px" }}
            onClick={close}
            //   style={{
            //     position: "relative",
            //     width: "20px",
            //     height: "20px",
            //   }}
          >
            <CloseOutlined sx={{ width: "18px", height: "18px" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

type ToastProviderProps = {
  children: React.ReactElement;
};

type ToastType = {
  message: string;
  id: number;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  function openToast(message: string) {
    const newToast = {
      id: Date.now(),
      message: message,
    };
    setToasts((previousToasts) => [...previousToasts, newToast]);
  }

  function closeToast(id: number) {
    setToasts((previousToasts) =>
      previousToasts.filter((toast) => toast.id !== id),
    );
  }

  const contextValue = useMemo(
    () => ({
      open: openToast,
      close: closeToast,
    }),
    [],
  );
  return (
    <Box>
      <ToastContext.Provider value={contextValue}>
        {children}
        <div className="toasts">
          {toasts &&
            toasts.map((toast) => {
              return (
                <Toast
                  key={toast.id}
                  message={toast.message}
                  close={() => closeToast(toast.id)}
                ></Toast>
              );
            })}
        </div>
      </ToastContext.Provider>
    </Box>
  );
}
