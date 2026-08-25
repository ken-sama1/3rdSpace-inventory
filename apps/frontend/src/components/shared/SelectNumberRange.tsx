import type { NumberFilterSchema } from "@repo/shared";
import { useEffect, useState, type FC } from "react";

export interface SelectNumberRangeProps {
  initialRange?: NumberFilterSchema;
  onChange?: (range: NumberFilterSchema | null) => void;
}

const SelectNumberRange: FC<SelectNumberRangeProps> = ({
  onChange,
  initialRange,
}) => {
  const [mode, setMode] = useState<"number" | "range">("range");
  const [range, setRange] = useState<NumberFilterSchema | null>(
    initialRange ?? null
  );

  useEffect(() => {
    onChange?.(range);
  }, [range, onChange]);

  return (
    <div className="flex size-full items-center justify-start gap-2">
      <div className="w-4/5 flex">
        {mode === "number" && (
          <input
            defaultValue={typeof range === "number" ? range : ""}
            className="w-full! py-1!"
            type="number"
            onChange={(e) => {
              setRange(Number(e.target.value));
            }}
          />
        )}

        {mode === "range" && (
          <div className="flex items-center gap-x-2">
            <input
              defaultValue={typeof range !== "number" ? range?.gte : ""}
              className="w-1/2! py-1!"
              type="number"
              placeholder="Min"
              onChange={(e) => {
                const value = Number(e.target.value);

                setRange((prev) => {
                  if (typeof prev === "number" || !prev)
                    return {
                      gte: value,
                    };

                  return (prev.gte = value);
                });
              }}
            />

            <span>–</span>

            <input
              className="w-1/2! py-1!"
              type="number"
              placeholder="Max"
              defaultValue={typeof range !== "number" ? range?.lte : ""}
              onChange={(e) => {
                const value = Number(e.target.value);
                setRange((prev) => {
                  if (typeof prev === "number" || !prev)
                    return {
                      gte: value,
                    };

                  return (prev.gte = value);
                });
              }}
            />
          </div>
        )}
      </div>

      <div className="flex w-1/5">
        <select
          defaultValue="number"
          className="py-0.5!"
          onChange={(e) => {
            setMode(e.target.value as typeof mode);
          }}
        >
          <option value="number">Number</option>
          <option value="range">Range</option>
        </select>
      </div>
    </div>
  );
};

export default SelectNumberRange;
