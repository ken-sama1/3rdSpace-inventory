import { useGetTransactions } from "@/hooks/transactions/queries/useGetTransactions";
import { formatCurrency } from "@/utils/format-currency.util";
import type { ReportPeriodSchema, TransactionDto } from "@repo/shared";
import { CalendarClock, LoaderCircle, ReceiptText } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FC } from "react";
import TransactionDetailModal from "./TransactionDetailModal";

interface TransactionsTableProps {
  period: ReportPeriodSchema;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const PAGE_SIZE = 30;

const TransactionsTable: FC<TransactionsTableProps> = ({ period }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDto | null>(null);

  const createdAtStart = useMemo(() => {
    const start = new Date();
    if (period === "7d") {
      start.setDate(start.getDate() - 7);
    } else if (period === "30d") {
      start.setDate(start.getDate() - 30);
    } else {
      start.setTime(0);
    }
    return start.toISOString();
  }, [period]);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useGetTransactions({
    filter: {
      createdAt: {
        start: createdAtStart,
      },
    },
    options: {
      limit: PAGE_SIZE,
      order: "desc",
      sortBy: "createdAt",
    },
  });

  const transactions = data?.pages.flat() ?? [];

  useEffect(() => {
    const root = scrollContainerRef.current;
    const target = loadMoreRef.current;
    if (
      !root ||
      !target ||
      !hasNextPage ||
      isFetchingNextPage ||
      isFetchNextPageError
    )
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void fetchNextPage();
      },
      { root, rootMargin: "0px 0px 120px 0px" }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    transactions.length,
  ]);

  return (
    <>
      <section className="mt-3 rounded-md border border-(--line) p-4">
        <div className="mb-4">
          <h3 className="text-base!">Transactions</h3>
          <p className="text-xs! text-(--text-muted)!">
            Sales recorded in the selected period
          </p>
        </div>

        <div className="grid grid-cols-12 border-b-3 border-(--line) px-3 py-3 text-xs font-semibold uppercase tracking-wide text-(--text-muted)!">
          <span className="col-span-6">Products</span>
          <span className="col-span-3 text-right">Total</span>
          <span className="col-span-3 text-right">Date</span>
        </div>

        <div
          ref={scrollContainerRef}
          className="max-h-[min(60vh,40rem)] overflow-y-auto"
        >
          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-(--text-muted)">
              <LoaderCircle className="size-4 animate-spin" />
              Loading transactions...
            </div>
          ) : isError && transactions.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center text-sm text-(--text-danger)!">
              Unable to load transactions.
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-11 items-center justify-center rounded-full bg-(--bg-info) text-(--text-info)">
                <ReceiptText className="size-5" />
              </div>
              <div>
                <p className="text-sm! font-medium!">No transactions found</p>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-xs! text-(--text-muted)!">
                  <CalendarClock className="size-3.5" />
                  No sales were recorded in this period.
                </p>
              </div>
            </div>
          ) : (
            <>
              {transactions.map((transaction) => (
                <button
                  key={transaction.id}
                  type="button"
                  onClick={() => {
                    setSelectedTransaction(transaction);
                  }}
                  className="grid w-full grid-cols-12 items-center gap-3 border-b border-(--line) px-3 py-3 text-left nice-hover"
                >
                  <span
                    className="col-span-6 truncate text-sm!"
                    title={transaction.transactionItems
                      .map(
                        (item) =>
                          `${item.productName} × ${String(item.quantity)}`
                      )
                      .join(", ")}
                  >
                    {transaction.transactionItems
                      .map(
                        (item) =>
                          `${item.productName} × ${String(item.quantity)}`
                      )
                      .join(", ")}
                  </span>
                  <span className="col-span-3 text-right text-sm! font-semibold!">
                    {formatCurrency(transaction.totalPrice)}
                  </span>
                  <span className="col-span-3 text-right text-xs! text-(--text-muted)!">
                    {dateFormatter.format(new Date(transaction.createdAt))}
                  </span>
                </button>
              ))}

              {isFetchNextPageError && (
                <div className="flex items-center justify-center gap-2 px-3 py-3 text-sm text-(--text-danger)!">
                  <span>Unable to load more transactions.</span>
                  <button
                    type="button"
                    className="underline"
                    onClick={() => void fetchNextPage()}
                  >
                    Retry
                  </button>
                </div>
              )}
              <div
                ref={loadMoreRef}
                className="flex min-h-10 items-center justify-center text-xs text-(--text-muted)"
              >
                {isFetchingNextPage && (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="size-4 animate-spin" />
                    Loading more transactions...
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {selectedTransaction && (
        <TransactionDetailModal
          isOpen
          transactionId={selectedTransaction.id}
          transaction={selectedTransaction}
          onClose={() => {
            setSelectedTransaction(null);
          }}
        />
      )}
    </>
  );
};

export default TransactionsTable;
