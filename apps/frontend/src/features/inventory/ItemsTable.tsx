import StockStatus from "@/components/ui/badges/StockStatus";
import Dialog from "@/components/ui/popups/Dialog";
import Table from "@/components/ui/Table";
import { useToastContext } from "@/context/ToastContext";
import useStockInInventoryItem from "@/hooks/inventory/useStockInInventoryItem";
import useStockConfig from "@/hooks/useStockConfig";
import type { InventoryItemDto } from "@repo/shared";
import { useState, type FC } from "react";
import EditItemModal from "./EditItemModal";

interface ItemsTableProps {
  onClickEvent?: "edit" | "stock-in" | "stock-out";
  items: InventoryItemDto[];
}

const ItemsTable: FC<ItemsTableProps> = ({
  onClickEvent = "edit",
  items = [],
}) => {
  const { getStatus } = useStockConfig();
  const [item, setItem] = useState<InventoryItemDto | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const { stockIn } = useStockInInventoryItem();
  const { showToast } = useToastContext();

  if (!items.length) return <></>;

  return (
    <div className="h-full w-full">
      {item && (
        <EditItemModal
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
              if (onClickEvent === "edit") setShowEditModal(true);
              if (onClickEvent === "stock-in") setShowDialog(true);
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

      {item && (
        <Dialog
          confirmText="Restock"
          isOpen={showDialog}
          title={`Restock ${item.name}?`}
          variant="accent"
          onClose={() => setShowDialog(false)}
          onConfirm={async () => {
            try {
              setShowDialog(false);
              await stockIn({
                id: item.id,
                data: {
                  quantity,
                },
              });

              showToast({
                message: "Stock updated successfully",
                variant: "success",
              });
            } catch (error) {
              showToast({
                message: "Something went wrong!",
                variant: "danger",
              });
              console.error(error);
            }
          }}
        >
          <div className="flex flex-col gap-y-3 py-1 w-xs">
            <label
              className="w-fit text-(--text-muted)! font-semibold"
              htmlFor="quantity"
            >
              Quantity
            </label>
            <div className="flex size-full gap-2">
              <input
                id="quantity"
                onChange={(e) => {
                  if (!e.target.value) {
                    return;
                  }
                  setQuantity(Number(e.target.value));
                }}
                placeholder="Set Quantity: "
                type="number"
                className="w-4/5! text-xs! py-1!"
              />
              <input
                disabled
                readOnly
                className="w-1/5! lowercase! text-xs! py-1!"
                value={item.unit}
              />
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ItemsTable;
