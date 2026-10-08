import { formatCurrency } from "@/utils/format-currency.util";
import type { Sale, TopProduct } from "@repo/shared";
import { BarChart3 } from "lucide-react";
import { useMemo, type FC } from "react";

interface SalesOverviewProps {
  salesByDay: Sale[];
  topProducts: TopProduct[];
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const SalesOverview: FC<SalesOverviewProps> = ({ salesByDay, topProducts }) => {
  const chartMax = useMemo(
    () => Math.max(...(salesByDay.map((item) => item.totalSales) ?? [1]), 1),
    [salesByDay]
  );

  return (
    <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
      <div className="rounded-md border border-(--line) p-4">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-base!">Sales overview</h3>
            <p className="text-xs! text-(--text-muted)!">Revenue by day</p>
          </div>
          <BarChart3 className="size-5 text-(--accent)" />
        </div>
        {salesByDay.length ? (
          <div className="flex h-56 items-end gap-2 overflow-x-auto pb-6">
            {salesByDay.map((day) => {
              console.log(day.date);
              return (
                <div
                  key={day.date}
                  className="flex h-full min-w-12 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-[10px]! text-(--text-muted)!">
                    {formatCurrency(day.totalSales)}
                  </span>
                  <div
                    title={`${day.transactions} transaction${day.transactions === 1 ? "" : "s"}`}
                    className="w-full min-w-6 rounded-t-md bg-(--accent) transition-all hover:bg-(--text-info)"
                    style={{
                      height: `${Math.max((day.totalSales / chartMax) * 100, 4)}%`,
                    }}
                  />
                  <span className="whitespace-nowrap text-[10px]! text-(--text-muted)!">
                    {dateFormatter.format(new Date(day.date))}
                  </span>
                </div>
              );
            })}
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
        {topProducts.length ? (
          <div className="flex flex-col">
            {topProducts.map((product, index) => (
              <div
                key={product.productName}
                className="flex items-center gap-3 border-b border-(--line) py-3 last:border-0"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-(--bg-info) text-xs! font-bold! text-(--text-info)!">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm!">{product.productName}</p>
                  <p className="text-xs! text-(--text-muted)!">
                    {product.unitsSold} unit
                    {product.unitsSold === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="text-sm! font-semibold! text-(--heading)!">
                  {formatCurrency(product.totalSales)}
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
  );
};

export default SalesOverview;
