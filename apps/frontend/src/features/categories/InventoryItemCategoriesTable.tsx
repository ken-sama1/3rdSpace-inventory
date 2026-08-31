import Table from "@/components/ui/Table";
import type { InventoryItemCategoryWithItemsDto } from "@repo/shared";
import { useState, type FC } from "react";
import InventoryItemCategoryModal from "./InventoryItemCategoryModal";

interface InventoryItemCategoriesTableProps {
  categories: InventoryItemCategoryWithItemsDto[];
}

const InventoryItemCategoriesTable: FC<InventoryItemCategoriesTableProps> = ({
  categories,
}) => {
  const [category, setCategory] =
    useState<null | InventoryItemCategoryWithItemsDto>(null);
  const [showItemModal, setShowItemModal] = useState<boolean>(false);

  return (
    <div className="size-full">
      <Table
        data={categories.map((category) => {
          return {
            ...category,
          };
        })}
        options={{
          row: {
            style: {
              cursor: "pointer",
            },
            onClick: (v) => {
              setCategory(v);
              setShowItemModal(true);
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
          },
          exlude: ["id"],
        }}
      />

      {category && (
        <InventoryItemCategoryModal
          isOpen={showItemModal}
          onClose={() => setShowItemModal(false)}
          category={category}
        />
      )}
    </div>
  );
};

export default InventoryItemCategoriesTable;
