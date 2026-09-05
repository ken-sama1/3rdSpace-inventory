import SelectInventoryItemCategory from "@/components/shared/SelectCategory";
import AlertBanner from "@/components/ui/AlertBanner";
import Dialog from "@/components/ui/Dialog";
import Modal from "@/components/ui/Modal";
import { useToastContext } from "@/context/ToastContext";
import { useCreateInventoryItem } from "@/hooks/inventory/useCreateInventoryItem";
import {
  inventoryItemUnits,
  type IdSchema,
  type InventoryItemUnit,
} from "@repo/shared";
import { useRef, useState } from "react";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const CreateItemModal = ({ isOpen, onClose }: CreateItemModalProps) => {
  const { create, isPending } = useCreateInventoryItem();

  const [dialog, setDialog] = useState<"confirm" | null>(null);
  const [categoryId, setCategoryId] = useState<IdSchema | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const { showToast } = useToastContext();

  if (!isOpen) return <></>;

  const handleCloseAll = () => {
    setDialog(null);
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

      setDialog(null);

      await create({
        name: form.get("item-name") as string,
        unit: form.get("item-unit") as InventoryItemUnit,
        quantity,
        description,
        imageUrl,
        categoryId,
      });

      formRef.current.reset();

      showToast({
        variant: "success",
        message: "Item created successfully",
        forceToTop: true,
      });
    } catch (e) {
      console.error(e);
      setDialog(null);
      showToast({
        variant: "danger",
        message: "Something went wrong",
        forceToTop: true,
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
                <SelectInventoryItemCategory
                  type="item"
                  onChange={(v) => {
                    setCategoryId(v?.id ?? null);
                  }}
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
    </>
  );
};

export default CreateItemModal;
