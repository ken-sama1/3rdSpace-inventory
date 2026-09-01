import Collapsible from "@/components/ui/Collapsible";
import CreateItemModal from "@/features/inventory/CreateItemModal";
import ItemFilter from "@/features/inventory/ItemQueryOptions";
import ItemsTable from "@/features/inventory/ItemsTable";
import useGetInventoryItems from "@/hooks/inventory/useGetInventoryItems";
import { debounce } from "@/utils/debounce";
import {
  getInventoryItemsReqQuerySchema,
  type InventoryItemOptionsSchema,
  type GetInventoryItemsReqQuery,
  type InventoryItemFilterSchema,
} from "@repo/shared";
import { LayersPlus, SlidersHorizontal } from "lucide-react";
import qs from "qs";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Inventory = () => {
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [_, setSearchParams] = useSearchParams();

  const params = qs.parse(window.location.search.substring(1));
  const parsedParams = getInventoryItemsReqQuerySchema.safeParse(params).data;

  const [openCreateItem, setOpenCreateItem] = useState(false);
  const [openCollapsible, setOpenCollapsible] = useState(false);
  const { data } = useGetInventoryItems({
    ...parsedParams,
  });

  const updateSearch = debounce((query: string) => {
    setSearchParams(
      qs.stringify({ filter: { ...parsedParams?.filter, name: query } })
    );
  }, 1000);

  const updateSearchParams = debounce(
    ({ filter = {}, options = {} }: GetInventoryItemsReqQuery) => {
      const { description, categoryId, quantity, unit } = filter;

      const { sortBy, order } = options;

      setSearchParams(() => {
        return qs.stringify({
          filter: {
            ...parsedParams?.filter,
            description,
            categoryId,
            quantity,
            unit,
          } satisfies InventoryItemFilterSchema,
          options: {
            ...parsedParams?.options,
            sortBy,
            order,
          } satisfies InventoryItemOptionsSchema,
        });
      });
    },
    1000
  );

  return (
    <main className="w-full min-h-full h-auto flex flex-col bg-(--primary) pt-2 p-2">
      {/* Idk the top section? */}
      <div className="mt-3 h-7! w-full z-2 flex justify-between align-center gap-2">
        {/* Search Bar & Filter */}
        <div className="flex gap-2 relative">
          <input
            onChange={(e) => {
              updateSearch(e.target.value);
            }}
            type="search"
            className="text-xs! rounded-sm! w-50! h-full! py-0!"
            placeholder="Search items..."
          />

          <button
            ref={filterButtonRef}
            onClick={() => {
              setOpenCollapsible(!openCollapsible);
            }}
            title="Filter & Sort"
            className="button-accent h-full! rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!"
          >
            <SlidersHorizontal className="stroke-2 h-5 stroke-inherit!" />
          </button>

          <div className="absolute z-1 w-md top-full left-0 translate-y-10">
            <Collapsible
              isOpen={openCollapsible}
              onClose={() => setOpenCollapsible(false)}
              refs={[filterButtonRef]}
            >
              <div className="p-5">
                <ItemFilter
                  initialFilter={parsedParams}
                  onChange={(value) => {
                    updateSearchParams({
                      filter: value.filter,
                      options: value.options,
                    });
                  }}
                />
              </div>
            </Collapsible>
          </div>
        </div>

        {/* Create new item */}
        <button
          onClick={() => setOpenCreateItem(true)}
          title="New Item"
          className="button-accent h-full! rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!"
        >
          <LayersPlus className="stroke-2 h-5 stroke-inherit!" />
        </button>
      </div>
      {/* End of idk the top section? */}

      {/* Literally just a line */}
      <div className="divider"></div>

      <section className="w-full z-1 h-[65dvh] overflow-auto">
        {data && <ItemsTable items={data} />}
      </section>

      <CreateItemModal
        isOpen={openCreateItem}
        onClose={() => setOpenCreateItem(false)}
      />
    </main>
  );
};

export default Inventory;
