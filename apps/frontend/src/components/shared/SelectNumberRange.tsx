import type { NumberFilterSchema } from "@repo/shared";
import { useEffect, useState, type FC } from "react";

export interface SelectNumberRangeProps {
  initialRange?: NumberFilterSchema;
  onChange?: (range: NumberFilterSchema | null) => void;
}

const SelectNumberRange: FC<SelectNumberRangeProps> = ({
  onChange,
  initialRange = null,
}) => {
  const [range, setRange] = useState<NumberFilterSchema | null>(initialRange);
  const [mode, setMode] = useState<"number" | "range">(
    typeof range === "number" ? "number" : "range"
  );

  useEffect(() => {
    console.log(range);
    onChange?.(range);
  }, [range, onChange]);

  return (
    <div className="flex size-full items-center justify-start gap-2">
      <div className="w-4/6 flex">
        {mode === "number" && (
          <input
            value={typeof range === "number" ? String(range) : ""}
            className="w-full! py-1!"
            type="number"
            onChange={(e) => {
              if (!e.target.value) return setRange(null);
              setRange(Number(e.target.value));
            }}
          />
        )}

        {mode === "range" && (
          <div className="flex justify-center items-center gap-x-2">
            <input
              className="w-1/2! py-1!"
              type="number"
              placeholder="Min"
              value={typeof range === "object" ? (range?.gte ?? "") : ""}
              onChange={(e) => {
                console.log("value: ", range);
                if (!e.target.value) {
                  setRange((prev) => {
                    if (typeof prev === "object")
                      setRange({
                        ...prev,
                        gte: undefined,
                      });
                  });
                  return;
                }

                const value = Number(e.target.value);

                setRange((prev) => {
                  if (typeof prev === "number" || !prev)
                    return {
                      gte: value,
                    };

                  return {
                    ...prev,
                    gte: value,
                  };
                });
              }}
            />

            <span>–</span>

            <input
              className="w-1/2! py-1!"
              type="number"
              placeholder="Max"
              value={typeof range === "object" ? (range?.lte ?? "") : ""}
              onChange={(e) => {
                if (!e.target.value) {
                  return setRange((prev) => {
                    if (typeof prev === "object")
                      setRange({
                        ...prev,
                        lte: undefined,
                      });
                  });
                }

                const value = Number(e.target.value);
                setRange((prev) => {
                  if (typeof prev === "number" || !prev)
                    return {
                      lte: value,
                    };

                  return {
                    ...prev,
                    lte: value,
                  };
                });
              }}
            />
          </div>
        )}
      </div>

      <div className="flex w-2/6">
        <select
          value={mode}
          className="py-1! w-full! text-center!"
          onChange={(e) => {
            setMode(e.target.value as typeof mode);
          }}
        >
          <option value="number" className="text-center">
            Number
          </option>
          <option value="range">Range</option>
        </select>
      </div>
    </div>
  );
};

export default SelectNumberRange;
