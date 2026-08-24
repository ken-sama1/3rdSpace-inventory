import AlertBanner from "@/components/ui/AlertBanner";
import Dialog from "@/components/ui/Dialog";
import { useToastContext } from "@/context/ToastContext";
import useDeleteInventoryItem from "@/hooks/inventory/useDeleteInventoryItem";
import useUpdateInventoryItem from "@/hooks/inventory/useUpdateInventoryItem";
import {
  API_ERROR_CODE_TO_MESSAGE,
  ApiErrorCode,
  inventoryItemUnits,
  type InventoryItemDto,
  type InventoryItemUnit,
  type ResponseError,
} from "@repo/shared";
import { isAxiosError } from "axios";
import { useRef, useState, type FC } from "react";

interface EditItemFormProps {
  onCancel?: () => void;
  onSave?: () => void;
  item: InventoryItemDto;
  isActive: boolean;
}

const EditItemForm: FC<EditItemFormProps> = ({
  onCancel,
  onSave,
  item,
  isActive,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [dialog, setDialog] = useState<"update" | "delete" | null>(null);

  const { delete: deleteItem, isPending: deletePending } =
    useDeleteInventoryItem();

  const { update: updateItem, isPending: updatePending } =
    useUpdateInventoryItem();

  const { showToast } = useToastContext();

  const handleCloseAll = () => {
    setDialog(null);

    if (onSave) {
      onSave();
    }
  };

  if (!item) return <></>;

  const handleDelete = async () => {
    try {
      await deleteItem(item.id);
      handleCloseAll();
      showToast({
        variant: "success",
        message: "Item successfully deleted",
      });
    } catch (error) {
      let code: ApiErrorCode | undefined;

      setDialog(null);

      if (isAxiosError<ResponseError>(error)) {
        code = error.response?.data.code;
      }

      showToast({
        variant: "danger",
        message: API_ERROR_CODE_TO_MESSAGE[code ?? "UNKNOWN_ERROR"],
        forceToTop: true,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      if (!formRef.current) throw new Error("No form reference found");

      const formitem = new FormData(formRef.current);

      const name = formitem.get("item-name") as string | undefined;
      const quantityStr = formitem.get("item-quantity") as string | null;
      const quantity = quantityStr ? Number(quantityStr) : undefined;
      const unit = formitem.get("item-unit") as InventoryItemUnit | undefined;
      const imageUrl = formitem.get("item-image") as string | undefined;
      const category = formitem.get("item-category") as string | undefined;
      const description = formitem.get("item-description") as
        string | undefined;
      await updateItem({
        id: item.id,
        data: {
          ...(name && { name }),
          ...(quantity !== undefined && !isNaN(quantity) && { quantity }),
          ...(unit && { unit }),
          ...(imageUrl && { imageUrl }),
          ...(category && { category }),
          ...(description && { description }),
        },
      });

      handleCloseAll();
      showToast({
        variant: "success",
        message: "Item successfully updated",
      });
    } catch (error) {
      console.error(error);
      setDialog(null);
      showToast({
        variant: "danger",
        message: "Something went wrong!",
        forceToTop: true,
      });
    }
  };

  return (
    <>
      <form
        style={{
          ...(!isActive && {
            display: "none",
          }),
        }}
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          setDialog("update");
        }}
        className="relative size-full flex flex-col gap-5"
      >
        {/* Form Content Wrapper */}
        <div className="h-auto grid grid-cols-4 gap-y-2 gap-x-5">
          {/* Name */}
          <div className="grid col-span-2 gap-y-2">
            <label
              htmlFor="item-name"
              className="text-sm! text-(--text-muted)! font-semibold!"
            >
              Name:
            </label>
            <input
              onChange={() => {
                if (!hasChanges) setHasChanges(true);
              }}
              defaultValue={item.name}
              required
              type="text"
              id="item-name"
              name="item-name"
              className="rounded-md! h-7! text-xs!"
            />
          </div>

          {/* Category */}
          <div className="grid col-span-2 gap-y-2">
            <label
              htmlFor="item-category"
              className="text-sm! text-(--text-muted)! font-semibold!"
            >
              Category
            </label>
            <input
              onChange={() => {
                if (!hasChanges) setHasChanges(true);
              }}
              defaultValue={item.category ?? ""}
              id="item-category"
              type="text"
              name="item-category"
              className="rounded-md! h-7! text-xs!"
            />
          </div>

          {/* Unit */}
          <div className="grid col-span-2 gap-y-2">
            <label
              htmlFor="item-unit"
              className="text-sm! text-(--text-muted)! font-semibold!"
            >
              Unit:
            </label>
            <select
              onChange={() => {
                if (!hasChanges) setHasChanges(true);
              }}
              defaultValue={item.unit}
              required
              id="item-unit"
              name="item-unit"
              className="rounded-md! h-7! text-xs!"
            >
              <option hidden value={""}>
                Select Unit
              </option>
              {inventoryItemUnits.map((item) => (
                <option key={`option-${item}`} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center justify-start">
            {/* Delete Button */}
            <button
              disabled={deletePending}
              onClick={() => setDialog("delete")}
              type="button"
              className="button-danger h-7! py-0!"
            >
              Delete
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center justify-end gap-2">
            {/* Back Button */}
            <button
              onClick={() => {
                if (onCancel) onCancel();
              }}
              type="button"
              className="button-outlined h-7! py-0!"
            >
              Back
            </button>

            {/* Save Button */}
            <button
              disabled={!hasChanges || updatePending}
              type="submit"
              className={`${hasChanges ? "button-accent" : "button-muted"} h-7! py-0!`}
            >
              {updatePending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
      {dialog && (
        <Dialog
          isOpen={true}
          onClose={() => setDialog(null)}
          confirmText="Yes"
          cancelText="No"
          variant={dialog === "delete" ? "danger" : "accent"}
          title={
            dialog === "delete"
              ? `Delete ${item?.name}?`
              : `Update ${item?.name}?`
          }
          onConfirm={dialog === "delete" ? handleDelete : handleUpdate}
        >
          {dialog === "delete" ? (
            <AlertBanner
              variant="danger"
              message="This will permanently delete this item from your inventory."
            />
          ) : (
            <div className="w-full flex flex-col items-center justify-center text-center p-2">
              <AlertBanner
                variant="info"
                message="Your updates will take effect immediately."
              />
            </div>
          )}
        </Dialog>
      )}
    </>
  );
};

export default EditItemForm;
