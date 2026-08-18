import SelectRecipeItemsModal from "@/components/shared/SelectRecipeItemsModal";
import Dialog, { type DialogProps } from "@/components/ui/popups/Dialog";
import Modal from "@/components/ui/popups/Modal";
import type { ToastProps } from "@/components/ui/popups/Toast";
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
  const [dialogStyle, setDialogStyle] = useState<
    Omit<DialogProps, "children" | "onClose">
  >({
    isOpen: false,
  });
  const [toastStyle, setToastStyle] = useState<ToastProps>({
    isOpen: false,
    children: null,
  });
  const [showSelectRecipeModal, setShowSelectRecipeModal] =
    useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const [recipeItems, setRecipeItems] = useState<InventoryItemDto[]>([]);
  const { create, isPending } = useCreateProduct();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Product">
      <div className="w-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            setDialogStyle({
              isOpen: true,
            });
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
            <button type="button" onClick={onClose} className="button-outlined">
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

      <Dialog
        cancelText="No"
        confirmText="Yes"
        {...{ ...dialogStyle }}
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
            setDialogStyle({
              isOpen: false,
            });

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

            setToastStyle({
              isOpen: true,
              variant: "success",
              children: "Product created succesfully",
            });

            formRef.current.reset();
          } catch (error) {
            setDialogStyle({
              isOpen: false,
            });
            setToastStyle({
              isOpen: true,
              variant: "danger",
              children: "Something went wrong!",
            });
            console.error(error);
          }
        }}
        title="Create Product?"
        noBackdrop={true}
        onClose={() =>
          setDialogStyle({
            isOpen: false,
          })
        }
      >
        <div className="w-full max-w-xs flex flex-col items-center justify-center text-center p-2">
          <p className="text-xs text-(--text-muted)! mt-1">
            This will be added to products immediately.
          </p>
        </div>
      </Dialog>
      <Toast
        {...{ ...toastStyle }}
        forceToTop={true}
        onClose={() =>
          setToastStyle({
            isOpen: false,
            children: false,
          })
        }
      />
    </Modal>
  );
};

export default CreateProductModal;
