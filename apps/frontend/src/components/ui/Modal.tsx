import { X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  onClose?: () => void;
  noBackdrop?: boolean;
}

const Modal: FC<ModalProps> = ({
  children,
  title,
  isOpen,
  onClose,
  noBackdrop = false,
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

  return createPortal(
    <>
      {/* Modal */}
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
        id="modal"
        className={`
        fixed inset-0 top-1/2 left-1/2 z-99 m-0 h-fit max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-3xl -translate-1/2 overflow-hidden
        rounded-lg border-3 border-(--accent)/80 outline-0 backdrop:black-blur-sm sm:max-h-[calc(100dvh-2rem)] ${noBackdrop ? "" : "backdrop:bg-black/60"}`}
      >
        {/* Modal Container*/}
        <div className="flex max-h-[calc(100dvh-1rem)] w-full flex-col gap-2 bg-(--primary) p-3 sm:max-h-[calc(100dvh-2rem)] sm:gap-3 sm:p-5">
          {/* Modal Header */}
          <div className="flex shrink-0 items-center justify-between gap-2 px-1 sm:px-2">
            <h3 className="min-w-0 truncate text-lg! tracking-wide sm:text-xl!">
              {title}
            </h3>
            <button
              title="Close"

              onClick={() => {
                if (onClose) onClose();
              }}
              className="stroke-(--heading) cursor-pointer flex items-center h-full"
            >
              <X className="stroke-inherit! h-full" />
            </button>
          </div>

          {/* Divider */}
          <div className="w-full shrink-0 px-1 sm:px-2">
            <div className="divider m-0!"></div>
          </div>

          {/* Modal Content */}
          <div className="min-h-0 w-full flex-1 overflow-y-auto px-1 sm:px-2">
            {children}
          </div>
        </div>
      </motion.dialog>
    </>,
    document.body
  );
};

export default Modal;
