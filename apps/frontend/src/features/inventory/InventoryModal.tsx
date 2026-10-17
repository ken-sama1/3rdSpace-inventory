import Modal from "@/components/ui/Modal";
import { useGetInventoryItemById } from "@/hooks/inventory-items/queries/useGetInventoryItemById";
import type { IdSchema } from "@repo/shared";
import { useState, type FC } from "react";
import EditItemForm from "./EditItemForm";
import UpdateStockForm from "./UpdateStockForm";

interface InventoryModalProps {
  isOpen: boolean;
  onClose?: () => void;
  itemId: IdSchema;
}

const InventoryModal: FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  itemId,
}) => {
  const [view, setView] = useState<"stock" | "edit">("stock");

  const { data: item } = useGetInventoryItemById({ itemId });

  if (!item) return <></>;

  return (
    <Modal title={item.name} isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-full">
        <EditItemForm
          onCancel={() => {
            setView("stock");
          }}
          onSave={onClose}
          item={item}
          isActive={view === "edit"}
        />

        <UpdateStockForm
          isActive={view === "stock"}
          itemId={itemId}
          onEdit={() => {
            setView("edit");
          }}
          onSave={() => {
            if (onClose) onClose();
          }}
        />
      </div>
    </Modal>
  );
};

export default InventoryModal;
