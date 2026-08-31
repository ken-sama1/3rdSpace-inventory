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
        <div className="w-full flex flex-col">
          {/* Label */}
          <div className="w-full">
            <span className="font-semibold text-sm text-(--text-muted)! uppercase tracking-wider">
              Items:
            </span>
          </div>

          {/* List */}
          <div className="col-span-4 grid grid-cols-4">
            {/* List Header */}
            <div className="col-span-4 grid grid-cols-4 py-2 px-4 border-b border-(--line)">
              {/* Name */}
              <span className="col-span-1 text-center font-semibold uppercase text-sm truncate">
                {" "}
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
          </div>
          {/* Divider */}
        </div>
      </div>
    </Modal>
  );
};

export default InventoryItemCategoryModal;
