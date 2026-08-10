import { useState, type FC } from "react";
import { motion } from "motion/react";

export interface ToggleSwitchProps {
  onToggle?: (isOn: boolean) => void;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({ onToggle }) => {
  const [isOn, setIsOn] = useState(false);

  return (
    <button
      onClick={() => {
        setIsOn(!isOn);
        if (onToggle) onToggle(isOn);
      }}
      className={`flex items-center cursor-pointer w-12 h-7 rounded-full p-1 border transition-colors duration-200 ${
        isOn
          ? "bg-(--bg-info) border-(--line-info)"
          : "bg-(--bg-disabled) border-(--line-disabled)"
      }`}
      type="button"
    >
      <motion.div
        className={`h-full aspect-square rounded-full transition-colors duration-200 ${
          isOn ? "bg-(--text-info)" : "bg-(--text-disabled)"
        }`}
        animate={{ x: isOn ? 20 : 0 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
    </button>
  );
};

export default ToggleSwitch;
