import { useGetInventoryItems } from "@/hooks/inventory/useGetInventoryItems";
import Modal from "../ui/Modal";
import type { FC } from "react";

interface SelectInventoryItemsModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const SelectInventoryItemsModal: FC<SelectInventoryItemsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: items } = useGetInventoryItems();

  console.log(items);

  return (
    <Modal title="as" isOpen={isOpen} onClose={onClose}>
      {" "}
    </Modal>
  );
};

export default SelectInventoryItemsModal;
