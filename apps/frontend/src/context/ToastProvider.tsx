import type { ToastProps } from "@/components/ui/Toast";
import { useState, type FC, type ReactNode } from "react";
import { ToastContext, type ShowToast } from "./ToastContext";
import Toast from "@/components/ui/Toast";

const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastProps>({
    children: null,
    isOpen: false,
  });

  const showToast: ShowToast = ({
    message,
    variant = "info",
    forceToTop = false,
  }) => {
    setToast({
      isOpen: true,
      children: message,
      variant,
      forceToTop,
    });
  };

  const hideToast = () => {
    setToast({ children: null, isOpen: true });
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        forceToTop={toast.forceToTop}
        isOpen={toast.isOpen}
        variant={toast.variant}
        onClose={() => {
          setToast({ isOpen: false, children: null });
        }}
      >
        {toast.children}
      </Toast>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
