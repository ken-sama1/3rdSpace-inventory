import AlertBanner from "@/components/ui/AlertBanner";
import Collapsible from "@/components/ui/Collapsible";
import Dialog, { type DialogProps } from "@/components/ui/Dialog";
import type { InventoryItemUnitSchema } from "@repo/shared";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState, type FC } from "react";

interface ProduceProductConfig {
  quantity: number;
}

interface ProduceProductContextMenuProps {
  availableQuantity: number;
  requiredQuantity: number;
  name: string;
  unit: InventoryItemUnitSchema;
  onChange?: (config: ProduceProductConfig) => void;
}

const ProduceProductContextMenu: FC<ProduceProductContextMenuProps> = ({
  availableQuantity,
  requiredQuantity,
  unit,
  name,
  onChange,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [dialog, setDialog] = useState<DialogProps | null>(null);
  const [config, setConfig] = useState<ProduceProductConfig>({
    quantity: availableQuantity,
  });

  useEffect(() => {
    if (onChange) {
      onChange(config);
    }
  }, [config]);

  const handleModifyAmount = () => {
    let quantity: number = requiredQuantity;

    setDialog({
      isOpen: true,
      title: name,
      onConfirm: () => {
        setConfig({
          quantity: quantity,
        });
        setDialog(null);
      },

      onClose: () => setDialog(null),
      children: (
        <div className="flex flex-col gap-y-3 py-1 w-xs">
          <AlertBanner
            variant="info"
            message="Modify item amount for this order"
          />

          <div className="flex size-full px-2 gap-2">
            <input
              onChange={(e) => {
                quantity = Number(e.target.value);
              }}
              placeholder="Set Quantity: "
              type="number"
              className="w-4/5! text-xs! py-1!"
            />

            <input
              disabled
              readOnly
              className="w-1/5! lowercase! text-xs! py-1!"
              value={unit}
            />
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="flex relative size-full w-fit">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setShowContextMenu(!showContextMenu);
        }}
        className="p-1! cursor-pointer z-1"
      >
        <EllipsisVertical stroke="var(--text-muted)" className="size-5" />
      </button>

      <div className="absolute top-full z-2 w-fit mt-2 right-0">
        <Collapsible
          refs={[buttonRef]}
          isOpen={showContextMenu}
          onClose={() => setShowContextMenu(false)}
        >
          <div className="w-30 grid relative">
            <button
              onClick={handleModifyAmount}
              type="button"
              className="text-sm cursor-pointer nice-hover nice-transition"
            >
              Modify Amount
            </button>
          </div>
        </Collapsible>
      </div>

      {dialog && <Dialog {...{ ...dialog }} />}
    </div>
  );
};

export default ProduceProductContextMenu;
