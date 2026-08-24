import type { SelectRecipeItemsSelectedItem } from "@/components/shared/SelectRecipeItemsModal";
import AlertBanner from "@/components/ui/AlertBanner";
import Dialog from "@/components/ui/Dialog";
import { useToastContext } from "@/context/ToastContext";
import useDeleteProduct from "@/hooks/products/useDeleteProduct";
import useGetProductById from "@/hooks/products/useGetProductById";
import useUpdateProduct from "@/hooks/products/useUpdateProduct";
import { useRef, useState, type FC } from "react";
import ProductForm from "./ProductForm";

interface EditProductFormProps {
  productId: string;
  onCancel?: () => void;
  onSave?: () => void;
}

const EditProductForm: FC<EditProductFormProps> = ({
  productId,
  onCancel,
  onSave,
}) => {
  const { data: product } = useGetProductById(productId);
  const [requiredItems, setRequiredItems] = useState<
    SelectRecipeItemsSelectedItem[]
  >([]);

  const { delete: deleteProduct } = useDeleteProduct();
  const { update, isPending: updatePending } = useUpdateProduct();

  const formRef = useRef<HTMLFormElement>(null);
  const [dialog, setDialog] = useState<null | "delete" | "edit">(null);

  const handleOnSave = () => {
    setDialog(null);
    if (onSave) onSave();
  };

  // Persistent Toast
  const { showToast } = useToastContext();

  const dialogConfigs = {
    delete: {
      title: `Delete ${product?.name}?`,
      message: "This will permanently delete this product",
      variant: "danger",
      onConfirm: async () => {
        try {
          setDialog(null);
          await deleteProduct(productId);
          handleOnSave();
          showToast({
            message: "Product deleted successfully",
            variant: "success",
          });
        } catch (error) {
          showToast({
            message: "Something went wrong!",
            forceToTop: true,
            variant: "danger",
          });
          console.error(error);
        }
      },
    },
    edit: {
      title: `Update ${product?.name}?`,
      message: "Your updates will take effect immediately",
      variant: "info",
      onConfirm: async () => {
        try {
          if (!formRef.current) throw new Error("No form reference found");
          const formData = new FormData(formRef.current);
          const name = formData.get("product-name") as string | undefined;
          const price = formData.get("product-price") as number | null;
          const description = formData.get("product-description") as
            string | undefined;
          const categoryId = formData.get("product-category") as
            string | undefined;
          const image = formData.get("product-image") as
            { name: string } | undefined;

          await update({
            id: productId,
            data: {
              name,
              price,
              description,
              categoryId,
              imageUrl: image?.name,
              ...(requiredItems.length >= 1 && {
                recipeItems: requiredItems.map((item) => {
                  return {
                    inventoryItemId: item.id,
                    quantity: item.quantity,
                  };
                }),
              }),
            },
          });

          handleOnSave();

          showToast({
            message: "Product updated successfully",
            variant: "success",
          });
        } catch (error) {
          console.error(error);
          setDialog(null);
          showToast({ variant: "danger", message: "Something went wrong!" });
        }
      },
    },
  } as const;

  return (
    <>
      <div className="w-full">
        <ProductForm
          product={product}
          formRef={formRef}
          onSubmit={(_, selectedItems) => {
            setRequiredItems(selectedItems);
            setDialog("edit");
          }}
        />
        <div className="w-full mt-3 flex justify-between">
          <div className="w-1/2">
            <button
              onClick={() => setDialog("delete")}
              type="button"
              className="button-danger"
            >
              Delete
            </button>
          </div>
          <div className="w-1/2 flex justify-end items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onCancel) onCancel();
              }}
              className="button-outlined"
            >
              Back
            </button>

            <button
              disabled={updatePending}
              onClick={() => {
                if (!formRef.current)
                  return console.log("No form reference found");
                formRef.current.requestSubmit();
              }}
              type="button"
              className="button-accent"
            >
              {updatePending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {dialog && (
        <Dialog
          title={dialogConfigs[dialog].title}
          cancelText="No"
          confirmText="Yes"
          isOpen
          onClose={() => setDialog(null)}
          onConfirm={dialogConfigs[dialog].onConfirm}
        >
          <AlertBanner
            variant={dialogConfigs[dialog].variant}
            message={dialogConfigs[dialog].message}
          />
        </Dialog>
      )}
    </>
  );
};

export default EditProductForm;
