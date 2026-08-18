import { inventoryItemApi } from "@/api/inventory-items.api";
import Dialog, { type DialogProps } from "@/components/ui/popups/Dialog";
import Modal from "@/components/ui/popups/Modal";
import Toast, { type ToastProps } from "@/components/ui/popups/Toast";
import {
  inventoryItemUnits,
  type GetInventoryItemResult,
  type InventoryItemUnit,
} from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState, type FC } from "react";
import useDeleteInventoryItem from "@/hooks/inventory/useDeleteInventoryItem";
import useUpdateInventoryItem from "@/hooks/inventory/useUpdateInventoryItem";

export interface EditItemModalProps {
  isOpen: boolean;
  onClose?: () => void;
  itemId: string;
}

const EditItemModal: FC<EditItemModalProps> = ({ isOpen, onClose, itemId }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [dialogStyle, setDialogStyle] = useState<DialogProps>({
    isOpen: false,
    children: null,
  });
  const [toastStyle, setToastStyle] = useState<ToastProps>({
    isOpen: false,
    children: null,
  });

  const { data, isLoading } = useQuery<GetInventoryItemResult>({
    queryKey: ["inventory-item", itemId],
    queryFn: ({ signal }) => inventoryItemApi.get(itemId, { signal }),
  });

  const handleCloseAll = () => {
    setDialogStyle({
      isOpen: false,
      children: null,
    });

    if (onClose) {
      onClose();
    }
    setToastStyle({
      children: null,
      isOpen: false,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteItem(itemId);

      setDialogStyle({
        isOpen: false,
        children: null,
      });

      setToastStyle({
        isOpen: true,
        children: "Item successfully deleted",
        variant: "success",
        onClose: handleCloseAll,
      });
    } catch (error) {
      console.error(error);
      setToastStyle({
        isOpen: true,
        children: "Something went wrong!",
        variant: "danger",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      if (!formRef.current) throw new Error("No form reference found");

      const formData = new FormData(formRef.current);

      const name = formData.get("item-name") as string | undefined;
      const quantity = formData.get("item-quantity") as number | null;
      const unit = formData.get("item-unit") as InventoryItemUnit | undefined;
      const imageUrl = formData.get("item-image") as string | undefined;
      const category = formData.get("item-category") as string | undefined;
      const description = formData.get("item-description") as
        string | undefined;

      await updateItem({
        id: itemId,
        data: {
          ...(name && { name }),
          ...(quantity && { quantity }),
          ...(unit && { unit }),
          ...(imageUrl && { imageUrl }),
          ...(category && { category }),
          ...(description && { description }),
        },
      });

      setDialogStyle({
        isOpen: false,
        children: null,
      });

      setToastStyle({
        isOpen: true,
        children: "Item successfully updated",
        variant: "success",
        onClose: handleCloseAll,
      });
    } catch (error) {
      console.error(error);

      setDialogStyle({
        isOpen: false,
        children: null,
      });
      setToastStyle({
        isOpen: true,
        children: "Something went wrong!",
        variant: "danger",
      });
    }
  };

  const { delete: deleteItem, isPending: deletePending } =
    useDeleteInventoryItem();

  const { update: updateItem, isPending: updatePending } =
    useUpdateInventoryItem();

  if (!isOpen) return <></>;

  return (
    <Modal
      title={!isLoading ? (data?.name ?? "Error") : "Loading..."}
      isOpen={isOpen}
      onClose={handleCloseAll}
    >
      <Toast
        onClose={() =>
          setToastStyle({
            isOpen: false,
            children: null,
          })
        }
        {...{ ...toastStyle }}
        forceToTop={true}
      >
        {toastStyle.children}
      </Toast>

      <Dialog
        {...{ ...dialogStyle }}
        onClose={() =>
          setDialogStyle({
            isOpen: false,
            children: null,
          })
        }
      >
        {dialogStyle.children}
      </Dialog>
      {!isLoading && data && (
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            setDialogStyle({
              isOpen: true,
              onConfirm: handleUpdate,
              confirmText: "Yes",
              cancelText: "No",
              children: (
                <div className="w-full max-w-xs flex flex-col items-center justify-center text-center p-2">
                  <p className="text-xs text-(--text-muted) mt-1">
                    Your updates will take effect immediately.
                  </p>
                </div>
              ),
              title: `Update ${data.name}?`,
            });
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

            {/* Description */}
            {/* <div className="grid col-span-2 gap-y-2"> */}
            {/*   <label */}
            {/*     htmlFor="item-description" */}
            {/*     className="text-sm! text-(--text-muted)! font-semibold!" */}
            {/*   > */}
            {/*     Description: */}
            {/*   </label> */}
            {/*   <input */}
            {/*     id="item-description" */}
            {/*     type="text" */}
            {/*     name="item-description" */}
            {/*     className="rounded-md! h-7! text-xs!" */}
            {/*   /> */}
            {/* </div> */}

            {/* Quantity */}
            {/* <div className="grid col-span-2 gap-y-2"> */}
            {/*   <label */}
            {/*     htmlFor="item-quantity" */}
            {/*     className="text-sm! text-(--text-muted)! font-semibold!" */}
            {/*   > */}
            {/*     Quantity: */}
            {/*   </label> */}
            {/*   <input */}
            {/*     defaultValue={data.quantity} */}
            {/*     onChange={() => { */}
            {/*       if (!hasChanges) setHasChanges(true); */}
            {/*     }} */}
            {/*     id="item-quantity" */}
            {/*     type="number" */}
            {/*     name="item-quantity" */}
            {/*     className="rounded-md! h-7! text-xs!" */}
            {/*   /> */}
            {/* </div> */}

            {/* Unit  */}
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
                {inventoryItemUnits.map((item) => {
                  return (
                    <option key={`option-${item}`} value={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Image */}
            {/* <div className="grid col-span-2 gap-y-2"> */}
            {/*   <label */}
            {/*     htmlFor="item-image" */}
            {/*     className="text-sm! text-(--text-muted)! font-semibold!" */}
            {/*   > */}
            {/*     Image */}
            {/*   </label> */}
            {/*   <input */}
            {/*     id="item-image" */}
            {/*     type="file" */}
            {/*     name="item-image" */}
            {/*     className="rounded-md! h-7! text-xs!" */}
            {/*   /> */}
            {/* </div> */}
          </div>

          {/* Buttons */}
          <div className="w-full flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center justify-start">
              {/* Delete Button */}
              <button
                disabled={deletePending}
                onClick={() => {
                  setDialogStyle({
                    isOpen: true,
                    children: (
                      <div className="w-full max-w-xs flex flex-col items-center justify-center text-center p-2">
                        <div className="w-full py-2 px-3 rounded-md border status-danger">
                          <p className="text-xs opacity-90 mt-0.5">
                            This will permanently delete this item from your
                            inventory.
                          </p>
                        </div>
                      </div>
                    ),
                    onConfirm: handleDelete,
                    variant: "danger",
                    title: `Delete ${data.name}?`,
                  });
                }}
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
                Save
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditItemModal;
