import AlertBanner from "@/components/ui/AlertBanner";
import Dialog from "@/components/ui/Dialog";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useToast } from "@/context/ToastContext";
import { useStockConfig } from "@/hooks/useStockConfig";
import { formatCurrency } from "@/utils/format-currency.util";
import {
  API_ERROR_CODE_TO_MESSAGE,
  type ApiErrorCode,
  type ProductWithInventoryItemsDto,
  type ResponseError,
} from "@repo/shared";
import { isAxiosError } from "axios";
import { useCallback, useState, type FC } from "react";
import { useDeductStockForProduct } from "./hooks/useDeductStockForProduct";

import DeductStockContextMenu from "./DeductStockContextMenu";

type Product = ProductWithInventoryItemsDto;

interface DeductStockProps {
  onClose?: () => void;
  onEdit?: () => void;
  product: Product;
}

const DeductStock: FC<DeductStockProps> = ({ product, onClose, onEdit }) => {
  const { isPending, deduct } = useDeductStockForProduct();
  const [productQuantity, setProductQuantity] = useState<number>(0);
  const { getMaxServings } = useStockConfig();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [recipeItems, setRecipeItems] = useState<Product["recipeItems"]>(
    product.recipeItems
  );
  const { maxServingsCount, missingItemsCount, recipeItemsBreakdown } =
    getMaxServings(
      recipeItems.map((recipeItem) => {
        return {
          inventoryItemId: recipeItem.inventoryItemId,
          quantity: recipeItem.quantity,
          inventoryItem: recipeItem.inventoryItem,
        };
      })
    );

  const modifyAmount = useCallback(
    (item: (typeof recipeItemsBreakdown)[number], newQuantity: number) => {
      setRecipeItems((prev) => {
        return prev.map((v) => {
          if (v.inventoryItemId === item.inventoryItemId) {
            return {
              ...v,
              quantity: newQuantity,
            };
          }

          return v;
        });
      });
    },
    []
  );

  const { showToast } = useToast();

  const handleCloseAll = () => {
    setShowDialog(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <div className="w-2xl">
        {/* Category & Price */}
        <div className="w-full grid grid-cols-2 gap-4 py-3 border-b border-(--line) my-3">
          {/* Category Section */}
          <div className="col-span-1 flex items-center gap-2">
            <span className="font-semibold text-sm text-(--text-muted)! uppercase tracking-wider">
              Category:
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border status-info">
              {product.category?.name || "Uncategorized"}
            </span>
          </div>

          {/* Price Section */}
          <div className="col-span-1 flex items-center gap-2">
            <span className="font-semibold text-sm text-(--text-muted)! uppercase tracking-wider">
              Price:
            </span>
            <span className="font-bold text-lg">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Status */}
          <div className="col-span-2 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-(--text-muted)! uppercase tracking-wider">
                Status:
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${maxServingsCount >= 6 ? "status-success" : maxServingsCount >= 1 ? "status-warning" : "status-danger"}`}
              >
                {maxServingsCount >= 1
                  ? `Possible Servings (${String(maxServingsCount)})`
                  : `Missing Items ${String(missingItemsCount)} (0 Possible Servings)`}
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
              <span className="col-span-3 font-semibold uppercase text-sm truncate">
                Name
              </span>

              <span className="col-span-3 font-semibold text-sm text-center uppercase">
                Required
              </span>

              <span className="col-span-3 text-center font-semibold uppercase text-sm">
                Available
              </span>

              <span className="col-span-2 font-semibold flex justify-center text-sm uppercase">
                Status
              </span>
            </div>

            {/* Recipe Item Breakdown */}
            <ul className="w-full h-[20vh] overflow-auto">
              {recipeItemsBreakdown.map((item) => {
                return (
                  <li
                    key={item.name}
                    className="grid grid-cols-12 items-center py-2 px-3 border-b border-(--line) text-sm hover:bg-(--surface-hover)/50 transition-colors"
                  >
                    {/* Name */}
                    <span className="col-span-3 font-medium truncate">
                      {item.name}
                    </span>

                    {/* Required Quantity */}
                    <span className="col-span-3 text-center text-(--text-muted)!">
                      {item.required}
                      <span className="text-xs">{item.unit}</span>
                    </span>

                    {/* Available Stock */}
                    <span className="col-span-3 text-center font-mono text-(--text-muted)!">
                      {item.available}
                      <span className="text-xs text-(--text-muted)">
                        {item.unit}
                      </span>
                    </span>

                    {/* Status Badge */}
                    <div className="col-span-2 flex justify-center">
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

                    <div className="col-span-1 flex justify-center items-center relative">
                      <DeductStockContextMenu
                        unit={item.unit}
                        name={item.name}
                        availableQuantity={item.available}
                        requiredQuantity={item.required}
                        onChange={({ quantity: newQuantity }) => {
                          modifyAmount(item, newQuantity);
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="size-full mt-3">
          <div className="w-full flex justify-end gap-2 items-center">
            <QuantityStepper
              min={1}
              max={maxServingsCount}
              callback={(v) => {
                setProductQuantity(v);
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-between items-center w-full">
          <div className="w-1/2 flex justify-start">
            {onEdit && (
              <button
                onClick={onEdit}
                type="button"
                className="py-1! button-accent"
              >
                Edit
              </button>
            )}
          </div>
          <div className="w-1/2 flex gap-2 justify-end">
            <button
              onClick={handleCloseAll}
              type="button"
              className="py-1! button-outlined"
            >
              Close
            </button>
            <button
              disabled={isPending || maxServingsCount <= 0}
              onClick={() => {
                setShowDialog(true);
              }}
              type="button"
              className={`py-1! ${maxServingsCount <= 0 ? "button-muted" : "button-accent"}`}
            >
              Deduct
            </button>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={showDialog}
        title={`Produce ${product.name}?`}
        variant="accent"
        onClose={() => {
          setShowDialog(false);
        }}
        onConfirm={() => {
          void (async () => {
            try {
              await deduct({
                id: product.id,
                data: {
                  quantity: productQuantity,
                  recipeItems: recipeItems,
                },
              });
              setShowDialog(false);
              showToast({
                variant: "success",
                message: `Deducted items for ${String(productQuantity)} ${product.name}`,
              });
            } catch (error: unknown) {
              setShowDialog(false);
              console.error(error);
              let code: ApiErrorCode | undefined;
              if (isAxiosError<ResponseError>(error)) {
                code = error.response?.data.code;
              }

              showToast({
                variant: "danger",
                message:
                  API_ERROR_CODE_TO_MESSAGE[code ?? "STOCK_INSUFFICIENT"],
                forceToTop: true,
              });
            } finally {
              handleCloseAll();
            }
          })();
        }}
      >
        <div className="w-sm flex">
          <AlertBanner
            variant="info"
            message="This will deduct required items immediately."
          />
        </div>
      </Dialog>
    </>
  );
};

export default DeductStock;
