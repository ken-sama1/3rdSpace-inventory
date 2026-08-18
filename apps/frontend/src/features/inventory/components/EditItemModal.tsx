import { inventoryItemApi } from "@/api/inventory-items.api";
import Dialog from "@/components/ui/popups/Dialog";
import Modal from "@/components/ui/popups/Modal";
import Toast from "@/components/ui/popups/Toast";
import {
  inventoryItemUnits,
  type GetInventoryItemResult,
  type InventoryItemUnit,
} from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState, type FC } from "react";
import useDeleteInventoryItem from "@/hooks/inventory/useDeleteInventoryItem";
import useUpdateInventoryItem from "@/hooks/inventory/useUpdateInventoryItem";
import AlertBanner from "@/components/ui/banners/AlertBanner";

export interface EditItemModalProps {
  isOpen: boolean;
  onClose?: () => void;
  itemId: string;
}

const EditItemModal: FC<EditItemModalProps> = ({ isOpen, onClose, itemId }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [dialog, setDialog] = useState<"update" | "delete" | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "danger" | "info";
    forceToTop?: boolean;
    onCloseAction?: () => void;
  } | null>(null);

  const { data, isLoading } = useQuery<GetInventoryItemResult>({
    queryKey: ["inventory-item", itemId],
    queryFn: ({ signal }) => inventoryItemApi.get(itemId, { signal }),
  });

  const { delete: deleteItem, isPending: deletePending } =
    useDeleteInventoryItem();

  const { update: updateItem, isPending: updatePending } =
    useUpdateInventoryItem();

  const handleCloseAll = () => {
    // setToast(null);
    setDialog(null);
    if (onClose) {
      onClose();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(itemId);
      // handleCloseAll();
      setToast({
        variant: "success",
        message: "Item successfully deleted",
      });
    } catch (error) {
      console.error(error);
      setDialog(null);
      setToast({
        variant: "danger",
        message: "Something went wrong!",
        forceToTop: true,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      if (!formRef.current) throw new Error("No form reference found");

      const formData = new FormData(formRef.current);

      const name = formData.get("item-name") as string | undefined;
      const quantityStr = formData.get("item-quantity") as string | null;
      const quantity = quantityStr ? Number(quantityStr) : undefined;
      const unit = formData.get("item-unit") as InventoryItemUnit | undefined;
      const imageUrl = formData.get("item-image") as string | undefined;
      const category = formData.get("item-category") as string | undefined;
      const description = formData.get("item-description") as
        string | undefined;

      setDialog(null);

      await updateItem({
        id: itemId,
        data: {
          ...(name && { name }),
          ...(quantity !== undefined && !isNaN(quantity) && { quantity }),
          ...(unit && { unit }),
          ...(imageUrl && { imageUrl }),
          ...(category && { category }),
          ...(description && { description }),
        },
      });

      // handleCloseAll();
      setToast({
        variant: "success",
        message: "Item successfully updated",
      });
    } catch (error) {
      console.error(error);
      setDialog(null);
      setToast({
        variant: "danger",
        message: "Something went wrong!",
        forceToTop: true,
      });
    }
  };

  return (
    <>
      <Modal
        title={!isLoading ? (data?.name ?? "Error") : "Loading..."}
        isOpen={isOpen}
        onClose={handleCloseAll}
      >
        {!isLoading && data && (
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              setDialog("update");
            }}
            className="relative w-lg h-full flex flex-col gap-5"
          >
            {/* Form Content Wrapper */}
            <div className="h-auto grid grid-cols-4 gap-y-2 gap-x-5">
              {/* Name */}
              <div className="grid col-span-2 gap-y-2">
                <label
                  htmlFor="item-name"
                  className="text-sm! text-(--text-muted)! font-semibold!"
                >
                  Name:
                </label>
                <input
                  onChange={() => {
                    if (!hasChanges) setHasChanges(true);
                  }}
                  defaultValue={data.name}
                  required
                  type="text"
                  id="item-name"
                  name="item-name"
                  className="rounded-md! h-7! text-xs!"
                />
              </div>

              {/* Category */}
              <div className="grid col-span-2 gap-y-2">
                <label
                  htmlFor="item-category"
                  className="text-sm! text-(--text-muted)! font-semibold!"
                >
                  Category
                </label>
                <input
                  onChange={() => {
                    if (!hasChanges) setHasChanges(true);
                  }}
                  defaultValue={data.category ?? ""}
                  id="item-category"
                  type="text"
                  name="item-category"
                  className="rounded-md! h-7! text-xs!"
                />
              </div>

              {/* Unit */}
              <div className="grid col-span-2 gap-y-2">
                <label
                  htmlFor="item-unit"
                  className="text-sm! text-(--text-muted)! font-semibold!"
                >
                  Unit:
                </label>
                <select
                  onChange={() => {
                    if (!hasChanges) setHasChanges(true);
                  }}
                  defaultValue={data.unit}
                  required
                  id="item-unit"
                  name="item-unit"
                  className="rounded-md! h-7! text-xs!"
                >
                  <option hidden value={""}>
                    Select Unit
                  </option>
                  {inventoryItemUnits.map((item) => (
                    <option key={`option-${item}`} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="w-full flex items-center justify-between">
              {/* Left Side */}
              <div className="flex items-center justify-start">
                {/* Delete Button */}
                <button
                  disabled={deletePending}
                  onClick={() => setDialog("delete")}
                  type="button"
                  className="button-danger h-7! py-0!"
                >
                  Delete
                </button>
              </div>

              {/* Right Side */}
              <div className="flex items-center justify-end gap-2">
                {/* Close Button */}
                <button
                  onClick={handleCloseAll}
                  type="button"
                  className="button-outlined h-7! py-0!"
                >
                  Close
                </button>

                {/* Save Button */}
                <button
                  disabled={!hasChanges || updatePending}
                  type="submit"
                  className={`${hasChanges ? "button-accent" : "button-muted"} h-7! py-0!`}
                >
                  {updatePending ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {dialog && (
        <Dialog
          isOpen={true}
          onClose={() => setDialog(null)}
          confirmText="Yes"
          cancelText="No"
          variant={dialog === "delete" ? "danger" : "accent"}
          title={
            dialog === "delete"
              ? `Delete ${data?.name}?`
              : `Update ${data?.name}?`
          }
          onConfirm={dialog === "delete" ? handleDelete : handleUpdate}
        >
          {dialog === "delete" ? (
            <AlertBanner
              variant="danger"
              message="This will permanently delete this item from your inventory."
            />
          ) : (
            <div className="w-full max-w-xs flex flex-col items-center justify-center text-center p-2">
              <AlertBanner
                variant="info"
                message="Your updates will take effect immediately."
              />
            </div>
          )}
        </Dialog>
      )}

      {toast && (
        <Toast
          isOpen={true}
          variant={toast.variant}
          onClose={() => {
            if (toast.onCloseAction) {
              toast.onCloseAction();
            } else {
              setToast(null);
            }
          }}
        >
          {toast.message}
        </Toast>
      )}
    </>
  );
};

export default EditItemModal;
