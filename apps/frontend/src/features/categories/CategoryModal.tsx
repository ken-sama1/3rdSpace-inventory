import SelectInventoryItemsModal from "./SelectInventoryItemsModal";
import SelectProductsModal from "@/features/categories/SelectProductsModal";
import AlertBanner from "@/components/ui/AlertBanner";
import Dialog, { type DialogProps } from "@/components/ui/Dialog";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { useAssignInventoryItemsToCategory } from "@/hooks/categories/mutations/useAssignInventoryItemsToCategory";
import { useAssignProductsToCategory } from "@/hooks/categories/mutations/useAssignProductsToCategory";
import { useGetInventoryItemCategoryById } from "@/hooks/categories/queries/useGetInventoryItemCategoryById";
import { useGetProductCategoryById } from "@/hooks/categories/queries/useGetProductCategoryById";
import { useUnassignInventoryItemsFromCategory } from "@/hooks/categories/mutations/useUnassignInventoryItemsFromCategory";
import { useUnassignProductsFromCategory } from "@/hooks/categories/mutations/useUnassignProductsFromCategory";
import { getApiErrorMessage } from "@/utils/api-error-message.util";
import { type IdSchema } from "@repo/shared";
import { useState, type FC } from "react";
import type { CategoryTypeEnum } from "./constants";
import { isProductCategory } from "./utils";

interface CategoryModalProps {
  categoryId: IdSchema;
  isOpen: boolean;
  type: CategoryTypeEnum;
  onClose?: () => void;
}

const CategoryModal: FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categoryId,
  type,
}) => {
  const [dialog, setDialog] = useState<DialogProps | null>(null);
  const [showSelectSomethingModal, setShowSelectSomethingModal] =
    useState<boolean>(false);

  const { showToast } = useToast();

  const categoryMap = {
    item: useGetInventoryItemCategoryById({ categoryId }),
    product: useGetProductCategoryById({ categoryId }),
  } as const;

  const { data: category } = categoryMap[type];

  const { assignItems } = useAssignInventoryItemsToCategory();
  const { unassignItems } = useUnassignInventoryItemsFromCategory();
  const { assignProducts } = useAssignProductsToCategory();
  const { unassignProducts } = useUnassignProductsFromCategory();

  const data = isProductCategory(category)
    ? category.products
    : category?.inventoryItems;

  if (!data || !category) return;

  const handleCloseAll = () => {
    setDialog(null);
    if (onClose) onClose();
  };

  const handleRemoveSomething = ({
    name,
    somethingId,
  }: {
    name: string;
    somethingId: IdSchema;
  }) => {
    setDialog({
      isOpen: true,
      variant: "danger",
      title: name,
      children: (
        <AlertBanner
          variant="info"
          message={`${name} will be removed in category "${category.name}" immediately`}
        />
      ),
      onConfirm: () => {
        void (async () => {
          try {
            if (type === "item") {
              await unassignItems({
                id: category.id,
                data: {
                  inventoryItemIds: [somethingId],
                },
              });
            }

            if (type === "product") {
              await unassignProducts({
                id: category.id,
                data: {
                  productIds: [somethingId],
                },
              });
            }

            setDialog(null);
            showToast({
              variant: "success",
              message: `${name} removed from category ${category.name}`,
            });
          } catch (error) {
            console.error(error);
            setDialog(null);
            showToast({
              message: getApiErrorMessage(error),
              variant: "danger",
            });
          }
        })();
      },
    });
  };

  return (
    <Modal title={category.name} onClose={handleCloseAll} isOpen={isOpen}>
      <div className="w-lg">
        <div className="w-full flex gap-2 flex-col">
          {/* Label */}
          <div className="w-full">
            <span className="font-semibold text-sm text-(--text-muted)! uppercase tracking-wider">
              {type === "item" ? "Items" : "Products"}:
            </span>
          </div>

          {/* List */}
          <div className="size-full flex flex-col">
            {/* List Header */}
            <div className="grid grid-cols-4 py-2 px-4 border-b border-(--line)">
              {/* Name */}
              <span className="col-span-2 text-center font-semibold uppercase text-sm truncate">
                Name
              </span>

              {/* Action */}
              <span className="col-span-2 text-center font-semibold uppercase text-sm truncate">
                Action
              </span>
            </div>

            {/* List */}
            <div className="grid-cols-4 max-h-[30vh] overflow-auto grid">
              {data.map((d) => {
                return (
                  <div
                    key={`item-category-${d.id}`}
                    className="col-span-4 grid grid-cols-4 py-2 px-4 border-b border-(--line)"
                  >
                    {/* Name */}
                    <span className="col-span-2 text-center text-sm truncate">
                      {d.name}
                    </span>

                    <div className="col-span-2 flex justify-center">
                      <button
                        onClick={() => {
                          handleRemoveSomething({
                            name: d.name,
                            somethingId: d.id,
                          });
                        }}
                        className="button-danger py-1! text-sm!"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end w-full gap-2">
            <button
              onClick={onClose}
              type="button"
              className="button-outlined py-1!"
            >
              Close
            </button>

            <button
              onClick={() => {
                setShowSelectSomethingModal(true);
              }}
              type="button"
              className="button-accent py-1!"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {showSelectSomethingModal && (
        <>
          {type === "item" && (
            <SelectInventoryItemsModal
              hideItemsWithIds={data.map((v) => v.id)}
              isOpen={showSelectSomethingModal}
              onSave={(selectedItems) => {
                void (async () => {
                  try {
                    if (selectedItems.length <= 0) return;
                    const res = await assignItems({
                      id: categoryId,
                      data: {
                        inventoryItemIds: selectedItems.map((v) => v.id),
                      },
                    });

                    setShowSelectSomethingModal(false);
                    showToast({
                      variant: "success",
                      message: `${res.length > 1 ? "Items" : "Item"} successfully assigned to ${category.name}`,
                    });
                  } catch (error: unknown) {
                    console.error(error);
                    setShowSelectSomethingModal(false);
                    showToast({
                      message: getApiErrorMessage(error),
                      variant: "danger",
                    });
                  }
                })();
              }}
              onClose={() => {
                setShowSelectSomethingModal(false);
              }}
            />
          )}

          {type === "product" && (
            <SelectProductsModal
              isOpen={showSelectSomethingModal}
              hideProductsWithIds={data.map((v) => v.id)}
              onClose={() => {
                setShowSelectSomethingModal(false);
              }}
              onSave={(selectedProducts) => {
                void (async () => {
                  try {
                    if (selectedProducts.length <= 0) return;
                    const res = await assignProducts({
                      id: categoryId,
                      data: {
                        productIds: selectedProducts.map((v) => v.id),
                      },
                    });

                    setShowSelectSomethingModal(false);
                    showToast({
                      variant: "success",
                      message: `${res.length > 1 ? "Items" : "Item"} successfully assigned to ${category.name}`,
                    });
                  } catch (error) {
                    console.error(error);
                    setShowSelectSomethingModal(false);
                    showToast({
                      message: getApiErrorMessage(error),
                      variant: "danger",
                    });
                  }
                })();
              }}
            />
          )}
        </>
      )}

      {dialog && (
        <Dialog
          title={dialog.title}
          isOpen={dialog.isOpen}
          onClose={() => {
            setDialog(null);
          }}
          onConfirm={dialog.onConfirm}
        >
          <div className="w-sm">{dialog.children}</div>
        </Dialog>
      )}
    </Modal>
  );
};

export default CategoryModal;
