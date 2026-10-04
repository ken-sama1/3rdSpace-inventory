import Table from "@/components/ui/Table";
import type { FC } from "react";

interface RecentTransaction {
  id?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  transactionPrice: number;
  createdAt: string;
}

interface RecentTransactionsReportProps {
  recentTransactions: RecentTransaction[];
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "php",
});

const RecentTransactions: FC<RecentTransactionsReportProps> = ({
  recentTransactions,
}) => {
  return (
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
              colspan: 2,
              index: 2,
              value: (price) => {
                return (
                  <span className="col-span-2 text-right text-xs! text-(--text-muted)!">
                    {currency.format(price)}
                  </span>
                );
              },
            },
            transactionPrice: {
              colspan: 2,
              index: 3,
              as: "Total",
              value: (price) => {
                return currency.format(price);
              },

              style: {
                fontWeight: "bold",
              },
            },
            createdAt: {
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
  );
};

export default RecentTransactions;
