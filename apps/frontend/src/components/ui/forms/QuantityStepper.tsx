import { Minus, Plus } from "lucide-react";
import { useEffect, useState, type FC } from "react";

export interface QuantityStepperProps {
  callback?: (quantity: number) => void;
  step?: number;
  min?: number;
  max?: number;
}

const QuantityStepper: FC<QuantityStepperProps> = ({
  callback,
  step = 1,
  min = 0,
  max = Infinity,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (callback) {
      callback(quantity);
    }
  }, [quantity]);
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setQuantity(quantity - step)}
        disabled={quantity <= min}
        type="button"
        className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-md border border-(--line) active:scale-95 transition-all"
        aria-label="Increase quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <input
        onChange={(e) => {
          const value = Number(e.target.value);
          if (!value) return;

          setQuantity(value);
        }}
        value={quantity}
        type="number"
        className="w-10! text-center! font-mono! text-sm! font-semibold!"
      />

      <button
        disabled={quantity >= max}
        onClick={() => setQuantity(quantity + step)}
        type="button"
        className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-md border border-(--line) active:scale-95 transition-all"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default QuantityStepper;
