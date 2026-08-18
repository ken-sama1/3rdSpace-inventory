import Dialog from "@/components/ui/popups/Dialog";
import Modal from "@/components/ui/popups/Modal";
import Toast, { type ToastProps } from "@/components/ui/popups/Toast";
import { inventoryItemUnits, type InventoryItemUnit } from "@repo/shared";
import { useRef, useState } from "react";
import useCreateInventoryItem from "@/hooks/inventory/useCreateInventoryItem";

export interface CreateItemModal {
  isOpen: boolean;
  onClose?: () => void;
}

const CreateItemModal = ({ isOpen, onClose }: CreateItemModal) => {
  const { create } = useCreateInventoryItem();

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [toastStyle, setToastStyle] = useState<ToastProps>({
    children: "How'd you do that?",
    variant: "info",
    isOpen: false,
  });

  const formRef = useRef<HTMLFormElement>(null);

  if (!isOpen) return <></>;

  const handleCloseAll = () => {
    setShowDialog(false);
    if (onClose) {
      onClose();
      setToastStyle({
        children: null,
        isOpen: false,
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!formRef.current) throw new Error("No form reference found");

      const form = new FormData(formRef.current);

      const quantity = form.get("item-quantity") as number | null;
      const description = form.get("item-description") as string | null;
      const imageUrl = form.get("item-image") as string | null;
      const category = form.get("item-category") as string | null;

      await create({
        name: form.get("item-name") as string,
        unit: form.get("item-unit") as InventoryItemUnit,
        ...(description && {
          description,
        }),
        ...(quantity && { quantity }),
        ...(imageUrl && { imageUrl }),
        ...(category && { category }),
      });

      formRef.current.reset();
      setShowDialog(false);

      setToastStyle({
        isOpen: true,
        variant: "success",
        children: "Item created successfully",
      });
    } catch (e) {
      console.log(e);
      setToastStyle({
        isOpen: true,
        variant: "danger",
        children: "Something went wrong",
      });
    }
  };

  return (
    <>
      {/* Toaster, why did they even call it a toaster */}
      <Toast
        forceToTop={true}
        isOpen={toastStyle.isOpen}
        variant={toastStyle.variant}
        onClose={() => {
          setToastStyle((prev) => {
            {
              return {
                ...prev,
                isOpen: false,
              };
            }
          });
        }}
      >
        {toastStyle.children}
      </Toast>

      <Modal onClose={handleCloseAll} isOpen={isOpen} title="Create Item">
        <div className="w-lg">
          {/* Form Obviously */}
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              setShowDialog(true);
            }}
            className="relative w-full h-full flex flex-col gap-5"
          >
            <Dialog
              isOpen={showDialog}
              onClose={() => {
                setShowDialog(false);
              }}
              cancelText="No"
              confirmText="Yes"
              title="Create Item?"
              onConfirm={handleSave}
            >
              <div className="w-full max-w-xs flex flex-col items-center justify-center text-center p-2">
                <p className="text-xs text-(--text-muted) mt-1">
                  This will save the new item to your inventory immediately.
                </p>
              </div>
            </Dialog>

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
              <div className="grid col-span-2 gap-y-2">
                <label
                  htmlFor="item-quantity"
                  className="text-sm! text-(--text-muted)! font-semibold!"
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
                  className="text-sm! text-(--text-muted)! font-semibold!"
                >
                  Unit:
                </label>
                <select
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
            <div className="w-full flex gap-2 items-center justify-end">
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
                Create
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default CreateItemModal;
