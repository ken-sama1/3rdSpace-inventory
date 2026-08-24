import SelectInventoryItemUnits from "@/components/shared/SelectInventoryItemUnits";
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
    <form className="size-full">
      <div className="grid grid-cols-4">
        {/* Unit */}
        <div className="col-span-4 grid grid-cols-4 items-center">
          <span className="font-semibold text-(--text-muted)! text-sm col-span-1">
            Units:{" "}
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
      </div>
    </form>
  );
};

export default ItemFilter;
