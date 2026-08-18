import Dialog from "@/components/ui/popups/Dialog";
import Modal from "@/components/ui/popups/Modal";
import Toast from "@/components/ui/popups/Toast";
import { inventoryItemUnits, type InventoryItemUnit } from "@repo/shared";
import { useRef, useState } from "react";
import useCreateInventoryItem from "@/hooks/inventory/useCreateInventoryItem";
import AlertBanner from "@/components/ui/banners/AlertBanner";

export interface CreateItemModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const CreateItemModal = ({ isOpen, onClose }: CreateItemModalProps) => {
  const { create, isPending } = useCreateInventoryItem();

  const [dialog, setDialog] = useState<"confirm" | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "danger" | "info";
  } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  if (!isOpen) return null;

  const handleCloseAll = () => {
    setDialog(null);
    setToast(null);
    if (onClose) {
      onClose();
    }
  };

  const handleSave = async () => {
    try {
      if (!formRef.current) throw new Error("No form reference found");

      const form = new FormData(formRef.current);

      const quantity = form.get("item-quantity")
        ? Number(form.get("item-quantity"))
        : null;
      const description = form.get("item-description") as string | null;
      const imageUrl = form.get("item-image") as string | null;
      const category = form.get("item-category") as string | null;

      setDialog(null);

      await create({
        name: form.get("item-name") as string,
        unit: form.get("item-unit") as InventoryItemUnit,
        ...(description && { description }),
        ...(quantity !== null && !isNaN(quantity) && { quantity }),
        ...(imageUrl && { imageUrl }),
        ...(category && { category }),
      });

      formRef.current.reset();

      setToast({
        variant: "success",
        message: "Item created successfully",
      });
    } catch (e) {
      console.error(e);
      setDialog(null);
      setToast({
        variant: "danger",
        message: "Something went wrong",
      });
    }
  };

  return (
    <>
      <Modal onClose={handleCloseAll} isOpen={isOpen} title="Create Item">
        <div className="w-lg">
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              setDialog("confirm");
            }}
            className="relative w-full h-full flex flex-col gap-5"
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

              {/* Unit */}
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
                  <option hidden value="">
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
            <div className="w-full flex gap-2 items-center justify-end">
              <button
                onClick={handleCloseAll}
                type="button"
                className="button-outlined h-7! py-0!"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="button-accent h-7! py-0!"
              >
                {isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {dialog && (
        <Dialog
          isOpen={true}
          onClose={() => setDialog(null)}
          cancelText="No"
          confirmText="Yes"
          title="Create Item?"
          onConfirm={handleSave}
        >
          <AlertBanner
            message="This will save the new item to your inventory immediately."
            variant="info"
          />
        </Dialog>
      )}

      {toast && (
        <Toast
          forceToTop
          isOpen
          variant={toast.variant}
          onClose={() => setToast(null)}
        >
          {toast.message}
        </Toast>
      )}
    </>
  );
};

export default CreateItemModal;
