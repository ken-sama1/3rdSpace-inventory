import { inventoryItemApi } from "@/api/inventory-items.api";
import type { GetInventoryItemsResult, InventoryItemDto } from "@repo/shared";
import { useQueries } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState, type FC } from "react";
import Dialog, { type DialogProps } from "../ui/popups/Dialog";
import Modal from "../ui/popups/Modal";

export interface SelectRecipeItemsModalProps {
  productId?: string;
  isOpen: boolean;
  onClose?: () => void;
  onSave?: (recipeItems: InventoryItemDto[]) => void;
}

const SelectRecipeItemsModal: FC<SelectRecipeItemsModalProps> = ({
  productId,
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedItems, setSelectedItems] = useState<GetInventoryItemsResult>(
    []
  );

  const [dialogStyle, setDialogStyle] = useState<Omit<DialogProps, "onClose">>({
    isOpen: false,
    children: null,
  });
  const [items] = useQueries({
    queries: [
      {
        queryKey: ["items-inventory"],
        queryFn: ({ signal }) => inventoryItemApi.getAll({}, { signal }),
      },
      {
        queryKey: ["products", productId],
        queryFn: () => [],
      },
    ],
  });

  return (
    <Modal
      title="Select Recipe Items"
      isOpen={isOpen}
      onClose={() => {
        if (onClose) {
          onClose();
        }
      }}
    >
      <Dialog
        noBackdrop={true}
        {...{ ...dialogStyle }}
        onClose={() =>
          setDialogStyle({
            isOpen: false,
            children: null,
          })
        }
      />

      <div className="w-max h-[60vh] overflow-auto no-scrollbar">
        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <>
            <div className="h-auto w-full flex-wrap flex gap-2">
              {/* Selected Items Headers */}
              <div className="flex w-full justify-between items-center">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Selected Recipe Items ({selectedItems.length})
                </h4>
              </div>

              {selectedItems.map((item) => {
                return (
                  <div
                    key={`inventory-items-${item.id}`}
                    className="w-auto border flex gap-x-3 items-center status-info rounded-md"
                  >
                    <span className="line-clamp-1">
                      {item.name} {item.quantity}
                      {item.unit.toLocaleLowerCase()}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedItems((prev) =>
                          prev.filter((f) => f.id !== item.id)
                        );
                      }}
                      className="cursor-pointer"
                    >
                      <X className="stroke-(--line)!" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="divider"></div>
          </>
        )}

        {/* Inventory Items Choices*/}
        <div className="h-auto grid grid-cols-4 gap-2">
          <h4 className="text-sm col-span-4 font-semibold text-muted-foreground uppercase tracking-wider">
            Available Inventory Items
          </h4>

          {items.data &&
            items.data.map((item) => {
              const isSelected = selectedItems.find((e) => e.id === item.id);
              if (isSelected) return;

              let quantity: number = 0;

              const element = (
                <div className="flex flex-col gap-y-3 py-1 w-76">
                  <p className="text-sm!">
                    Set how much of this item will be used in each purchase
                  </p>

                  <div className="flex size-full gap-2">
                    <input
                      onChange={(e) => {
                        quantity = Number(e.target.value);
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
              );

              return (
                <button
                  title={item.name}
                  onClick={() => {
                    setDialogStyle({
                      title: item.name,
                      confirmText: "Set",
                      isOpen: true,
                      onConfirm: () => {
                        setSelectedItems((prev) => [
                          ...prev,
                          {
                            ...item,
                            quantity,
                          },
                        ]);
                        setDialogStyle({
                          isOpen: false,
                          children: null,
                        });
                      },
                      children: element,
                    });
                  }}
                  key={`inventory-items-${item.id}`}
                  className="col-span-1 border border-(--accent)/60 flex justify-start items-center button-outlined"
                >
                  <span className="text-sm! line-clamp-1 w-full">
                    {item.name}
                  </span>
                </button>
              );
            })}
        </div>

        <div className="mt-5 gap-2 w-full flex items-center justify-end">
          <button onClick={onClose} type="button" className="button-outlined">
            Close
          </button>

          <button
            onClick={() => {
              if (onSave) {
                onSave(selectedItems);
              }
            }}
            type="button"
            className="button-accent"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SelectRecipeItemsModal;
