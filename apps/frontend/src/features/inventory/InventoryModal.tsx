import Modal from "@/components/ui/popups/Modal";
import useGetInventoryItem from "@/hooks/inventory/useGetInventoryItem";
import { useState, type FC } from "react";
import EditItemForm from "./EditItemForm";

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
  const [view, setView] = useState<"stock" | "edit">("edit");

  const { data: item, isLoading } = useGetInventoryItem({ itemId });

  if (!item) return <></>;

  return (
    <Modal
      title={!isLoading ? (item?.name ?? "Error") : "Loading..."}
      isOpen={isOpen}
      onClose={onClose}
    >
      {view === "edit" && (
        <EditItemForm
          onCancel={() => setView("stock")}
          onSave={onClose}
          item={item}
        />
      )}

      {view === "stock"}
    </Modal>
  );
};

export default InventoryModal;
