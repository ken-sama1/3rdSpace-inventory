import ItemsTable from "@/features/inventory/ItemsTable";
import useGetInventoryItems from "@/hooks/inventory/useGetInventoryItems";
import { ListFilter } from "lucide-react";

const StockIn = () => {
  const { data } = useGetInventoryItems();
  return (
    <main className="w-full min-h-full h-auto flex flex-col bg-(--primary) pt-2 p-2">
      <div className="mt-3 h-7! w-full flex justify-between align-center gap-2">
        {/* Search Bar & Filter */}
        <div className="flex gap-2">
          <input
            type="search"
            className="text-xs! rounded-sm! w-50! h-full! py-0!"
            placeholder="Search items..."
          />

          <button
            title="Filter"
            className="button-accent h-full! rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!"
          >
            <ListFilter className="stroke-2 h-5 stroke-inherit!" />
            <span className="flex justify-center items-center text-xs! text-inherit!">
              Filter
            </span>
          </button>
        </div>
      </div>

      <div className="divider"></div>

      <section className="w-full h-[65dvh] flex gap-6 overflow-auto">
        {data && <ItemsTable items={data} onClickEvent="stock-in" />}
      </section>
    </main>
  );
};

export default StockIn;
