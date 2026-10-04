import DashboardKpiCard from "@/features/dashboard/DashboardKpiCard";
import RecentTransactions from "@/features/reports/RecentTransactions";
import SalesOverview from "@/features/reports/SalesOverview";
import { useGetReportSummary } from "@/hooks/reports/useGetReportSummary";
import { formatCurrency } from "@/utils/format-currency.util";
import type { ReportPeriodSchema } from "@repo/shared";
import {
  CalendarDays,
  CircleDollarSign,
  PackageCheck,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const Reports = () => {
  const [period, setPeriod] = useState<ReportPeriodSchema>("7d");
  const { data, isLoading, isError } = useGetReportSummary({
    query: {
      filter: {
        period: period,
      },
    },
  });

  return (
    <main className="min-h-full bg-(--primary) p-3">
      <div className="mb-3 flex flex-wrap items-center justify-end gap-3">
        {/* <div> */}
        {/*   <h2 className="text-xl!">Reports</h2> */}
        {/*   <p className="text-xs! text-(--text-muted)!"> */}
        {/*     Track sales performance and recent transactions */}
        {/*   </p> */}
        {/* </div> */}
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
              value={formatCurrency(data.summary.totalSales)}
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
              value={formatCurrency(data.summary.averageOrderValue)}
              description="Average transaction value"
              icon={<TrendingUp className="size-5 text-(--accent)" />}
            />
          </section>

          <SalesOverview
            salesByDay={data.salesByDay}
            topProducts={data.topProducts}
          />

          <RecentTransactions recentTransactions={data.recentTransactions} />
        </>
      )}
    </main>
  );
};

export default Reports;
