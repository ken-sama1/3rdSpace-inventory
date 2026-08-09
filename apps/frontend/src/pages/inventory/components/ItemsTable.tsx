import { inventoryItemApi } from "@/api/inventory-items.api";
import Table from "@/components/ui/Table";
import { useQuery } from "@tanstack/react-query";
import { useState, type CSSProperties } from "react";
import EditItemModal from "./EditItemModal";

const ItemsTable = () => {
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

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-items"],
    queryFn: ({ signal }) => inventoryItemApi.getAll({}, { signal }),
  });

  console.log(data);
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
                  itemId: item.itemId,
                });
              },
              style: (rowData): CSSProperties => {
                const lowStock = rowData.quantity <= 1000;
                const noStock = rowData.quantity <= 0;

                const baseStyle: CSSProperties = {
                  cursor: "pointer",
                  paddingLeft: "10px",
                  borderLeft: "6px solid",
                  borderRadius: "4px 0 0 4px",
                };

                if (noStock) {
                  return {
                    ...baseStyle,
                    borderLeftColor: "var(--color-red-500)",
                  };
                }

                if (lowStock) {
                  return {
                    ...baseStyle,
                    borderLeftColor: "var(--color-amber-500)",
                  };
                }

                return {
                  ...baseStyle,
                  borderLeftColor: "var(--color-emerald-500)",
                };
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
            exlude: ["itemId", "description", "imageUrl", "category"],
          }}
        />
      )}
    </div>
  );
};

export default ItemsTable;
