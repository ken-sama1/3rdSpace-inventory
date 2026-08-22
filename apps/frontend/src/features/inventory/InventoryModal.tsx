import Modal from "@/components/ui/popups/Modal";
import useGetInventoryItem from "@/hooks/inventory/useGetInventoryItem";
import { useState, type FC } from "react";
import EditItemForm from "./EditItemForm";
import UpdateStockForm from "./UpdateStockForm";

interface InventoryModalProps {
  isOpen: boolean;
  onClose?: () => void;
  itemId: string;
}

const InventoryModal: FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  itemId,
}) => {
  const [view, setView] = useState<"stock" | "edit">("stock");

  const { data: item, isLoading } = useGetInventoryItem({ itemId });

  if (!item) return <></>;

  return (
    <Modal
      title={!isLoading ? (item?.name ?? "Error") : "Loading..."}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="w-lg">
        <EditItemForm
          onCancel={() => setView("stock")}
          onSave={onClose}
          item={item}
          isActive={view === "edit"}
        />

        <UpdateStockForm
          isActive={view === "stock"}
          itemId={itemId}
          onEdit={() => setView("edit")}
          onSave={() => {
            if (onClose) onClose();
          }}
        />
      </div>
    </Modal>
  );
};

export default InventoryModal;
