import { motion } from "motion/react";
import { useEffect, useRef, type FC, type ReactNode } from "react";

interface DialogProps {
  children: ReactNode;
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  variant?: "danger" | "accent";
  cancelText?: string;
  confirmText?: string;
}

const Dialog: FC<DialogProps> = ({
  children,
  title,
  isOpen,
  onClose,
  onConfirm,
  variant = "accent",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  if (!isOpen) return <></>;

  return (
    <>
      {/* Dialog */}
      <motion.dialog
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          type: "spring",
          // bounce: 0.2,
          duration: 0.4,
        }}
        exit={{
          scale: 0,
          opacity: 0,
        }}
        onClose={onClose}
        ref={dialogRef}
        className={`
        absolute top-1/2 left-1/2 -translate-1/2 inset-0 z-99 overflow-hidden rounded-lg
        border-3 border-(--accent)/80 outline-0 backdrop:bg-black/60 backdrop:black-blur-sm`}
      >
        {/* Dialog Container*/}
        <div className="flex flex-col w-full h-full bg-(--primary) p-3 gap-3">
          {title && (
            <>
              {/* Dialog Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg!">{title}</h3>
              </div>

              {/* Divider */}
              <div className="divider m-0!"></div>
            </>
          )}
          {/* Dialog Content */}
          <div className="size-full">{children}</div>

          {/* Dialog Buttons */}
          <div className="w-full gap-2 flex justify-end items-center">
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
              }}
              className="button-outlined py-1! font-semibold! px-3! text-xs!"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                if (onConfirm) {
                  onConfirm();
                }
              }}
              className={`button-${variant} font-semibold! py-1! px-3! text-xs!`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </motion.dialog>
    </>
  );
};

export default Dialog;
