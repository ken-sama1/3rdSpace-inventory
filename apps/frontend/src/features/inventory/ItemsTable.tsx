import StockStatus from "@/components/ui/StockStatus";
import Table from "@/components/ui/Table";
import { useStockConfig } from "@/hooks/useStockConfig";
import type { InventoryItemDto } from "@repo/shared";
import { useState, type FC } from "react";
import InventoryModal from "./InventoryModal";

interface ItemsTableProps {
  items: InventoryItemDto[];
}

const ItemsTable: FC<ItemsTableProps> = ({ items = [] }) => {
  const { getStatus } = useStockConfig();
  const [item, setItem] = useState<InventoryItemDto | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!items.length) return <></>;

  return (
    <div className="h-full w-full">
      {item && (
        <InventoryModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          itemId={item.id}
        />
      )}

      <Table
        className="border"
        data={items.map((item) => {
          return {
            ...item,
            status: getStatus(item.quantity, item.unit),
          };
        })}
        options={{
          cell: {
            style: {
              justifyContent: "start",
            },
          },
          row: {
            onClick: (item) => {
              setShowEditModal(true);
              setItem(item);
            },
            style: {
              cursor: "pointer",
            },
          },
          columns: 12,
          column: {
            name: {
              index: 0,
              colspan: 3,
              as: "ITEM",
            },
            quantity: {
              index: 1,
              colspan: 2,
            },
            unit: {
              index: 2,
              colspan: 2,
              style: {
                textTransform: "lowercase",
              },
            },
            category: {
              index: 3,
              colspan: 3,
              value: (v) => {
                return !v?.name ? "Uncategorized" : v.name;
              },
            },
            status: {
              colspan: 2,
              value: (v) => {
                return <StockStatus variant={v} />;
              },
            },
          },
          exlude: ["id", "categoryId", "description", "imageUrl"],
        }}
      />
    </div>
  );
};

export default ItemsTable;
