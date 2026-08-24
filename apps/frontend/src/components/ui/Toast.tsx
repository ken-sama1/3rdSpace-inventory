import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ToastVariant = "warning" | "success" | "danger" | "info";

export interface ToastProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  duration?: number;
  variant?: ToastVariant;
  /** Render on top of an open dialog if there is any*/
  forceToTop?: boolean;
}

const Toast: FC<ToastProps> = ({
  children,
  isOpen,
  onClose,
  duration = 2000,
  variant = "info",
  forceToTop = false,
}) => {
  const modal = document.getElementById("modal");
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && toastRef.current) {
      toastRef.current.showPopover();
    }

    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{
              opacity: 0,
              x: 1000,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              x: 1000,
            }}
            style={{
              color: `var(--text-${variant})`,
              backgroundColor: `var(--bg-${variant})`,
              borderColor: `var(--border-${variant})`,
            }}
            className="
            fixed z-99 border overflow-hidden bottom-15 right-5 w-auto min-w-64 px-2 min-h-12 rounded-lg
            flex justify-start items-center gap-2 m-0! top-auto! left-auto!
            "
            popover="manual"
            ref={toastRef}
          >
            {variant === "info" && (
              <InfoIcon
                style={{
                  stroke: `var(--text-${variant})`,
                }}
              />
            )}
            {variant === "success" && (
              <CircleCheckIcon
                style={{
                  stroke: `var(--text-${variant})`,
                }}
              />
            )}
            {variant === "warning" && (
              <CircleAlertIcon
                style={{
                  stroke: `var(--text-${variant})`,
                }}
              />
            )}
            {variant === "danger" && (
              <CircleXIcon
                style={{
                  stroke: `var(--text-${variant})`,
                }}
              />
            )}

            <div className="w-full h-full flex flex-col text-inherit! text-sm!">
              {children}
            </div>
            <button
              onClick={() => {
                if (onClose) onClose();
              }}
              title="dismiss"
              className="cursor-pointer"
            >
              <XIcon />
            </button>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    !forceToTop
      ? document.body
      : modal
        ? modal
        : (document.querySelector("dialog[open]") ?? document.body)
  );
};

export default Toast;
