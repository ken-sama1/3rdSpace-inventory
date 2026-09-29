import DashboardKpiCard from "@/features/dashboard/DashboardKpiCard";
import { useGetReportSummary } from "@/hooks/reports/useGetReportSummary";
import type { ReportPeriodSchema } from "@repo/shared";
import {
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  PackageCheck,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "PHP",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const Reports = () => {
  const [period, setPeriod] = useState<ReportPeriodSchema>("7d");
  const { data, isLoading, isError } = useGetReportSummary({
    query: {
      filter: {
        period: period,
      },
    },
  });
  const chartMax = useMemo(
    () =>
      Math.max(...(data?.salesByDay.map((item) => item.totalSales) ?? [1]), 1),
    [data]
  );

  return (
    <main className="min-h-full bg-(--primary) p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl!">Reports</h2>
          <p className="text-xs! text-(--text-muted)!">
            Track sales performance and recent transactions
          </p>
        </div>
        <label className="relative flex items-center gap-2">
          <CalendarDays className="size-4 text-(--text-muted)" />
          <select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value as ReportPeriodSchema)
            }
            className="h-9! rounded-md! pr-3!"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center text-sm text-(--text-muted)">
          Loading report...
        </div>
      ) : isError || !data ? (
        <div className="rounded-md border border-(--line-danger) bg-(--bg-danger) p-5 text-sm text-(--text-danger)!">
          Unable to load the sales report.
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardKpiCard
              title="Total Sales"
              value={currency.format(data.summary.totalSales)}
              description="Revenue in selected period"
              icon={
                <div className="rounded-md bg-(--bg-success) p-1.5">
                  <CircleDollarSign className="size-5 stroke-(--text-success)" />
                </div>
              }
            />
            <DashboardKpiCard
              title="Transactions"
              value={data.summary.transactionCount}
              description="Completed sales"
              icon={<Receipt className="size-5 text-(--accent)" />}
            />
            <DashboardKpiCard
              title="Units Sold"
              value={data.summary.unitsSold}
              description="Products sold"
              icon={<PackageCheck className="size-5 text-(--accent)" />}
            />
            <DashboardKpiCard
              title="Average Sale"
              value={currency.format(data.summary.averageOrderValue)}
              description="Average transaction value"
              icon={<TrendingUp className="size-5 text-(--accent)" />}
            />
          </section>

          <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
            <div className="rounded-md border border-(--line) p-4">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base!">Sales overview</h3>
                  <p className="text-xs! text-(--text-muted)!">
                    Revenue by day
                  </p>
                </div>
                <BarChart3 className="size-5 text-(--accent)" />
              </div>
              {data.salesByDay.length ? (
                <div className="flex h-56 items-end gap-2 overflow-x-auto pb-6">
                  {data.salesByDay.map((day) => (
                    <div
                      key={day.date}
                      className="flex h-full min-w-12 flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span className="text-[10px]! text-(--text-muted)!">
                        {currency.format(day.totalSales)}
                      </span>
                      <div
                        title={`${day.transactions} transaction${day.transactions === 1 ? "" : "s"}`}
                        className="w-full min-w-6 rounded-t-md bg-(--accent) transition-all hover:bg-(--text-info)"
                        style={{
                          height: `${Math.max((day.totalSales / chartMax) * 100, 4)}%`,
                        }}
                      />
                      <span className="whitespace-nowrap text-[10px]! text-(--text-muted)!">
                        {dateFormatter.format(new Date(`${day.date}T00:00:00`))}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-56 items-center justify-center text-sm text-(--text-muted)">
                  No sales recorded for this period.
                </div>
              )}
            </div>

            <div className="rounded-md border border-(--line) p-4">
              <div className="mb-4">
                <h3 className="text-base!">Top products</h3>
                <p className="text-xs! text-(--text-muted)!">
                  Best performers by revenue
                </p>
              </div>
              {data.topProducts.length ? (
                <div className="flex flex-col">
                  {data.topProducts.map((product, index) => (
                    <div
                      key={product.productName}
                      className="flex items-center gap-3 border-b border-(--line) py-3 last:border-0"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-(--bg-info) text-xs! font-bold! text-(--text-info)!">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm!">
                          {product.productName}
                        </p>
                        <p className="text-xs! text-(--text-muted)!">
                          {product.unitsSold} unit
                          {product.unitsSold === 1 ? "" : "s"}
                        </p>
                      </div>
                      <span className="text-sm! font-semibold! text-(--heading)!">
                        {currency.format(product.totalSales)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-(--text-muted)">
                  No products sold yet.
                </div>
              )}
            </div>
          </section>

          <section className="mt-3 rounded-md border border-(--line) p-4">
            <div className="mb-4">
              <h3 className="text-base!">Recent transactions</h3>
              <p className="text-xs! text-(--text-muted)!">
                The latest completed sales
              </p>
            </div>
            {data.recentTransactions.length ? (
              <div className="overflow-x-auto">
                <div className="min-w-155">
                  <div className="grid grid-cols-12 border-b-2 border-(--line) pb-2 text-[10px]! font-bold! uppercase tracking-wider text-(--text-muted)!">
                    <span className="col-span-4">Product</span>
                    <span className="col-span-2 text-center">Quantity</span>
                    <span className="col-span-2 text-right">Unit price</span>
                    <span className="col-span-2 text-right">Total</span>
                    <span className="col-span-2 text-right">Date</span>
                  </div>
                  {data.recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="grid grid-cols-12 items-center border-b border-(--line) py-3 text-sm last:border-0"
                    >
                      <span className="col-span-4 truncate">
                        {transaction.productName}
                      </span>
                      <span className="col-span-2 text-center">
                        {transaction.quantity}
                      </span>
                      <span className="col-span-2 text-right text-(--text-muted)!">
                        {currency.format(transaction.unitPrice)}
                      </span>
                      <span className="col-span-2 text-right font-semibold! text-(--heading)!">
                        {currency.format(transaction.transactionPrice)}
                      </span>
                      <span className="col-span-2 text-right text-xs! text-(--text-muted)!">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(new Date(transaction.createdAt))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center text-sm text-(--text-muted)">
                No transactions recorded yet.
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
};

export default Reports;
