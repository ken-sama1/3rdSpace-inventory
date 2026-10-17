import Modal from "@/components/ui/Modal";
import { useGetInventoryLogs } from "@/hooks/inventory-logs/queries/useGetInventoryLogs";
import { getApiErrorMessage } from "@/utils/api-error-message.util";
import Skeleton from "@/components/ui/skeletons/Skeleton";
import { formatCurrency } from "@/utils/format-currency.util";
import type { IdSchema, TransactionDto } from "@repo/shared";
import { PackageMinus } from "lucide-react";
import type { FC } from "react";

interface TransactionDetailModalProps {
  transactionId: IdSchema;
  isOpen: boolean;
  onClose?: () => void;
  transaction?: TransactionDto;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const TransactionDetailModal: FC<TransactionDetailModalProps> = ({
  transactionId,
  isOpen,
  onClose,
  transaction,
}) => {
  const {
    data: inventoryLogs = [],
    isLoading,
    isError,
    error,
  } = useGetInventoryLogs({
    query: {
      filter: {
        sourceId: transactionId,
        sourceType: "TRANSACTION",
      },
    },
    options: {
      enabled: isOpen,
    },
  });

  return (
    <Modal title="Transaction details" isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-full">
        {transaction && (
          <section className="mb-5 max-h-54 overflow-auto grid grid-cols-2 gap-3 rounded-md border border-(--line) p-4">
            <div className="col-span-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-base!">Transaction items</h4>
                <p className="mt-1 text-xs! text-(--text-muted)!">
                  {dateFormatter.format(new Date(transaction.createdAt))}
                </p>
              </div>
              <span className="shrink-0 rounded-full border status-info px-2.5 py-0.5 text-xs font-medium">
                {transaction.transactionItems.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}{" "}
                sold
              </span>
            </div>
            <div className="col-span-2 border-t border-(--line) pt-3">
              {transaction.transactionItems.map((item, index) => (
                <div
                  key={`${item.productName}-${String(index)}`}
                  className="flex items-center justify-between gap-3 py-1.5 text-sm"
                >
                  <span className="min-w-0 truncate">
                    {item.productName} × {item.quantity}
                    <span className="ml-2 text-xs! text-(--text-muted)!">
                      {formatCurrency(item.unitPrice)} each
                    </span>
                  </span>
                  <span className="shrink-0 font-medium!">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-(--line) pt-3">
                <p className="text-xs! text-(--text-muted)!">Total</p>
                <p className="text-sm! font-semibold! text-(--heading)!">
                  {formatCurrency(transaction.totalPrice)}
                </p>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="mb-3 flex items-center gap-2">
            <PackageMinus className="size-4 text-(--accent)" />
            <div>
              <h4 className="text-sm!">Inventory deducted</h4>
              <p className="text-xs! text-(--text-muted)!">
                Stock changes linked to this transaction
              </p>
            </div>
          </div>

          {isLoading ? (
            <div
              aria-label="Loading inventory changes"
              role="status"
              className="space-y-3 rounded-md border border-(--line) p-4"
            >
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={`inventory-log-skeleton-${String(index)}`}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-md border border-(--line-danger) bg-(--bg-danger) p-4 text-sm text-(--text-danger)!">
              {getApiErrorMessage(error)}
            </div>
          ) : inventoryLogs.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center rounded-md border border-(--line) text-sm text-(--text-muted)">
              No inventory changes were recorded for this transaction.
            </div>
          ) : (
            <div className="max-h-40 overflow-auto rounded-md border border-(--line)">
              <div className="grid grid-cols-12 gap-3 border-b border-(--line) px-4 py-2 text-xs font-semibold uppercase tracking-wide text-(--text-muted)!">
                <span className="col-span-7">Inventory item</span>
                <span className="col-span-5 text-right">Quantity change</span>
              </div>
              <ul>
                {inventoryLogs.map((log) => (
                  <li
                    key={log.id}
                    className="grid grid-cols-12 items-center gap-3 border-b border-(--line) px-4 py-3 last:border-0"
                  >
                    <div className="col-span-7 min-w-0">
                      <p className="truncate text-sm! font-medium!">
                        {log.itemName}
                      </p>
                      <p className="mt-0.5 truncate text-xs! text-(--text-muted)!">
                        {log.reason}
                      </p>
                    </div>
                    <span className="col-span-5 text-right font-mono text-sm! font-semibold! text-(--text-danger)!">
                      {log.quantityChange}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
};

export default TransactionDetailModal;
