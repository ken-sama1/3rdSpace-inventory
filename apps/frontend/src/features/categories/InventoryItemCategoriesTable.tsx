import Table from "@/components/ui/Table";
import type { InventoryItemCategoryWithItemsDto } from "@repo/shared";
import type { FC } from "react";

interface InventoryItemCategoriesTableProps {
  categories: InventoryItemCategoryWithItemsDto[];
}

const InventoryItemCategoriesTable: FC<InventoryItemCategoriesTableProps> = ({
  categories,
}) => {
  return (
    <div className="size-full">
      <Table
        data={categories.map((category) => {
          return {
            ...category,
            status: "",
          };
        })}
        options={{
          row: {
            style: {
              cursor: "pointer",
            },
          },
          columns: 9,
          column: {
            name: {
              as: "Category",
              index: 0,
              colspan: 3,
            },
            inventoryItems: {
              index: 1,
              colspan: 3,
              as: "Items",
              value: (items) => {
                return <span>{items.length}</span>;
              },
            },
            status: {
              colspan: 3,
            },
          },
          exlude: ["id"],
        }}
      />
    </div>
  );
};

export default InventoryItemCategoriesTable;
