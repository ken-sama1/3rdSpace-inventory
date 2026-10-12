import Table from "@/components/ui/Table";
import type { Transaction } from "@repo/shared";
import { useState, type FC } from "react";
import TransactionDetailModal from "./TransactionDetailModal";

interface RecentTransactionsReportProps {
  recentTransactions: Transaction[];
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "php",
});

const RecentTransactions: FC<RecentTransactionsReportProps> = ({
  recentTransactions,
}) => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  return (
    <>
      <section className="mt-3 rounded-md border border-(--line) p-4">
        <div className="mb-4">
          <h3 className="text-base!">Recent transactions</h3>
          <p className="text-xs! text-(--text-muted)!">
            The latest completed sales
          </p>
        </div>

        <Table
          data={recentTransactions}
          options={{
            row: {
              onClick: (data) => {
                setSelectedTransaction(data);
              },
            },
            column: {
              productName: {
                colspan: 4,
                index: 0,
              },
              quantity: {
                index: 1,
                colspan: 2,
              },
              unitPrice: {
                index: 2,
                colspan: 2,
                value: (price) => {
                  return (
                    <span className="col-span-2 text-right text-xs! text-(--text-muted)!">
                      {currency.format(price)}
                    </span>
                  );
                },
              },
              transactionPrice: {
                index: 3,
                colspan: 2,
                as: "Total",
                value: (price) => {
                  return currency.format(price);
                },

                style: {
                  fontWeight: "bold",
                },
              },
              createdAt: {
                index: 4,
                colspan: 2,
                as: "Date",
                value: (createdAt) => {
                  return (
                    <span className="col-span-2 text-right text-xs! text-(--text-muted)!">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }).format(new Date(createdAt))}
                    </span>
                  );
                },
              },
            },
            exlude: ["id"],
          }}
        />
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

export default RecentTransactions;
