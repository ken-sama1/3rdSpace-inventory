import AlertBanner from "@/components/ui/AlertBanner";
import Dialog from "@/components/ui/Dialog";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { useDeductStocks } from "@/hooks/products/mutations/useDeductStocks";
import { getApiErrorMessage } from "@/utils/api-error-message.util";
import type { ProductWithInventoryItemsDto } from "@repo/shared";
import { ClipboardList, X } from "lucide-react";
import { useMemo, useState, type FC } from "react";

type RecipeItem = ProductWithInventoryItemsDto["recipeItems"][number];

export interface ProductionBatchEntry {
  lineId: string;
  productId: string;
  productName: string;
  quantity: string;
  recipeItems: {
    inventoryItemId: string;
    name: string;
    unit: RecipeItem["unit"];
    quantity: string;
  }[];
}

interface ProductionBatchProps {
  entries: ProductionBatchEntry[];
  onChange: (entries: ProductionBatchEntry[]) => void;
}

const ProductionBatch: FC<ProductionBatchProps> = ({ entries, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { deductStocks, isPending } = useDeductStocks();
  const { showToast } = useToast();

  const hasInvalidValues = entries.some((entry) => {
    const quantity = Number(entry.quantity);
    return (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      entry.recipeItems.some((item) => {
        const amount = Number(item.quantity);
        return !Number.isFinite(amount) || amount < 0;
      })
    );
  });

  const totalUnits = useMemo(
    () =>
      entries.reduce(
        (total, entry) => total + (Number(entry.quantity) || 0),
        0
      ),
    [entries]
  );

  const close = () => {
    setIsOpen(false);
    setIsConfirmOpen(false);
  };

  const submit = async () => {
    try {
      await deductStocks(
        entries.map((entry) => ({
          id: entry.productId,
          quantity: Number(entry.quantity),
          recipeItems: entry.recipeItems.map((item) => ({
            inventoryItemId: item.inventoryItemId,
            quantity: Number(item.quantity),
          })),
        }))
      );
      showToast({
        variant: "success",
        message: `Production batch recorded with ${String(entries.length)} line${entries.length === 1 ? "" : "s"}.`,
      });
      onChange([]);
      close();
    } catch (error: unknown) {
      setIsConfirmOpen(false);
      showToast({
        variant: "danger",
        message: getApiErrorMessage(error),
        forceToTop: true,
      });
    }
  };

  return (
    <>
      <button
        type="button"
        title="Open production batch"
        onClick={() => {
          setIsOpen(true);
        }}
        className="button-outlined mb-3 flex items-center gap-2"
      >
        <ClipboardList className="size-4" />
        Production batch
        <span className="rounded-full bg-(--bg-info) px-2 py-0.5 text-xs! text-(--text-info)!">
          {entries.length}
        </span>
      </button>

      <Modal isOpen={isOpen} onClose={close} title="Review production batch">
        <div className="flex max-h-[70vh] w-full flex-col">
          <p className="mb-3 text-sm! text-(--text-muted)!">
            Review each product line and adjust ingredient amounts per serving.
            Add the same product more than once for different customizations.
          </p>
          <div className="min-h-0 flex-1 overflow-y-auto rounded-md border border-(--line)">
            {entries.length === 0 ? (
              <div className="flex min-h-48 items-center justify-center text-sm text-(--text-muted)">
                No products added. Add products from their detail modal.
              </div>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.lineId}
                  className="border-b border-(--line) px-3 py-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <p className="min-w-0 flex-1 truncate text-sm! font-semibold!">
                      {entry.productName}
                    </p>
                    <label className="flex items-center gap-2 text-xs! text-(--text-muted)!">
                      Servings
                      <input
                        aria-label={`Servings of ${entry.productName}`}
                        type="number"
                        min="1"
                        step="1"
                        value={entry.quantity}
                        onChange={(event) => {
                          onChange(
                            entries.map((item) =>
                              item.lineId === entry.lineId
                                ? { ...item, quantity: event.target.value }
                                : item
                            )
                          );
                        }}
                        className="w-16! text-right text-sm!"
                      />
                    </label>
                    <button
                      type="button"
                      title={`Remove ${entry.productName}`}
                      onClick={() => {
                        onChange(
                          entries.filter((item) => item.lineId !== entry.lineId)
                        );
                      }}
                      className="p-1 text-(--text-muted) hover:text-(--text-danger)"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {entry.recipeItems.length > 0 && (
                    <div className="ml-2 mt-3 border-l-2 border-(--line) pl-3">
                      {entry.recipeItems.map((recipeItem) => (
                        <label
                          key={recipeItem.inventoryItemId}
                          className="grid grid-cols-[minmax(0,1fr)_7rem] items-center gap-3 py-1"
                        >
                          <span className="truncate text-xs! text-(--text-muted)!">
                            {recipeItem.name} per serving
                          </span>
                          <span className="flex items-center gap-1">
                            <input
                              aria-label={`${recipeItem.name} per serving for ${entry.productName}`}
                              type="number"
                              min="0"
                              step="any"
                              value={recipeItem.quantity}
                              onChange={(event) => {
                                onChange(
                                  entries.map((item) =>
                                    item.lineId === entry.lineId
                                      ? {
                                          ...item,
                                          recipeItems: item.recipeItems.map(
                                            (ingredient) =>
                                              ingredient.inventoryItemId ===
                                              recipeItem.inventoryItemId
                                                ? {
                                                    ...ingredient,
                                                    quantity:
                                                      event.target.value,
                                                  }
                                                : ingredient
                                          ),
                                        }
                                      : item
                                  )
                                );
                              }}
                              className="w-full! text-right text-xs!"
                            />
                            <span className="text-[10px]! text-(--text-muted)!">
                              {recipeItem.unit}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xs! text-(--text-muted)!">
              {entries.length} line{entries.length === 1 ? "" : "s"} ·{" "}
              {totalUnits} serving{totalUnits === 1 ? "" : "s"}
            </span>
            <div className="flex gap-2">
              <button type="button" onClick={close} className="button-outlined">
                Close
              </button>
              <button
                type="button"
                disabled={entries.length === 0 || hasInvalidValues || isPending}
                onClick={() => {
                  setIsConfirmOpen(true);
                }}
                className="button-accent flex items-center gap-1.5"
              >
                {/* <Minus className="size-4" /> */}
                Deduct batch
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Dialog
        isOpen={isConfirmOpen}
        title="Deduct Batch"
        confirmText={isPending ? "Deducting..." : "Confirm"}
        onClose={() => {
          setIsConfirmOpen(false);
        }}
        onConfirm={() => {
          void submit();
        }}
      >
        <p className="text-sm!"></p>
        <AlertBanner
          variant="info"
          message={`
          Deduct the items for ${String(totalUnits)} serving
          ${totalUnits === 1 ? "" : "s"} across ${String(entries.length)} batch line${entries.length === 1 ? "" : "s"}?`}
        />
      </Dialog>
    </>
  );
};

export default ProductionBatch;
