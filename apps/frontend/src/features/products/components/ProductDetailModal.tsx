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
  const { maxServingsCount, missingItemsCount, recipeItemsBreakdown } =
    getMaxServings(product.recipeItems);

  return (
    <Modal isOpen={isOpen} title={product.name} onClose={onClose}>
      <div className="w-2xl">
        {/* Category & Price */}
        <div className="w-full grid grid-cols-2 gap-4 py-3 border-b border-(--line) my-3">
          {/* Category Section */}
          <div className="col-span-1 flex items-center gap-2">
            <span className="font-semibold text-sm text-(--text-muted)! uppercase tracking-wider">
              Category:
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border status-info">
              {product.category || "Uncategorized"}
            </span>
          </div>

          {/* Price Section */}
          <div className="col-span-1 flex items-center gap-2">
            <span className="font-semibold text-sm text-(--text-muted)! uppercase tracking-wider">
              Price:
            </span>
            <span className="font-bold text-lg">
              {product.price?.toFixed(2) ?? "0.00"}
            </span>
          </div>

          {/* Status */}
          <div className="col-span-2 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-(--text-muted)! uppercase tracking-wider">
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

        {/* Recipe Items Breakdown */}
        <div className="w-full flex flex-col flex-center items-center gap-2">
          <div className="size-full">
            <span className="font-semibold text-sm text-(--text-muted)! uppercase tracking-wider">
              Items Required:
            </span>
          </div>
          <div className="size-full flex flex-col gap-2">
            {/* List Heading */}
            <div className="grid grid-cols-12 items-center py-2 px-4 border-b border-(--line)">
              <span className="col-span-4 font-semibold uppercase text-sm truncate">
                Name
              </span>

              <span className="col-span-3 font-semibold text-sm text-center uppercase">
                Required
              </span>

              <span className="col-span-3 text-center font-semibold uppercase text-sm">
                Available
              </span>

              <span className="col-span-2 font-semibold flex justify-end text-sm uppercase">
                Status
              </span>
            </div>

            {/* Recipe Item Breakdown */}
            <ul className="size-full">
              {recipeItemsBreakdown.map((item) => {
                return (
                  <li
                    key={item.name}
                    className="grid grid-cols-12 items-center py-2 px-3 border-b border-(--line) last:border-none text-sm hover:bg-(--surface-hover)/50 transition-colors"
                  >
                    {/* Name */}
                    <span className="col-span-4 font-medium truncate">
                      {item.name}
                    </span>

                    {/* Required Quantity */}
                    <span className="col-span-3 text-center text-(--text-muted)!">
                      {item.required}{" "}
                      <span className="text-xs">{item.unit}</span>
                    </span>

                    {/* Available Stock */}
                    <span className="col-span-3 text-center font-mono text-(--text-muted)!">
                      {item.available}{" "}
                      <span className="text-xs text-(--text-muted)">
                        {item.unit}
                      </span>
                    </span>

                    {/* Status Badge */}
                    <div className="col-span-2 flex justify-end">
                      {item.required > item.available ? (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-md border status-danger">
                          Missing
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-md border status-success">
                          OK
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex justify-between items-center w-full">
          <div className="w-1/2 flex justify-start items-center">
            <button type="button" className="button-danger py-1!">
              Delete
            </button>
          </div>
          <div className="flex justify-end items-center w-1/2 gap-2">
            <button type="button" className="button-outlined py-1!">
              Edit
            </button>
            <button type="button" className="button-accent py-1!">
              Deduct
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
