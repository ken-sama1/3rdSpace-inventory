import SelectInventoryItemsModal from "@/components/shared/SelectInventoryItemsModal";
import Modal from "@/components/ui/Modal";
import { useState, type FC } from "react";
import type { CategoryTypeEnum } from "./const";
import { useGetInventoryItemCategories } from "@/hooks/categories/useGetInventoryItemCategories";
import { useGetProductCategories } from "@/hooks/categories/useGetProductCategories";

interface CategoryModalProps {
  category: {
    id: string;
    name: string;
  };
  isOpen: boolean;
  type: CategoryTypeEnum;
  onClose?: () => void;
}

const CategoryModal: FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  type,
}) => {
  const [showSelectItemsModal, setShowSelectItemsModal] =
    useState<boolean>(false);

  const { data } =
    type === "item"
      ? useGetInventoryItemCategories()
      : useGetProductCategories();

  if (!data) return;

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

      <SelectInventoryItemsModal
        hideItemsWithIds={data.map((item) => item.id)}
        isOpen={showSelectItemsModal}
        onSave={() => {
          try {
          } catch (error) {}
        }}
        onClose={() => setShowSelectItemsModal(false)}
      />
    </Modal>
  );
};

export default CategoryModal;
