import { useGetProducts } from "@/hooks/products/useGetProducts";
import type { IdSchema } from "@repo/shared";
import { useEffect, useState, type FC } from "react";
import AlertBanner from "../ui/AlertBanner";
import Dialog, { type DialogProps } from "../ui/Dialog";
import Modal from "../ui/Modal";
import { X } from "lucide-react";

export interface SelectProductsSelectedProduct {
  id: IdSchema;
  name: string;
}

interface SelectProductsModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialSelectedProducts?: SelectProductsSelectedProduct[];
  hideProductsWithIds?: IdSchema[];
  onSave?: (selectedProducts: SelectProductsSelectedProduct[]) => void;
}

const SelectProductsModal: FC<SelectProductsModalProps> = ({
  isOpen,
  onClose,
  initialSelectedProducts = [],
  hideProductsWithIds = [],
  onSave,
}) => {
  const { data: products } = useGetProducts();

  const [dialog, setDialog] = useState<DialogProps | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<
    SelectProductsSelectedProduct[]
  >([]);

  useEffect(() => {
    if (!isOpen) return;

    setSelectedProducts(initialSelectedProducts);
  }, [isOpen, initialSelectedProducts]);

  if (!products) return;

  return (
    <Modal noBackdrop title="Select Products" isOpen={isOpen} onClose={onClose}>
      {/* Inventory Products */}
      <div className="w-max min-w-xl h-auto max-h-[60vh] no-scrollbar overflow-auto">
        {/* Selected Products */}
        {selectedProducts.length > 0 && (
          <>
            <div className="h-auto w-full flex-wrap flex gap-2">
              {/* Selected Products Headers */}
              <div className="flex w-full justify-between products-center">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Selected Products ({selectedProducts.length})
                </h4>
              </div>

              {selectedProducts.map((item) => {
                if (hideProductsWithIds.includes(item.id)) return;

                return (
                  <div
                    key={`inventory-products-${item.id}`}
                    className="w-auto border flex gap-x-3 products-center status-info rounded-md"
                  >
                    <span className="line-clamp-1">{item.name}</span>
                    <button
                      onClick={() => {
                        setSelectedProducts((prev) => {
                          return prev.filter((f) => f.id !== item.id);
                        });
                      }}
                      className="cursor-pointer"
                    >
                      <X className="stroke-(--line)!" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="divider"></div>
          </>
        )}

        <div className="h-auto grid grid-cols-4 gap-2">
          <h4 className="text-sm col-span-4 font-semibold text-muted-foreground uppercase tracking-wider">
            Available Inventory Products
          </h4>

          {products.map((item) => {
            const isSelected = selectedProducts.find((e) => e.id === item.id);
            if (isSelected) return;
            const hasCategory = item.categoryId;

            console.log(hideProductsWithIds, item.id, item.name);
            if (hideProductsWithIds.includes(item.id)) return;

            return (
              <button
                onClick={() => {
                  if (hasCategory) {
                    setDialog({
                      isOpen: true,
                      title: `${item.name}`,
                      onConfirm: () => {
                        setDialog(null);
                        setSelectedProducts((prev) => [
                          ...prev,
                          {
                            id: item.id,
                            name: item.name,
                          },
                        ]);
                      },
                      children: (
                        <div className="max-w-sm">
                          <AlertBanner
                            variant="info"
                            message={`${item.name} is already in category "${item.category?.name}" do you want to move it in this category?`}
                          />
                        </div>
                      ),
                    });
                    return;
                  }
                  setSelectedProducts((prev) => [
                    ...prev,
                    {
                      id: item.id,
                      name: item.name,
                    },
                  ]);
                }}
                title={item.name}
                key={`inventory-products-${item.id}`}
                className="col-span-1 border border-(--accent)/60 flex justify-start products-center button-outlined"
              >
                <span className="text-sm! line-clamp-1 w-full">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 gap-2 w-full flex products-center justify-end">
          <button onClick={onClose} type="button" className="button-outlined">
            Close
          </button>

          <button
            onClick={() => {
              if (onSave) {
                onSave(selectedProducts);
              }
            }}
            type="button"
            className="button-accent"
          >
            Save
          </button>
        </div>
      </div>

      {dialog && (
        <>
          <Dialog
            noBackdrop
            title={dialog.title}
            isOpen={dialog.isOpen}
            cancelText="No"
            confirmText="Yes"
            onConfirm={dialog.onConfirm}
            onClose={() => setDialog(null)}
          >
            {dialog.children}
          </Dialog>
        </>
      )}
    </Modal>
  );
};

export default SelectProductsModal;
