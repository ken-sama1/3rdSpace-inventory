import type { ToastProps } from "@/components/ui/Toast";
import Toast from "@/components/ui/Toast";
import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";

type ShowToast = (args: {
  message: string;
  variant?: ToastProps["variant"];
  forceToTop?: boolean;
}) => void;

interface ToastContextProps {
  showToast: ShowToast;
  hideToast?: () => void;
}

const ToastContext = createContext<null | ToastContextProps>(null);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
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

export const useToastContext = () => {
  const context = useContext(ToastContext);

  if (!context)
    throw new Error("useToastContext must be within a ToastProvider");

  return context;
};
