import Modal from "@/components/ui/popups/Modal";
import useStockConfig from "@/hooks/useStockConfig";
import type { ProductWithInventoryItemsDto } from "@repo/shared";
import { type FC } from "react";

export interface ProductDetailModalProps {
  isOpen: boolean;
  onClose?: () => void;
  product: ProductWithInventoryItemsDto;
}

const ProductDetailModal: FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { getMaxServings } = useStockConfig();
  const { maxServingsCount, missingItemsCount } = getMaxServings(
    product.recipeItems
  );

  return (
    <Modal isOpen={isOpen} title={product.name} onClose={onClose}>
      <div className="w-lg">
        {/* Category & Price */}
        <div className="w-full grid grid-cols-2 gap-4 py-3 border-b border-(--line) my-3">
          {/* Category Section */}
          <div className="col-span-1 flex items-center gap-2">
            <span className="font-semibold text-sm text-(--text-disabled)! uppercase tracking-wider">
              Category:
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border status-info">
              {product.category || "Uncategorized"}
            </span>
          </div>

          {/* Price Section */}
          <div className="col-span-1 flex items-center gap-2">
            <span className="font-semibold text-sm text-(--text-disabled)! uppercase tracking-wider">
              Price:
            </span>
            <span className="font-bold text-lg">
              {product.price?.toFixed(2) ?? "0.00"}
            </span>
          </div>

          {/* Status */}
          <div className="col-span-2 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-(--text-disabled)! uppercase tracking-wider">
                Status:
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${maxServingsCount >= 6 ? "status-success" : maxServingsCount <= 5 ? "status-warning" : "status-danger"}`}
              >
                {maxServingsCount
                  ? `Possible Servings (${maxServingsCount})`
                  : `Missing Items (${missingItemsCount} Possible Servings)`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
