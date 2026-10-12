import { inventoryItemUnits, type InventoryItemUnitSchema } from "@repo/shared";
import { useState, type FC } from "react";

interface SelectInventoryItemUnitsProps {
  onChange?: (selectedUnits: InventoryItemUnitSchema[]) => void;
  initialSelectedUnits?: InventoryItemUnitSchema[];
}

const SelectInventoryItemUnits: FC<SelectInventoryItemUnitsProps> = ({
  onChange,
  initialSelectedUnits = [],
}) => {
  const [selectedUnits, setSelectedUnits] =
    useState<InventoryItemUnitSchema[]>(initialSelectedUnits);

  const handleUnitClick = (unit: InventoryItemUnitSchema) => {
    const nextUnits = selectedUnits.includes(unit)
      ? selectedUnits.filter((v) => v !== unit)
      : [...selectedUnits, unit];

    const isSelectedAll = inventoryItemUnits.every((v) =>
      nextUnits.includes(v)
    );

    const finalUnits = isSelectedAll ? [] : nextUnits;

    setSelectedUnits(finalUnits);
    onChange?.(finalUnits);
  };

  return (
    <div className="size-full grid">
      <div className="flex flex-wrap justify-start gap-2">
        {inventoryItemUnits.map((unit) => {
          const isSelected = selectedUnits.includes(unit);

          return (
            <button
              key={unit}
              type="button"
              onClick={() => {
                handleUnitClick(unit);
              }}
              className={`py-1! px-2.5! text-xs! button-outlined ${
                isSelected ? "status-info" : ""
              }`}
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
