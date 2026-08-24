import CreateItemModal from "@/features/inventory/CreateItemModal";
import ItemsTable from "@/features/inventory/ItemsTable";
import useGetInventoryItems from "@/hooks/inventory/useGetInventoryItems";
import { debounce } from "@/utils/debounce";
import type { InventoryItemFilterSchema } from "@repo/shared";
import { LayersPlus, ListFilter } from "lucide-react";
import qs from "qs";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const Inventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const paramsEntries = Array.from(searchParams.entries()).map(([k, v]) => [
    k,
    v,
  ]);
  const params = Object.fromEntries(paramsEntries);

  const [openAddItem, setOpenAddItem] = useState(false);
  const { data } = useGetInventoryItems(
    qs.parse(params) as InventoryItemFilterSchema
  );

  const updateSearch = debounce((query: string) => {
    setSearchParams(qs.stringify({ name: query }));
    if (searchParams.size) updateFilter();
  }, 1000);

  const updateFilter = debounce(() => {
    const filter = {
      quantity: {
        gte: 100,
      },
    };

    setSearchParams(() => {
      return qs.stringify({
        ...params,
        ...filter,
      });
    });
  }, 1000);

  return (
    <main className="w-full min-h-full h-auto flex flex-col bg-(--primary) pt-2 p-2">
      {/* Idk the top section? */}
      <div className="mt-3 h-7! w-full flex justify-between align-center gap-2">
        {/* Search Bar & Filter */}
        <div className="flex gap-2">
          <input
            onChange={(e) => {
              updateSearch(e.target.value);
            }}
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

        {/* Add new item */}
        <button
          onClick={() => setOpenAddItem(true)}
          title="Add Item"
          className="button-accent h-full! rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!"
        >
          <LayersPlus className="stroke-2 h-5 stroke-inherit!" />
          <span className="flex justify-center items-center text-xs! text-inherit!">
            Add
          </span>
        </button>
      </div>
      {/* End of idk the top section? */}

      {/* Literally just a line */}
      <div className="divider"></div>

      <section className="w-full h-[65dvh] overflow-auto">
        {data && <ItemsTable items={data} />}
      </section>

      <CreateItemModal
        isOpen={openAddItem}
        onClose={() => setOpenAddItem(false)}
      />
    </main>
  );
};

export default Inventory;
