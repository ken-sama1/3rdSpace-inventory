import SelectInventoryItemUnits from "@/components/shared/SelectInventoryItemUnits";
import SelectNumberRange from "@/components/shared/SelectNumberRange";
import {
  inventoryItemSortBy,
  inventoryItemSortOrder,
  type GetInventoryItemsReqQuery,
  type InventoryItemFilterSchema,
  type inventoryItemOptionsSchema,
  type InventoryItemSortBySchema,
  type SortOrderSchema,
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
  const [options, seOptions] = useState<inventoryItemOptionsSchema>(
    initialFilter.options ?? {}
  );

  useEffect(() => {
    if (onChange) onChange({ filter, options });
  }, [filter, options]);

  return (
    <div className="size-full">
      <div className="grid grid-cols-4 gap-y-2">
        <div className="col-span-4 grid items-center grid-cols-5 gap-x-2">
          <div className="col-span-2 divider my-0!"></div>
          <span className="text-(--text-muted)! text-center font-semibold">
            Filter
          </span>
          <div className="col-span-2 divider my-0!"></div>
        </div>

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

        {/* Sort Section */}
        <div className="col-span-4 grid items-center grid-cols-5 gap-x-2">
          <div className="col-span-2 divider my-0!"></div>
          <span className="text-(--text-muted)! text-center font-semibold">
            Sort
          </span>
          <div className="col-span-2 divider my-0!"></div>
        </div>

        {/* Sort By */}
        <div className="col-span-4 grid grid-cols-4 items-center">
          <span className="font-semibold text-(--text-muted)! text-sm col-span-1">
            Sort By:
          </span>

          <div className="col-span-3 flex">
            <select
              value={options.sortBy}
              onChange={(e) => {
                seOptions((prev) => {
                  return {
                    ...prev,
                    sortBy: e.target.value as InventoryItemSortBySchema,
                  };
                });
              }}
              className="py-1! text-center!"
            >
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

        {/* Order */}
        <div className="col-span-4 grid grid-cols-4 items-center">
          <span className="font-semibold text-(--text-muted)! text-sm col-span-1">
            Order:
          </span>

          <div className="col-span-3 flex">
            <select
              value={options.order}
              onChange={(e) => {
                seOptions((prev) => {
                  return {
                    ...prev,
                    order: e.target.value as SortOrderSchema,
                  };
                });
              }}
              className="text-center! py-1!"
            >
              {inventoryItemSortOrder.map((field) => {
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
