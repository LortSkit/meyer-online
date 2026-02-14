import { createContext, useContext } from "react";

//Most code stolen from https://www.youtube.com/watch?v=52g9qcTD6ZI

type ToastContextValue = {
  open: (message: string) => void;
  close: (id: number) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => useContext(ToastContext);
