import type { ToastProps } from "@/components/ui/Toast";
import { createContext, useContext } from "react";

export type ShowToast = (args: {
  message: string;
  variant?: ToastProps["variant"];
  forceToTop?: boolean;
}) => void;

interface ToastContextProps {
  showToast: ShowToast;
  hideToast?: () => void;
}

export const ToastContext = createContext<null | ToastContextProps>(null);

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) throw new Error("useToast must be within a ToastProvider");

  return context;
};
