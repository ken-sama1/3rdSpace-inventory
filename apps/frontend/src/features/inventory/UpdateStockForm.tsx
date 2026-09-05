import AlertBanner from "@/components/ui/AlertBanner";
import Dialog from "@/components/ui/Dialog";
import { useToastContext } from "@/context/ToastContext";
import { useStockInInventoryItem } from "@/hooks/inventory/useStockInInventoryItem";
import { useStockOutInventoryItem } from "@/hooks/inventory/useStockOutInventoryItem";
import {
  API_ERROR_CODE_TO_MESSAGE,
  type ApiErrorCode,
  type IdSchema,
  type ResponseError,
} from "@repo/shared";
import { isAxiosError } from "axios";
import { useRef, useState, type FC } from "react";

interface UpdateStockFormProps {
  onEdit?: () => void;
  onSave: () => void;
  itemId: IdSchema;
  isActive: boolean;
}

const UpdateStockForm: FC<UpdateStockFormProps> = ({
  onSave,
  onEdit,
  itemId,
  isActive,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [mode, setMode] = useState<"out" | "in">("in");
  const [showDialog, setDialog] = useState<boolean>(false);

  const { showToast } = useToastContext();

  const { stockIn, isPending: isRestocking } = useStockInInventoryItem();
  const { stockOut, isPending: isDestocking } = useStockOutInventoryItem();

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const handleRestock = async () => {
    try {
      if (!formRef.current) throw new Error("No form reference found");

      const formData = new FormData(formRef.current);
      const quantity = formData.get("stock-quantity") as string;

      await stockIn({
        id: itemId,
        data: {
          quantity: Number(quantity),
        },
      });

      setDialog(false);
      onSave();

      showToast({
        message: "Stock successfully updated",
        variant: "success",
      });
    } catch (error) {
      console.error(error);

      setDialog(false);

      showToast({
        variant: "danger",
        message: "Something went wrong!",
      });
    }
  };

  const handleDestock = async () => {
    try {
      if (!formRef.current) throw new Error("No form reference found");

      const formData = new FormData(formRef.current);

      const quantity = formData.get("stock-quantity") as string;
      const reason = formData.get("stock-reason") as string;

      await stockOut({
        id: itemId,
        data: {
          quantity: Number(quantity),
          reason,
        },
      });

      setDialog(false);
      formRef.current.reset();
      onSave();

      showToast({
        message: "Stock successfully updated",
        variant: "success",
      });
    } catch (error) {
      console.error(error);

      let code: ApiErrorCode | undefined;

      if (isAxiosError<ResponseError>(error)) {
        code = error.response?.data.code;
      }

      setDialog(false);

      showToast({
        message: API_ERROR_CODE_TO_MESSAGE[code ?? "UNKNOWN_ERROR"],
        variant: "danger",
      });
    }
  };

  const isStockIn = mode === "in";
  const isStockOut = mode === "out";
  const isPending = isRestocking || isDestocking;

  return (
    <>
      <div
        style={{
          ...(!isActive && { display: "none" }),
        }}
        className="size-full"
      >
        {/* Stock Movement Toggle */}
        <div className="flex w-full rounded-md gap-2 p-0.5">
          <button
            type="button"
            aria-pressed={isStockIn}
            onClick={() => setMode("in")}
            className={`
              w-1/2 rounded-sm py-1.5 text-sm font-medium transition-all
              ${isStockIn ? "button-accent" : "button-outlined"}
            `}
          >
            Stock In
          </button>

          <button
            type="button"
            aria-pressed={isStockOut}
            onClick={() => setMode("out")}
            className={`
              w-1/2 rounded-sm py-1.5 text-sm font-medium transition-all
              ${isStockOut ? "button-danger" : "button-outlined"}
            `}
          >
            Stock Out
          </button>
        </div>

        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            setDialog(true);
          }}
          className="full size-full flex flex-col mt-5 gap-5"
        >
          {/* Form Content */}
          <div className="flex flex-col gap-4">
            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="stock-quantity"
                className="text-sm! text-(--text-muted)! font-semibold!"
              >
                Quantity:
              </label>

              <input
                required
                type="text"
                id="stock-quantity"
                name="stock-quantity"
                className="rounded-md! w-full! h-7! text-xs!"
              />
            </div>

            {/* Reason */}
            {isStockOut && (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="stock-reason"
                  className="text-sm! text-(--text-muted)! font-semibold!"
                >
                  Reason:
                </label>

                <textarea
                  required
                  rows={4}
                  id="stock-reason"
                  name="stock-reason"
                  className="text-auto! text-xs!"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-5">
            <div className="w-1/2 flex justify-start">
              <button
                type="button"
                onClick={onEdit}
                className="button-accent py-1! px-4!"
              >
                Edit
              </button>
            </div>

            <div className="w-1/2 flex justify-end items-center gap-2">
              <button
                type="button"
                onClick={onSave}
                className="button-outlined py-1!"
              >
                Close
              </button>

              <button
                disabled={isPending}
                type="submit"
                className={`py-1! px-4! ${
                  isStockIn ? "button-accent" : "button-danger"
                }`}
              >
                {isStockIn ? "Restock" : "Destock"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Dialog */}
      {showDialog && (
        <Dialog
          isOpen={showDialog}
          onClose={handleCloseDialog}
          confirmText={isStockIn ? "Yes, Restock" : "Yes, Destock"}
          cancelText="No"
          variant={isStockIn ? "accent" : "danger"}
          title={isStockIn ? "Restock Item?" : "Destock Item?"}
          onConfirm={isStockIn ? handleRestock : handleDestock}
        >
          {isStockIn ? (
            <div className="w-full flex flex-col items-center justify-center text-center p-2">
              <AlertBanner
                variant="info"
                message="This will increase the available stock quantity for this item."
              />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center text-center p-2">
              <AlertBanner
                variant="danger"
                message="This will decrease the available stock quantity for this item."
              />
            </div>
          )}
        </Dialog>
      )}
    </>
  );
};

export default UpdateStockForm;
