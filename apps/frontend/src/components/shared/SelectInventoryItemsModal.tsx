import { useGetInventoryItems } from "@/hooks/inventory/useGetInventoryItems";
import type { IdSchema } from "@repo/shared";
import { useState, type FC } from "react";
import AlertBanner from "../ui/AlertBanner";
import Dialog, { type DialogProps } from "../ui/Dialog";
import Modal from "../ui/Modal";
import { X } from "lucide-react";

export interface SelectInventoryItemsSelectedItem {
  id: IdSchema;
  name: string;
}

interface SelectInventoryItemsModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialSelectedItems?: SelectInventoryItemsSelectedItem[];
  hideItemsWithIds?: IdSchema[];
  onSave?: (selectedItems: SelectInventoryItemsSelectedItem[]) => void;
}

const SelectInventoryItemsModal: FC<SelectInventoryItemsModalProps> = ({
  isOpen,
  onClose,
  initialSelectedItems = [],
  hideItemsWithIds = [],
  onSave,
}) => {
  const { data: items } = useGetInventoryItems();

  const [dialog, setDialog] = useState<DialogProps | null>(null);
  const [selectedItems, setSelectedItems] =
    useState<SelectInventoryItemsSelectedItem[]>(initialSelectedItems);

  if (!items) return;

  return (
    <Modal
      noBackdrop
      title="Select Inventory Items"
      isOpen={isOpen}
      onClose={onClose}
    >
      {/* Inventory Items */}
      <div className="w-max h-[60vh] no-scrollbar overflow-auto">
        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <>
            <div className="h-auto w-full flex-wrap flex gap-2">
              {/* Selected Items Headers */}
              <div className="flex w-full justify-between items-center">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Selected Inventory Items ({selectedItems.length})
                </h4>
              </div>

              {selectedItems.map((item) => {
                if (hideItemsWithIds.includes(item.id)) return;

                return (
                  <div
                    key={`inventory-items-${item.id}`}
                    className="w-auto border flex gap-x-3 items-center status-info rounded-md"
                  >
                    <span className="line-clamp-1">{item.name}</span>
                    <button
                      onClick={() => {
                        setSelectedItems((prev) => {
                          return prev.filter((f) => f.id !== item.id);
                        });
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

        <div className="h-auto grid grid-cols-4 gap-2">
          <h4 className="text-sm col-span-4 font-semibold text-muted-foreground uppercase tracking-wider">
            Available Inventory Items
          </h4>

          {items.map((item) => {
            const isSelected = selectedItems.find((e) => e.id === item.id);
            if (isSelected) return;
            const hasCategory = item.categoryId;

            if (hideItemsWithIds.includes(item.id)) return;

            return (
              <button
                onClick={() => {
                  if (hasCategory) {
                    setDialog({
                      isOpen: true,
                      title: `${item.name}`,
                      onConfirm: () => {
                        setDialog(null);
                        setSelectedItems((prev) => [
                          ...prev,
                          {
                            id: item.id,
                            name: item.name,
                          },
                        ]);
                      },
                      children: (
                        <div className="max-w-sm">
                          <AlertBanner
                            variant="info"
                            message={`${item.name} is already in category "${item.category?.name}" do you want to move it in this category?`}
                          />
                        </div>
                      ),
                    });
                    return;
                  }
                  setSelectedItems((prev) => [
                    ...prev,
                    {
                      id: item.id,
                      name: item.name,
                    },
                  ]);
                }}
                title={item.name}
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

      {dialog && (
        <>
          <Dialog
            noBackdrop
            title={dialog.title}
            isOpen={dialog.isOpen}
            cancelText="No"
            confirmText="Yes"
            onConfirm={dialog.onConfirm}
            onClose={() => setDialog(null)}
          >
            {dialog.children}
          </Dialog>
        </>
      )}
    </Modal>
  );
};

export default SelectInventoryItemsModal;
