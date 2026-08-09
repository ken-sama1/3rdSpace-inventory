import Dialog from "@/components/ui/popups/Dialog";
import Modal from "@/components/ui/popups/Modal";
import Toast from "@/components/ui/popups/Toast";
import { inventoryItemUnits, type InventoryItemUnit } from "@repo/shared";
import { useRef, useState } from "react";
import useCreateInventoryItem from "../hooks/useCreateInventoryItem";

interface AddItemModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

type ToastStyle = Parameters<typeof Toast>[0];

const CreateItemModal = ({ isOpen, onClose }: AddItemModalProps) => {
  const { create } = useCreateInventoryItem();

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [toastStyle, setToastStyle] = useState<ToastStyle>({
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
        children: "Item added successfully",
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

      <Modal onClose={handleCloseAll} isOpen={isOpen} title="Add New Item">
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
              title="Add Item?"
              onConfirm={handleSave}
            >
              <div className="w-74">
                <span className="flex justify-center items-center font-semibold! text-sm!">
                  Do you really want to add this item?
                </span>
              </div>
            </Dialog>

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
                Add
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default CreateItemModal;
