import Modal from "@/components/ui/Modal";
import useGetProductById from "@/hooks/products/useGetProductById";
import { useState, type FC } from "react";
import EditProductForm from "./EditProductForm";
import ProduceProduct from "./ProduceProduct";

interface ProductModalProps {
  isOpen: boolean;
  onClose?: () => void;
  productId: string;
}

const ProductModal: FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productId,
}) => {
  const { data: product } = useGetProductById({ productId });
  const [view, setView] = useState<"produce" | "edit">("produce");

  if (!product) return <></>;

  const handleOnClose = () => {
    setView("produce");
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} title={product.name} onClose={handleOnClose}>
        <div className="w-2xl">
          {view === "produce" && (
            <ProduceProduct
              productId={productId}
              onClose={handleOnClose}
              onEdit={() => setView("edit")}
            />
          )}

          {view === "edit" && (
            <EditProductForm
              onCancel={() => setView("produce")}
              productId={productId}
              onSave={onClose}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default ProductModal;
