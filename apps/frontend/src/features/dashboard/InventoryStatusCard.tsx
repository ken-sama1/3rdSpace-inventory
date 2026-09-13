import type { FC } from "react";

export interface InventoryStatusCardProps {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

const InventoryStatusCard: FC<InventoryStatusCardProps> = ({
  total,
  inStock,
  lowStock,
  outOfStock,
}) => {
  const getPercentage = (value: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <section className="border border-(--line) rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base! font-semibold!">Inventory Status</h3>

        <span className="text-xs! text-(--text-muted)!">{total} items</span>
      </div>

      <div className="flex flex-col gap-4">
        <StatusRow
          label="In Stock"
          count={inStock}
          percentage={getPercentage(inStock)}
          variant="success"
        />

        <StatusRow
          label="Low Stock"
          count={lowStock}
          percentage={getPercentage(lowStock)}
          variant="warning"
        />

        <StatusRow
          label="Out of Stock"
          count={outOfStock}
          percentage={getPercentage(outOfStock)}
          variant="danger"
        />
      </div>
    </section>
  );
};

interface StatusRowProps {
  label: string;
  count: number;
  percentage: number;
  variant: "success" | "warning" | "danger";
}

const StatusRow: FC<StatusRowProps> = ({
  label,
  count,
  percentage,
  variant,
}) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm!">{label}</span>

        <span className="text-sm! font-semibold!">{count}</span>
      </div>

      <div className="w-full h-1.5 bg-(--bg-muted) rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full`}
          style={{
            width: `${percentage}%`,
            backgroundColor: `var(--text-${variant}`,
          }}
        />
      </div>
    </div>
  );
};

export default InventoryStatusCard;
