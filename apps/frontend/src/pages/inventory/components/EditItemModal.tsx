import {
  deleteInventoryItem,
  getInventoryItem,
  updateInventoryItem,
} from "@/api/inventory-items.api";
import Dialog from "@/components/ui/Dialog";
import Modal from "@/components/ui/Modal";
import {
  inventoryItemUnits,
  type GetInventoryItemResult,
  type InventoryItemUnit,
} from "@repo/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, type FC } from "react";
import Toast from "@/components/ui/Toast";

interface EditItemModalProps {
  isOpen: boolean;
  onClose?: () => void;
  itemId: string;
}

type DialogProps = Parameters<typeof Dialog>[0];

type ToastProps = Parameters<typeof Toast>[0];

const EditItemModal: FC<EditItemModalProps> = ({ isOpen, onClose, itemId }) => {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);
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
    queryFn: ({ signal }) => getInventoryItem(itemId, { signal }),
  });

  const handleCloseAll = () => {
    if (onClose) {
      onClose();
    }

    setDialogStyle({
      isOpen: false,
      children: null,
    });
    setToastStyle({
      isOpen: false,
      children: null,
    });
  };

  const { mutateAsync: handleDelete } = useMutation({
    mutationFn: () => deleteInventoryItem(itemId),
    onSuccess: () => {
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
      queryClient.invalidateQueries({
        queryKey: ["inventory-items"],
      });
    },
    onError: () => {
      setToastStyle({
        isOpen: true,
        children: "Something went wrong!",
        variant: "danger",
      });
    },
  });

  const { mutateAsync: handleUpdate } = useMutation({
    mutationFn: async () => {
      if (!formRef.current) throw new Error("No form reference found");

      const formData = new FormData(formRef.current);

      const name = formData.get("item-name") as string | undefined;
      const quantity = formData.get("item-quantity") as number | null;
      const unit = formData.get("item-unit") as InventoryItemUnit | undefined;
      const imageUrl = formData.get("item-image") as string | undefined;
      const category = formData.get("item-category") as string | undefined;
      const description = formData.get("item-description") as
        string | undefined;
      await updateInventoryItem(itemId, {
        ...(name && { name }),
        ...(quantity && { quantity }),
        ...(unit && { unit }),
        ...(imageUrl && { imageUrl }),
        ...(category && { category }),
        ...(description && { description }),
      });
    },
    onSuccess: () => {
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
    },
    onError: () => {
      setToastStyle({
        isOpen: true,
        children: "Something went wrong!",
        variant: "danger",
      });
    },
  });

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
                <div className="w-74">
                  <span className="flex items-center justify-center font-semibold! text-sm!">
                    Do you want to save the changes?
                  </span>
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
                className="text-sm! text-(--heading)! font-semibold!"
              >
                Name:
              </label>
              <input
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
                className="text-sm! text-(--heading)! font-semibold!"
              >
                Category
              </label>
              <input
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
            {/*     className="text-sm! text-(--heading)! font-semibold!" */}
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
            <div className="grid col-span-2 gap-y-2">
              <label
                htmlFor="item-quantity"
                className="text-sm! text-(--heading)! font-semibold!"
              >
                Quantity:
              </label>
              <input
                id="item-quantity"
                type="number"
                name="item-quantity"
                className="rounded-md! h-7! text-xs!"
              />
            </div>

            {/* Unit  */}
            <div className="grid col-span-2 gap-y-2">
              <label
                htmlFor="item-unit"
                className="text-sm! text-(--heading)! font-semibold!"
              >
                Unit:
              </label>
              <select
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
            {/*     className="text-sm! text-(--heading)! font-semibold!" */}
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
                onClick={() => {
                  setDialogStyle({
                    isOpen: true,
                    children: (
                      <div className="w-full">
                        <span className="w-full flex justify-center items-center status-danger border rounded-md font-semibold! text-sm!">
                          This will action will permanently delete this item
                        </span>
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
              <button type="submit" className="button-accent h-7! py-0!">
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
