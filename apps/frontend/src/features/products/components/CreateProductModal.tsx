import SelectRecipeItemsModal from "@/components/shared/SelectRecipeItemsModal";
import AlertBanner from "@/components/ui/banners/AlertBanner";
import Dialog from "@/components/ui/popups/Dialog";
import Modal from "@/components/ui/popups/Modal";
import Toast from "@/components/ui/popups/Toast";
import useCreateProduct from "@/hooks/products/useCreateProduct";
import type { InventoryItemDto } from "@repo/shared";
import { useRef, useState, type FC } from "react";

export interface CreateProductModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const CreateProductModal: FC<CreateProductModalProps> = ({
  onClose,
  isOpen,
}) => {
  const [dialog, setDialog] = useState<"confirm" | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "danger" | "info";
  } | null>(null);
  const [showSelectRecipeModal, setShowSelectRecipeModal] =
    useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const [recipeItems, setRecipeItems] = useState<InventoryItemDto[]>([]);
  const { create, isPending } = useCreateProduct();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Create Product">
        <div className="w-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              setDialog("confirm");
            }}
            ref={formRef}
            className="relative size-full flex flex-col gap-5"
          >
            <div className="h-auto grid grid-cols-4 gap-y-2 gap-x-5">
              {/* Name  */}
              <div className="grid col-span-2 gap-y-2">
                <label
                  htmlFor="product-name"
                  className="text-sm! text-(--text-muted)! font-semibold!"
                >
                  Name:
                </label>
                <input
                  required
                  id="product-name"
                  type="text"
                  name="product-name"
                  className="rounded-md! h-7! text-xs!"
                />
              </div>

              {/* Price  */}
              <div className="grid col-span-2 gap-y-2">
                <label
                  htmlFor="product-price"
                  className="text-sm! text-(--text-muted)! font-semibold!"
                >
                  Price:
                </label>
                <input
                  id="product-price"
                  type="text"
                  name="product-price"
                  className="rounded-md! h-7! text-xs!"
                />
              </div>

              {/* Description */}
              <div className="grid col-span-2 gap-y-2">
                <label
                  htmlFor="product-description"
                  className="text-sm! text-(--text-muted)! font-semibold!"
                >
                  Description:
                </label>
                <input
                  id="product-description"
                  type="text"
                  name="product-name"
                  className="rounded-md! h-7! text-xs!"
                />
              </div>

              {/* Category */}
              <div className="grid col-span-2 gap-y-2">
                <label
                  htmlFor="product-category"
                  className="text-sm! text-(--text-muted)! font-semibold!"
                >
                  Category:
                </label>
                <input
                  id="product-category"
                  type="text"
                  name="product-category"
                  className="rounded-md! h-7! text-xs!"
                />
              </div>

              {/* Image  */}
              <div className="grid col-span-2 gap-y-2">
                <label
                  htmlFor="product-image"
                  className="text-sm! text-(--text-muted)! font-semibold!"
                >
                  Image:
                </label>
                <input
                  id="product-image"
                  type="file"
                  name="product-image"
                  className="rounded-md! h-7! text-xs!"
                />
              </div>

              {/* Recipe Items  */}
              <div className="grid col-span-2 gap-y-2">
                <label
                  htmlFor="product-recipe"
                  className="text-sm! text-(--text-muted)! font-semibold!"
                >
                  Recipe Items:
                </label>

                <button
                  onClick={() => {
                    setShowSelectRecipeModal(true);
                  }}
                  type="button"
                  className="button-accent rounded-md! h-7! text-xs!"
                >
                  Select Recipe
                </button>
              </div>
            </div>

            <div className="w-full flex justify-end items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="button-outlined"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="button-accent"
              >
                {isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>

        <SelectRecipeItemsModal
          isOpen={showSelectRecipeModal}
          onClose={() => {
            setShowSelectRecipeModal(false);
          }}
          onSave={(selectedRecipeItems) => {
            setShowSelectRecipeModal(false);
            setRecipeItems(selectedRecipeItems);
          }}
        />
      </Modal>

      {dialog && (
        <Dialog
          isOpen={true}
          cancelText="No"
          confirmText="Yes"
          onConfirm={async () => {
            if (!formRef.current) throw new Error("Form reference not found");

            const formData = new FormData(formRef.current);
            const name = formData.get("product-name") as string;
            const price = formData.get("product-price") as number | null;
            const description = formData.get("product-description") as
              string | null;
            const image = formData.get("product-image") as {
              name: string;
            } | null;
            const category = formData.get("product-category") as string | null;

            try {
              setDialog(null);

              await create({
                name,
                recipeItems: recipeItems.map(({ quantity, id }) => {
                  return {
                    inventoryItemId: id,
                    quantity,
                  };
                }),
                price: price ?? 0,
                ...(description && { description }),
                ...(category && { category }),
                ...(image?.name && { imageUrl: image.name }),
              });

              setToast({
                variant: "success",
                message: "Product created succesfully",
              });

              formRef.current.reset();
            } catch (error) {
              setDialog(null);
              setToast({
                variant: "danger",
                message: "Something went wrong!",
              });
              console.error(error);
            }
          }}
          title="Create Product?"
          noBackdrop={true}
          onClose={() => setDialog(null)}
        >
          <AlertBanner
            message="This will be added to products immediately."
            variant="info"
          />
        </Dialog>
      )}

      {toast && (
        <Toast
          isOpen
          variant={toast.variant}
          forceToTop
          onClose={() => setToast(null)}
        >
          {toast.message}
        </Toast>
      )}
    </>
  );
};

export default CreateProductModal;
