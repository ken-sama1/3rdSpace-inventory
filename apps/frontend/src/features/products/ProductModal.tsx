import Modal from "@/components/ui/Modal";
import { useGetProductById } from "@/hooks/products/queries/useGetProductById";
import type {
  IdSchema,
  ProductWithInventoryItemsDto,
} from "@repo/shared";
import { useState, type FC } from "react";
import DeductStock from "./DeductStock";
import EditProductForm from "./EditProductForm";

interface ProductModalProps {
  isOpen: boolean;
  onClose?: () => void;
  productId: IdSchema;
  onAddToBatch?: (
    product: ProductWithInventoryItemsDto,
    quantity: number,
    recipeItems: ProductWithInventoryItemsDto["recipeItems"]
  ) => void;
}

const ProductModal: FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productId,
  onAddToBatch,
}) => {
  const { data: product } = useGetProductById({ productId });
  const [view, setView] = useState<"deduct" | "edit">("deduct");

  if (!product) return <></>;

  const handleOnClose = () => {
    setView("deduct");
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} title={product.name} onClose={handleOnClose}>
        <div className="w-2xl">
          {view === "deduct" && (
            <DeductStock
              product={product}
              onClose={handleOnClose}
              onAddToBatch={(quantity, recipeItems) => {
                onAddToBatch?.(product, quantity, recipeItems);
              }}
              onEdit={() => {
                setView("edit");
              }}
            />
          )}

          {view === "edit" && (
            <EditProductForm
              onCancel={() => {
                setView("deduct");
              }}
              productId={productId}
              onSave={handleOnClose}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default ProductModal;
