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
  const [prevQuantity, setPrevQuantity] = useState(0);
  const [quantity, setQuantity] = useState<number | null>(1);

  useEffect(() => {
    if (!quantity) {
    }

    if (callback && quantity) {
      callback(quantity);
    }
  }, [quantity]);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => {
          if (quantity) {
            setQuantity(quantity - step);
          } else {
            setQuantity(prevQuantity - step);
          }
        }}
        disabled={(quantity ?? Infinity) <= min}
        type="button"
        className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-md border border-(--line) active:scale-95 transition-all"
        aria-label="Increase quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <input
        onChange={(e) => {
          if (!e.target.value) {
            if (quantity) setPrevQuantity(quantity);
            setQuantity(null);
          }
          const value = Number(e.target.value);
          if (value < min || value > max) return;
          setQuantity(value);
        }}
        value={quantity ?? ""}
        type="number"
        className="w-10! text-center! font-mono! text-sm! font-semibold!"
      />

      <button
        disabled={(quantity ?? 1) >= max}
        onClick={() => {
          if (quantity) {
            setQuantity(quantity + step);
          } else {
            setQuantity(prevQuantity + step);
          }
        }}
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
