import StockStatus from "@/components/ui/badges/StockStatus";
import Table from "@/components/ui/Table";
import useGetInventoryItems from "@/hooks/inventory/useGetInventoryItems";
import useStockConfig from "@/hooks/useStockConfig";
import { useState } from "react";
import EditItemModal from "./EditItemModal";

const ItemsTable = () => {
  const { getStatus } = useStockConfig();

  const [editModal, setEditModal] = useState<
    | {
        isOpen: false;
        itemId: null;
      }
    | { isOpen: true; itemId: string }
  >({
    isOpen: false,
    itemId: null,
  });

  const { data, isLoading } = useGetInventoryItems();

  return (
    <div className="h-full">
      {editModal.isOpen && (
        <EditItemModal
          isOpen={editModal.isOpen}
          onClose={() =>
            setEditModal({
              isOpen: false,
              itemId: null,
            })
          }
          itemId={editModal.itemId}
        />
      )}
      {!isLoading && data && (
        <Table
          className="border"
          data={data}
          options={{
            cell: {
              style: {
                justifyContent: "start",
              },
            },
            row: {
              onClick: (item) => {
                setEditModal({
                  isOpen: true,
                  itemId: item.id,
                });
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
            columns: 7,
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
            },
            exlude: ["id", "description", "imageUrl", "category"],
          }}
        />
      )}
    </div>
  );
};

export default ItemsTable;
