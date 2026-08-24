import { AnimatePresence, motion } from "motion/react";
import type { FC, ReactNode } from "react";

export interface CollapsibleProps {
  isOpen: boolean;
  children: ReactNode;
  onClose?: () => void;
}

const Collapsible: FC<CollapsibleProps> = ({ isOpen, children, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0,
          }}
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.2,
          }}
          className="bg-(--primary) border w-full h-full shadow-black/20 shadow-[4px_4px_6px]"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Collapsible;
