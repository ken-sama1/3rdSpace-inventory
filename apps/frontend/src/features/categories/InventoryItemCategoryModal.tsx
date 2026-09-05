import Modal from "@/components/ui/Modal";
import type { InventoryItemCategoryWithItemsDto } from "@repo/shared";
import type { FC } from "react";

interface InventoryItemCategoryModalProps {
  category: InventoryItemCategoryWithItemsDto;
  isOpen: boolean;
  onClose?: () => void;
}

const InventoryItemCategoryModal: FC<InventoryItemCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  return (
    <Modal title={category.name} onClose={onClose} isOpen={isOpen}>
      <div className="w-lg">
        <div className="w-full flex gap-2 flex-col">
          {/* Label */}
          <div className="w-full">
            <span className="font-semibold text-sm text-(--text-muted)! uppercase tracking-wider">
              Items:
            </span>
          </div>

          {/* List */}
          <div className="size-full flex flex-col">
            {/* List Header */}
            <div className="grid grid-cols-4 py-2 px-4 border-b border-(--line)">
              {/* Name */}
              <span className="col-span-1 text-center font-semibold uppercase text-sm truncate">
                Name
              </span>

              {/* Available / Qyantity  */}
              <span className="col-span-1 text-center font-semibold uppercase text-sm truncate">
                Available
              </span>

              {/* Unit */}
              <span className="col-span-1 text-center font-semibold uppercase text-sm truncate">
                Unit
              </span>

              {/* Action */}
              <span className="col-span-1 text-center font-semibold uppercase text-sm truncate">
                Action
              </span>
            </div>

            {/* List */}
            <div className="grid-cols-4 max-h-[30vh] overflow-auto grid">
              {category.inventoryItems.map((item) => {
                return (
                  <div
                    key={`item-category-${item.id}`}
                    className="col-span-4 grid grid-cols-4 py-2 px-4 border-b border-(--line)"
                  >
                    {/* Name */}
                    <span className="col-span-1 text-center text-sm truncate">
                      {item.name}
                    </span>

                    {/* Available / Qyantity  */}
                    <span className="col-span-1 text-center text-sm truncate">
                      {item.quantity}
                    </span>

                    {/* Unit */}
                    <span className="col-span-1 text-center lowercase text-sm truncate">
                      {item.unit}
                    </span>

                    <div className="col-span-1 flex justify-center">
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
            <button type="button" className="button-accent py-1!">
              Add
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InventoryItemCategoryModal;
