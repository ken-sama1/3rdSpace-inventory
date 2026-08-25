import SelectInventoryItemUnits from "@/components/shared/SelectInventoryItemUnits";
import SelectNumberRange from "@/components/shared/SelectNumberRange";
import type { InventoryItemFilterSchema } from "@repo/shared";
import { useEffect, useState, type FC } from "react";

interface ItemFilterProps {
  initialFilter?: InventoryItemFilterSchema;
  onChange: (filter: InventoryItemFilterSchema) => void;
}

const ItemFilter: FC<ItemFilterProps> = ({ onChange, initialFilter = {} }) => {
  const [filter, setFilter] =
    useState<InventoryItemFilterSchema>(initialFilter);

  useEffect(() => {
    if (onChange) onChange(filter);
  }, [filter]);

  return (
    <div className="size-full">
      <div className="grid grid-cols-4 gap-y-2">
        {/* Unit */}
        <div className="col-span-4 grid grid-cols-4 items-center">
          <span className="font-semibold text-(--text-muted)! text-sm col-span-1">
            Units:
          </span>
          <div className="col-span-3">
            <SelectInventoryItemUnits
              initialSelectedUnits={initialFilter.unit}
              onChange={(units) =>
                setFilter((prev) => {
                  return { ...prev, unit: units };
                })
              }
            />
          </div>
        </div>

        {/* Quantity  */}
        <div className="col-span-4 grid grid-cols-4 items-center">
          <span className="font-semibold text-(--text-muted)! text-sm col-span-1">
            Quantity
          </span>
          <div className="col-span-3">
            <SelectNumberRange />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemFilter;
