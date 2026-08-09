import { X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  onClose?: () => void;
}

const Modal: FC<ModalProps> = ({ children, title, isOpen, onClose }) => {
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
        className={`
        fixed top-1/2 left-1/2 -translate-1/2 inset-0 z-99 overflow-hidden
        max-w-2/3 max-h-[calc(100dvh-60px)] rounded-lg 
        border-3 border-(--accent)/80 outline-0 backdrop:bg-black/60 backdrop:black-blur-sm`}
      >
        {/* Modal Container*/}
        <div className="flex flex-col w-full h-full max-h-full bg-(--primary) p-5 gap-3">
          {/* Modal Header */}
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl!">{title}</h3>
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
          <div className="w-full px-2">
            <div className="divider m-0!"></div>
          </div>

          {/* Modal Content */}
          <div className="size-full px-2 z-1 flex justify-center items-center">
            {children}
          </div>
        </div>
      </motion.dialog>
    </>,
    document.body
  );
};

export default Modal;
