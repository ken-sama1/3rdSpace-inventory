import Collapsible from "@/components/ui/Collapsible";
import CreateItemModal from "@/features/inventory/CreateItemModal";
import ItemQueryOptions from "@/features/inventory/ItemQueryOptions";
import ItemsTable from "@/features/inventory/ItemsTable";
import ItemsTableSkeleton from "@/features/inventory/ItemsTableSkeleton";
import { useGetInventoryItems } from "@/hooks/inventory-items/queries/useGetInventoryItems";
import { getApiErrorMessage } from "@/utils/api-error-message.util";
import { debounce } from "@/utils/debounce.util";
import {
  getInventoryItemsReqQuerySchema,
  type GetInventoryItemsReqQuerySchema,
  type InventoryItemFilterSchema,
  type InventoryItemOptionsSchema,
} from "@repo/shared";
import { LayersPlus, SlidersHorizontal } from "lucide-react";
import qs from "qs";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Inventory = () => {
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [, setSearchParams] = useSearchParams();

  const params = qs.parse(window.location.search.substring(1));
  const parsedParams = getInventoryItemsReqQuerySchema.safeParse(params).data;

  const [openCreateItem, setOpenCreateItem] = useState(false);
  const [openCollapsible, setOpenCollapsible] = useState(false);
  const { data, isLoading, isError, error } = useGetInventoryItems({
    query: parsedParams,
  });

  const updateSearch = debounce((query: string) => {
    setSearchParams(
      qs.stringify({ filter: { ...parsedParams?.filter, name: query } })
    );
  }, 1000);

  const updateSearchParams = debounce(
    ({ filter = {}, options = {} }: GetInventoryItemsReqQuerySchema) => {
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
    <main className="w-full min-h-full h-auto flex flex-col bg-(--primary) p-2">
      {/* Idk the top section? */}
      <div className="relative z-2 mt-3 flex min-h-8 w-full flex-wrap items-center justify-between gap-2">
        {/* Search Bar & Filter */}
        <div className="relative flex min-w-0 flex-1 gap-2 sm:flex-none">
          <input
            onChange={(e) => {
              updateSearch(e.target.value);
            }}
            type="search"
            className="h-8! min-w-0 flex-1 rounded-sm! py-0! text-xs! sm:w-50! sm:flex-none"
            placeholder="Search items..."
          />

          <button
            ref={filterButtonRef}
            onClick={() => {
              setOpenCollapsible(!openCollapsible);
            }}
            title="Filter & Sort"
            className="button-accent h-8! shrink-0 rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!"
          >
            <SlidersHorizontal className="stroke-2 h-5 stroke-inherit!" />
          </button>

          <div className="absolute left-0 top-full z-10 mt-2 w-[min(24rem,calc(100vw-1rem))] sm:w-md">
            <Collapsible
              isOpen={openCollapsible}
              onClose={() => {
                setOpenCollapsible(false);
              }}
              refs={[filterButtonRef]}
            >
              <div className="p-5">
                <ItemQueryOptions
                  initialQuery={parsedParams}
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
          onClick={() => {
            setOpenCreateItem(true);
          }}
          title="New Item"
          className="button-accent h-8! shrink-0 rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!"
        >
          <LayersPlus className="stroke-2 h-5 stroke-inherit!" />
        </button>
      </div>
      {/* End of idk the top section? */}

      {/* Literally just a line */}
      <div className="divider"></div>

      <section className="z-1 h-[65dvh] w-full overflow-auto">
        {isLoading ? (
          <ItemsTableSkeleton />
        ) : isError ? (
          <div className="flex min-h-40 items-center justify-center text-sm text-(--text-danger)!">
            {getApiErrorMessage(error)}
          </div>
        ) : data ? (
          <ItemsTable items={data} />
        ) : null}
      </section>

      <CreateItemModal
        isOpen={openCreateItem}
        onClose={() => {
          setOpenCreateItem(false);
        }}
      />
    </main>
  );
};

export default Inventory;
