import { inventoryItemUnits, type InventoryItemUnit } from "@repo/shared";
import { useEffect, useState, type FC } from "react";

interface SelectInventoryItemUnitsProps {
  onChange?: (selectedUnits: InventoryItemUnit[]) => void;
  initialSelectedUnits?: InventoryItemUnit[];
}

const SelectInventoryItemUnits: FC<SelectInventoryItemUnitsProps> = ({
  onChange,
  initialSelectedUnits = [],
}) => {
  const [selectedUnits, setSelectedUnits] =
    useState<InventoryItemUnit[]>(initialSelectedUnits);

  useEffect(() => {
    const isSelectedAll = inventoryItemUnits.every((v) =>
      selectedUnits.includes(v)
    );

    if (isSelectedAll) setSelectedUnits([]);

    if (onChange) onChange(selectedUnits);
  }, [selectedUnits, onChange]);

  return (
    <div className="size-full  grid">
      <div className="flex flex-wrap justify-start gap-2">
        {inventoryItemUnits.map((unit) => {
          const isSelected = selectedUnits.includes(unit);

          return (
            <button
              onClick={() => {
                isSelected
                  ? setSelectedUnits((prev) => prev.filter((v) => v !== unit))
                  : setSelectedUnits((prev) => [...prev, unit]);
              }}
              type="button"
              key={unit}
              className={`py-1! px-2.5! text-xs! button-outlined ${isSelected && "status-info"}`}
            >
              {unit}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectInventoryItemUnits;
