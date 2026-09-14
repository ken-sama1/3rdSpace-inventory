import type { InventoryItemDto } from "@repo/shared";
import type { FC } from "react";

interface StockStatusItemsProps {
  lowStockItems: InventoryItemDto[];
  outOfStockItems: InventoryItemDto[];
}

const StockStatusItems: FC<StockStatusItemsProps> = ({
  lowStockItems,
  outOfStockItems,
}) => {
  const items = [
    ...outOfStockItems.map((item) => ({
      ...item,
      status: "Out of Stock" as const,
    })),
    ...lowStockItems.map((item) => ({
      ...item,
      status: "Low" as const,
    })),
  ];

  if (items.length === 0) {
    return (
      <section className="border border-(--line) rounded-md p-4">
        <h3 className="text-base font-semibold mb-4">Stock Status</h3>

        <p className="text-sm text-(--text-muted)">
          All items are sufficiently stocked.
        </p>
      </section>
    );
  }

  return (
    <section className="border border-(--line) rounded-md max-h-100 overflow-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base! font-semibold!">Stock Status</h3>

        <span className="text-xs! text-(--text-muted)">
          {items.length} items
        </span>
      </div>

      <div className="flex flex-col">
        {items.map((item) => (
          <div
            key={item.id}
            className="
              flex items-center justify-between
              py-2
              border-b border-(--line)
            "
          >
            <div>
              <p className="text-sm!">{item.name}</p>

              <p className="text-xs! text-(--text-muted)!">
                {item.quantity} {item.unit}
              </p>
            </div>

            <span
              className={`text-xs! px-2 py-1 rounded-md ${
                item.status === "Low" ? "status-warning" : "status-danger"
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StockStatusItems;
