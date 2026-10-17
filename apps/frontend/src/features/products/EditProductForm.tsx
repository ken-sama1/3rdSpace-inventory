import type { SelectRecipeItemsSelectedItem } from "./SelectRecipeItemsModal.tsx";
import AlertBanner from "@/components/ui/AlertBanner";
import Dialog from "@/components/ui/Dialog";
import { useToast } from "@/context/ToastContext";
import { useDeleteProduct } from "@/hooks/products/mutations/useDeleteProduct";
import { useGetProductById } from "@/hooks/products/queries/useGetProductById";
import { useUpdateProduct } from "@/hooks/products/mutations/useUpdateProduct";
import { getApiErrorMessage } from "@/utils/api-error-message.util";
import { useRef, useState, type FC } from "react";
import ProductForm from "./ProductForm";
import type { IdSchema } from "@repo/shared";

interface EditProductFormProps {
  productId: IdSchema;
  onCancel?: () => void;
  onSave?: () => void;
}

const EditProductForm: FC<EditProductFormProps> = ({
  productId,
  onCancel,
  onSave,
}) => {
  const { data: product } = useGetProductById({ productId });
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
  const { showToast } = useToast();

  const dialogConfigs = {
    delete: {
      title: `Delete ${product?.name ?? "product"}?`,
      message: "This will permanently delete this product",
      variant: "danger",
      onConfirm: () => {
        void (async () => {
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
              message: getApiErrorMessage(error),
              forceToTop: true,
              variant: "danger",
            });
            console.error(error);
          }
        })();
      },
    },
    edit: {
      title: `Update ${product?.name ?? "product"}?`,
      message: "Your updates will take effect immediately",
      variant: "info",
      onConfirm: () => {
        void (async () => {
          try {
            if (!formRef.current) throw new Error("No form reference found");
            const formData = new FormData(formRef.current);
            const name = (formData.get("product-name") || undefined) as
              string | undefined;
            const price = formData.get("product-price") as string | null;
            const description = formData.get("product-description") as string;
            const categoryId = formData.get("product-category") as string;
            const image = formData.get("product-image") as File;

            await update({
              id: productId,
              data: {
                name,
                price,
                description: description || null,
                categoryId: categoryId || null,
                imageUrl: image.name || null,
                ...(requiredItems.length >= 1
                  ? {
                      recipeItems: requiredItems.map((item) => {
                        return {
                          inventoryItemId: item.id,
                          quantity: item.quantity,
                        };
                      }),
                    }
                  : { recipeItems: [] }),
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
            showToast({
              variant: "danger",
              message: getApiErrorMessage(error),
            });
          }
        })();
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
              onClick={() => {
                setDialog("delete");
              }}
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
                if (!formRef.current) {
                  console.log("No form reference found");
                  return;
                }
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
          onClose={() => {
            setDialog(null);
          }}
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
