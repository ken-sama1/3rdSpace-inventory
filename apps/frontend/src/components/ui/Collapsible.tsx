import { clickOutside } from "@/utils/clickOutside";
import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useRef,
  type FC,
  type ReactNode,
  type RefObject,
} from "react";

export interface CollapsibleProps {
  isOpen: boolean;
  children: ReactNode;
  onClose?: () => void;
  refs?: RefObject<HTMLElement | null>[];
}

const Collapsible: FC<CollapsibleProps> = ({
  isOpen,
  children,
  onClose,
  refs = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleClickOutside = clickOutside([containerRef, ...refs], () => {
      if (onClose) onClose();
    });

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, containerRef.current]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{
            height: 10,
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            height: "100%",
          }}
          exit={{
            opacity: 0,
            height: 10,
          }}
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.3,
          }}
          className="border-2 border-(--accent)/80 overflow-hidden rounded-lg z-99 size-full"
        >
          <div className="bg-(--primary) size-full p-5 rounded-lg">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Collapsible;
