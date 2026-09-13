import DashboardKpiCard from "@/features/dashboard/DashboardKpiCard";
import InventoryStatusCard from "@/features/dashboard/InventoryStatusCard";
import LowStockItems from "@/features/dashboard/LowStockItems";
import ProductAvailability from "@/features/dashboard/ProductAvailability";

import { useGetInventoryItems } from "@/hooks/inventory/useGetInventoryItems";
import { useGetProducts } from "@/hooks/products/useGetProducts";
import { useStockConfig } from "@/hooks/useStockConfig";

import { Boxes, Package, PackageX, TriangleAlert } from "lucide-react";

import { useMemo } from "react";

const Dashboard = () => {
  const { getStatus, getMaxServings } = useStockConfig();

  const { data: items } = useGetInventoryItems();
  const { data: products } = useGetProducts();

  const stock = useMemo(() => {
    if (!items) {
      return {
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
        lowStockItems: [],
      };
    }

    const lowStockItems = [];
    let lowStock = 0;
    let outOfStock = 0;

    for (const item of items) {
      const status = getStatus(item.quantity, item.unit);

      if (status === "low") {
        lowStock++;
        lowStockItems.push(item);
      }

      if (status === "out") {
        outOfStock++;
      }
    }

    return {
      inStock: items.length - lowStock - outOfStock,
      lowStock,
      outOfStock,
      lowStockItems,
    };
  }, [items, getStatus]);

  return (
    <main className="w-full min-h-full bg-(--primary) p-2">
      {/* KPIs */}
      <section className="grid grid-cols-4 gap-3">
        <DashboardKpiCard
          title="Total Products"
          value={products?.length ?? "—"}
          description="Products in catalog"
          icon={<Package className="size-5" />}
        />

        <DashboardKpiCard
          title="Total Items"
          value={items?.length ?? "—"}
          description="Tracked inventory items"
          icon={<Boxes className="size-5" />}
        />

        <DashboardKpiCard
          title="Low Stock"
          value={stock.lowStock}
          description="Items running low"
          icon={
            <div className="p-1.5 rounded-md size-fit bg-(--bg-warning)">
              <TriangleAlert className="size-5 stroke-(--text-warning)" />
            </div>
          }
        />

        <DashboardKpiCard
          title="Out of Stock"
          value={stock.outOfStock}
          description="Items unavailable"
          icon={
            <div className="p-1.5 rounded-md size-fit bg-(--bg-danger)">
              <PackageX className="size-5 stroke-(--text-danger)" />
            </div>
          }
        />
      </section>

      {/* Overview */}
      <section className="grid grid-cols-2 gap-3 mt-3">
        <InventoryStatusCard
          total={items?.length ?? 0}
          inStock={stock.inStock}
          lowStock={stock.lowStock}
          outOfStock={stock.outOfStock}
        />

        <LowStockItems items={stock.lowStockItems} />
      </section>

      {/* Products */}
      <section className="mt-3">
        {products && (
          <ProductAvailability
            products={products.map((product) => {
              const { maxServingsCount, missingItemsCount } = getMaxServings(
                product.recipeItems
              );

              return {
                id: product.id,
                name: product.name,
                available: maxServingsCount > 0,
                missingCount: missingItemsCount,
              };
            })}
          />
        )}
      </section>
    </main>
  );
};

export default Dashboard;
