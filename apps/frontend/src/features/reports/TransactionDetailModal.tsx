import Modal from "@/components/ui/Modal";
import { useGetInventoryLogs } from "@/hooks/inventory-logs/useGetInventoryLogs";
import { formatCurrency } from "@/utils/format-currency.util";
import type { IdSchema, Transaction } from "@repo/shared";
import { PackageMinus } from "lucide-react";
import type { FC } from "react";

interface TransactionDetailModalProps {
  transactionId: IdSchema;
  isOpen: boolean;
  onClose?: () => void;
  transaction?: Transaction;
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
      <div className="w-2xl max-w-full">
        {transaction && (
          <section className="mb-5 grid grid-cols-2 gap-3 rounded-md border border-(--line) p-4">
            <div className="col-span-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="truncate text-base!">
                  {transaction.productName}
                </h4>
                <p className="mt-1 text-xs! text-(--text-muted)!">
                  {dateFormatter.format(new Date(transaction.createdAt))}
                </p>
              </div>
              <span className="shrink-0 rounded-full border status-info px-2.5 py-0.5 text-xs font-medium">
                {transaction.quantity} sold
              </span>
            </div>
            <div className="border-t border-(--line) pt-3">
              <p className="text-xs! text-(--text-muted)!">Unit price</p>
              <p className="mt-1 text-sm! font-semibold!">
                {formatCurrency(transaction.unitPrice)}
              </p>
            </div>
            <div className="border-t border-(--line) pt-3 text-right">
              <p className="text-xs! text-(--text-muted)!">Total</p>
              <p className="mt-1 text-sm! font-semibold! text-(--heading)!">
                {formatCurrency(transaction.transactionPrice)}
              </p>
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
            <div className="flex min-h-32 items-center justify-center text-sm text-(--text-muted)">
              Loading inventory changes...
            </div>
          ) : isError ? (
            <div className="rounded-md border border-(--line-danger) bg-(--bg-danger) p-4 text-sm text-(--text-danger)!">
              Unable to load inventory changes for this transaction.
            </div>
          ) : inventoryLogs.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center rounded-md border border-(--line) text-sm text-(--text-muted)">
              No inventory changes were recorded for this transaction.
            </div>
          ) : (
            <div className="max-h-64 overflow-auto rounded-md border border-(--line)">
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
