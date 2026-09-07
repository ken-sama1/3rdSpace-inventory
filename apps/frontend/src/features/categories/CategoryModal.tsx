import SelectInventoryItemsModal from "@/components/shared/SelectInventoryItemsModal";
import Modal from "@/components/ui/Modal";
import { useGetInventoryItemCategoryById } from "@/hooks/categories/useGetInventoryItemCategoryById";
import { useGetProductCategoryById } from "@/hooks/categories/useGetProductCategoryById";
import type { IdSchema } from "@repo/shared";
import { useState, type FC } from "react";
import type { CategoryTypeEnum } from "./const";
import { isProductCategory } from "./utils";
import { useAssignInventoryItemsToCategory } from "@/hooks/categories/useAssignInventoryItemsToCategory";
import { useToastContext } from "@/context/ToastContext";

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
  const [showSelectItemsModal, setShowSelectItemsModal] =
    useState<boolean>(false);

  const { showToast } = useToastContext();

  const config = {
    item: useGetInventoryItemCategoryById({ categoryId }),
    product: useGetProductCategoryById({ categoryId }),
  } as const;

  const { data: category } = config[type];

  const { assignItems } = useAssignInventoryItemsToCategory();

  const data = isProductCategory(category)
    ? category.products
    : category?.inventoryItems;

  if (!data || !category) return;

  return (
    <Modal title={category.name} onClose={onClose} isOpen={isOpen}>
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
                      <button className="button-danger py-1! text-sm!">
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
              Cancel
            </button>

            <button
              onClick={() => setShowSelectItemsModal(true)}
              type="button"
              className="button-accent py-1!"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {type === "item" && (
        <SelectInventoryItemsModal
          hideItemsWithIds={data.map((v) => v.id)}
          isOpen={showSelectItemsModal}
          onSave={async (selectedItems) => {
            try {
              if (selectedItems.length <= 0) return;
              const res = await assignItems({
                id: categoryId,
                data: {
                  inventoryItemIds: selectedItems.map((v) => v.id),
                },
              });

              setShowSelectItemsModal(false);
              showToast({
                variant: "success",
                message: `${res.length > 1 ? "Items" : "Item"} successfully assigned to ${category.name}`,
              });
            } catch (error) {
              console.error(error);
            }
          }}
          onClose={() => setShowSelectItemsModal(false)}
        />
      )}
    </Modal>
  );
};

export default CategoryModal;
