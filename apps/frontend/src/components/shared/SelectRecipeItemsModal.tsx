import useGetInventoryItems from "@/hooks/inventory/useGetInventoryItems";
import type { InventoryItemUnit } from "@repo/shared";
import { X } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import Dialog, { type DialogProps } from "../ui/Dialog";
import Modal from "../ui/Modal";

export interface SelectRecipeItemsSelectedItem {
  // Inventory item id
  id: string;
  name: string;
  // Damn it, I wrote too many quantity even I starting to get confuse
  /** Quantity of the item requires by the product*/
  quantity: number;
  unit: InventoryItemUnit;
}

export interface SelectRecipeItemsModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSave?: (recipeItems: SelectRecipeItemsSelectedItem[]) => void;
  /** Select all ids by default */
  initialSelectedItems?: SelectRecipeItemsSelectedItem[];
}

const SelectRecipeItemsModal: FC<SelectRecipeItemsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSelectedItems = [],
}) => {
  const [selectedItems, setSelectedItems] = useState<
    SelectRecipeItemsSelectedItem[]
  >([]);

  useEffect(() => {
    if (!isOpen) return;

    setSelectedItems(initialSelectedItems);
  }, [isOpen]);

  const [dialog, setDialog] = useState<Omit<DialogProps, "onClose">>({
    isOpen: false,
    children: null,
  });

  const { data: items } = useGetInventoryItems();

  if (!items) return <></>;

  return (
    <Modal
      noBackdrop
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
        {...{ ...dialog }}
        onClose={() =>
          setDialog({
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

          {items &&
            items.map((item) => {
              const isSelected = selectedItems.find((e) => e.id === item.id);
              if (isSelected) return;

              let quantity: number = 0;

              const element = (
                <div className="flex flex-col gap-y-3 py-1 w-76">
                  <p className="text-sm!">
                    Set how much of this item will be used per production.
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
                    setDialog({
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
                        setDialog({
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
