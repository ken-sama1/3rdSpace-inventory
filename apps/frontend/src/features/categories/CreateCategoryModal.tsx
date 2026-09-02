import AlertBanner from "@/components/ui/AlertBanner";
import Dialog from "@/components/ui/Dialog";
import Modal from "@/components/ui/Modal";
import { useToastContext } from "@/context/ToastContext";
import useCreateInventoryItemCategory from "@/hooks/categories/useCreateInventoryItemCategory";
import useCreateProductCategory from "@/hooks/categories/useCreateProductCategory";
import { useRef, useState, type FC } from "react";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose?: () => void;
}
const CreateCategoryModal: FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useToastContext();
  const formRef = useRef<HTMLFormElement>(null);
  const [categoryOf, setCategoryOf] = useState<"item" | "product">("item");
  const [showDialog, setShowDialog] = useState(false);

  const { create } =
    categoryOf === "item"
      ? useCreateInventoryItemCategory()
      : useCreateProductCategory();

  return (
    <Modal title="Create Category" onClose={onClose} isOpen={isOpen}>
      <div className="w-lg">
        <form
          ref={formRef}
          onSubmit={async (e) => {
            e.preventDefault();

            setShowDialog(true);
          }}
          className="relative w-full h-full flex flex-col gap-5"
        >
          <div className="h-auto grid grid-cols-4 gap-y-2 gap-x-5">
            {/* Name */}
            <div className="grid col-span-2 gap-y-2">
              <label
                htmlFor="category-name"
                className="text-sm! text-(--text-muted)! font-semibold!"
              >
                Name:
              </label>
              <input
                required
                type="text"
                id="category-name"
                name="category-name"
                className="rounded-md! h-7! text-xs!"
              />
            </div>

            {/* Category of */}
            <div className="grid col-span-2 gap-y-2">
              <label
                htmlFor="category-of"
                className="text-sm! text-(--text-muted)! font-semibold!"
              >
                Category of
              </label>
              <select
                required
                defaultValue="item"
                id="category-of"
                name="category-of"
                className="rounded-md! h-7! text-xs!"
                onChange={(e) => {
                  setCategoryOf(e.target.value as typeof categoryOf);
                }}
              >
                <option value="item">Inventory Item</option>
                <option value="product">Product</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              type="button"
              className="button-outlined py-1!"
            >
              Cancel
            </button>
            <button type="submit" className="button-accent py-1!">
              Create
            </button>
          </div>
        </form>
      </div>

      <Dialog
        cancelText="No"
        confirmText="Yes"
        title="Create Category?"
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={async () => {
          try {
            if (!formRef.current) throw new Error("No form reference found");

            const formData = new FormData(formRef.current);
            const name = formData.get("category-name") as string;

            await create({ name });
            setShowDialog(false);
            showToast({
              message: `${categoryOf === "product" ? "Product" : "Inventory item"} category created`,
              forceToTop: true,
              variant: "success",
            });
            formRef.current.reset();
          } catch (error) {
            setShowDialog(false);
            showToast({
              message: "Something went wrong!",
              forceToTop: true,
              variant: "danger",
            });
            console.error(error);
          }
        }}
      >
        <AlertBanner
          message={`This will be added ${categoryOf === "product" ? "product" : "Inventory item"} categories to immediately.`}
          variant="info"
        />
      </Dialog>
    </Modal>
  );
};

export default CreateCategoryModal;
