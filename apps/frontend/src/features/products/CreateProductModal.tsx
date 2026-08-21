import SelectRecipeItemsModal, {
  type SelectRecipeItemsSelectedItem,
} from "@/components/shared/SelectRecipeItemsModal";
import AlertBanner from "@/components/ui/banners/AlertBanner";
import Dialog from "@/components/ui/popups/Dialog";
import Modal from "@/components/ui/popups/Modal";
import { useToastContext } from "@/context/ToastContext";
import useCreateProduct from "@/hooks/products/useCreateProduct";
import { useRef, useState, type FC } from "react";
import ProductForm from "./ProductForm";

export interface CreateProductModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const CreateProductModal: FC<CreateProductModalProps> = ({
  onClose,
  isOpen,
}) => {
  const [dialog, setDialog] = useState<"confirm" | null>(null);
  const [showSelectRecipeModal, setShowSelectRecipeModal] =
    useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const [requiredItems, setRequiredItems] = useState<
    SelectRecipeItemsSelectedItem[]
  >([]);
  const { create, isPending } = useCreateProduct();

  const { showToast } = useToastContext();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Create Product">
        <div className="w-lg">
          <ProductForm
            formRef={formRef}
            onSubmit={(_, items) => {
              setDialog("confirm");
              setRequiredItems(items);
            }}
          />

          <div className="w-full mt-3 flex justify-end items-center gap-2">
            <button type="button" onClick={onClose} className="button-outlined">
              Cancel
            </button>

            <button
              onClick={() => {
                if (!formRef.current)
                  return console.log("No form reference found");
                formRef.current.requestSubmit();
              }}
              type="button"
              disabled={isPending}
              className="button-accent"
            >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </div>

        <SelectRecipeItemsModal
          isOpen={showSelectRecipeModal}
          onClose={() => {
            setShowSelectRecipeModal(false);
          }}
          onSave={(selectedItems) => {
            setShowSelectRecipeModal(false);
            setRequiredItems(selectedItems);
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
              string | undefined;
            const image = formData.get("product-image") as
              | {
                  name: string;
                }
              | undefined;
            const category = formData.get("product-category") as
              string | string;

            try {
              setDialog(null);

              await create({
                name,
                recipeItems: requiredItems.map(({ quantity, id }) => {
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

              showToast({
                variant: "success",
                message: "Product created succesfully",
              });

              formRef.current.reset();
            } catch (error) {
              setDialog(null);
              showToast({
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
    </>
  );
};

export default CreateProductModal;
