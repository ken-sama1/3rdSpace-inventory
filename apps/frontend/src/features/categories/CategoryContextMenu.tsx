import AlertBanner from "@/components/ui/AlertBanner";
import Collapsible from "@/components/ui/Collapsible";
import type { DialogProps } from "@/components/ui/Dialog";
import Dialog from "@/components/ui/Dialog";
import { useToastContext } from "@/context/ToastContext";
import { useDeleteInventoryItemCategory } from "@/hooks/categories/useDeleteInventoryItemCategory";
import { useDeleteProductCategory } from "@/hooks/categories/useDeleteProductCategory";
import { useUpdateInventoryItemCategory } from "@/hooks/categories/useUpdateInventoryItemCategory";
import { useUpdateProductCategory } from "@/hooks/categories/useUpdateProductCategory";
import type { IdSchema } from "@repo/shared";
import { EllipsisVertical } from "lucide-react";
import { useRef, useState, type FC } from "react";
import type { CategoryTypeEnum } from "./const";

interface CategoryContextMenuProps {
  categoryId: IdSchema;
  type: CategoryTypeEnum;
  name: string;
}

const CategoryContextMenu: FC<CategoryContextMenuProps> = ({
  categoryId,
  type,
  name,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [dialog, setDialog] = useState<DialogProps | null>(null);

  const { showToast } = useToastContext();

  const action = {
    product: {
      update: useUpdateProductCategory().update,
      delete: useDeleteProductCategory().delete,
    },
    item: {
      update: useUpdateInventoryItemCategory().update,
      delete: useDeleteInventoryItemCategory().delete,
    },
  }[type];

  const handleRename = () => {
    let newName: string = "";

    setDialog({
      isOpen: true,
      title: `Rename ${name}?`,
      children: (
        <div className="w-xs flex">
          <input
            type="text"
            className="h-6! w-full!"
            onChange={(e) => {
              newName = e.target.value;
            }}
          />
        </div>
      ),
      confirmText: "Set",
      onConfirm: async () => {
        try {
          if (!newName) throw new Error("Invalid Name");

          await action.update({
            id: categoryId,
            data: { name: newName },
          });
          setDialog(null);
          showToast({
            message: `Renamed ${name} to ${newName}`,
            variant: "success",
          });
        } catch (error: any) {
          showToast({
            message: error.message as string,
            forceToTop: true,
            variant: "danger",
          });
        }
      },
    });
  };

  const handlDelete = () => {
    setDialog({
      title: `Delete ${name}?`,
      isOpen: true,
      children: (
        <AlertBanner
          variant="danger"
          message="This will permanently delete this category"
        />
      ),
      variant: "danger",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: async () => {
        try {
          await action.delete(categoryId);
          setDialog(null);
          showToast({
            message: `Category ${name} successfully deleted`,
            variant: "success",
          });
        } catch (error: any) {
          console.error(error);
          setDialog(null);
          showToast({
            message: error.message as string,
            variant: "danger",
          });
        }
      },
    });
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => {
          setShowMenu(!showMenu);
        }}
        type="button"
        className="absolute nice-hover nice-transition p-1 rounded-md cursor-pointer top-1/2 -translate-y-1/2 right-5"
      >
        <EllipsisVertical className="size-5" color="var(--text-muted)" />
      </button>

      <div className="absolute z-2 top-full right-5 size-fit">
        <Collapsible
          refs={[buttonRef]}
          onClose={() => setShowMenu(false)}
          isOpen={showMenu}
        >
          <div className="w-30 grid relative">
            <button
              onClick={handleRename}
              type="button"
              className="text-sm nice-hover nice-transition"
            >
              Rename
            </button>
            <button
              onClick={handlDelete}
              className="text-sm nice-hover nice-transition"
            >
              Delete
            </button>
          </div>
        </Collapsible>
      </div>

      {dialog && (
        <Dialog
          onClose={() => setDialog(null)}
          {...{ ...dialog }}
          isOpen={dialog.isOpen}
        >
          {dialog.children}
        </Dialog>
      )}
    </>
  );
};

export default CategoryContextMenu;
