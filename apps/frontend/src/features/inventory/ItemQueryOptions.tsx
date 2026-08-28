import SelectInventoryItemUnits from "@/components/shared/SelectInventoryItemUnits";
import SelectNumberRange from "@/components/shared/SelectNumberRange";
import {
  inventoryItemSortBy,
  type GetInventoryItemsReqQuery,
  type InventoryItemFilterSchema,
  type inventoryItemOptionsSchema,
} from "@repo/shared";
import { useEffect, useState, type FC } from "react";

interface ItemQueryOptionsProps {
  initialFilter?: GetInventoryItemsReqQuery;
  onChange: (value: GetInventoryItemsReqQuery) => void;
}

const ItemQueryOptions: FC<ItemQueryOptionsProps> = ({
  onChange,
  initialFilter = {},
}) => {
  const [filter, setFilter] = useState<InventoryItemFilterSchema>(
    initialFilter.filter ?? {}
  );
  const [options] = useState<inventoryItemOptionsSchema>(
    initialFilter.options ?? {}
  );

  useEffect(() => {
    if (onChange) onChange({ filter, options });
  }, [filter]);

  return (
    <div className="size-full">
      <div className="grid grid-cols-4 gap-y-2">
        {/* Category */}
        <div className="col-span-4 grid grid-cols-4 items-center">
          <span className="font-semibold text-(--text-muted)! text-sm col-span-1">
            Category:
          </span>
          <div className="col-span-3 flex">
            <input type="text" />
          </div>
        </div>

        {/* Unit */}
        <div className="col-span-4 grid grid-cols-4 items-center">
          <span className="font-semibold text-(--text-muted)! text-sm col-span-1">
            Units:
          </span>
          <div className="col-span-3 flex">
            <SelectInventoryItemUnits
              initialSelectedUnits={initialFilter.filter?.unit}
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
          <div className="col-span-3 flex">
            <SelectNumberRange
              initialRange={initialFilter.filter?.quantity}
              onChange={(value) => {
                setFilter((prev) => {
                  return {
                    ...prev,
                    quantity: value ?? undefined,
                  };
                });
              }}
            />
          </div>
        </div>

        <div className="divider col-span-4 my-3!"></div>

        <div className="col-span-4 grid grid-cols-4 items-center">
          <span className="font-semibold text-(--text-muted)! text-sm col-span-1">
            Sort By:
          </span>

          <div className="col-span-3 flex">
            <select>
              {inventoryItemSortBy.map((field) => {
                return (
                  <option key={field} value={field}>
                    {field}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemQueryOptions;
