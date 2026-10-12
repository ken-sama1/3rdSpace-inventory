import Modal from "@/components/ui/Modal";
import { useGetProductById } from "@/hooks/products/useGetProductById";
import { type IdSchema } from "@repo/shared";
import { useState, type FC } from "react";
import DeductStock from "./DeductStock";
import EditProductForm from "./EditProductForm";

interface ProductModalProps {
  isOpen: boolean;
  onClose?: () => void;
  productId: IdSchema;
}

const ProductModal: FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productId,
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
