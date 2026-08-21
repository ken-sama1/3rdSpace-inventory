import StockStatus from "@/components/ui/badges/StockStatus";
import Table from "@/components/ui/Table";
import useStockConfig from "@/hooks/useStockConfig";
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
        data={items}
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
            element: (rowData) => {
              const stockStatus = getStatus(rowData.quantity, rowData.unit);

              return (
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  <StockStatus variant={stockStatus} />
                </div>
              );
            },
          },
          columns: 11,
          column: {
            name: {
              index: 0,
              colspan: 3,
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
                return !v ? "Uncategorized" : v;
              },
            },
          },
          exlude: ["id", "description", "imageUrl"],
        }}
      />
    </div>
  );
};

export default ItemsTable;
