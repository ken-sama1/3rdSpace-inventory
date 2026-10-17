import Collapsible from "@/components/ui/Collapsible";
import CreateProductModal from "@/features/products/CreateProductModal";
import ProductQueryOptions from "@/features/products/ProductQueryOptions";
import ProductsTable from "@/features/products/ProductsTable";
import ProductsTableSkeleton from "@/features/products/ProductsTableSkeleton";
import { useGetProducts } from "@/hooks/products/queries/useGetProducts";
import { getApiErrorMessage } from "@/utils/api-error-message.util";
import { debounce } from "@/utils/debounce.util";
import {
  getProductsReqQuerySchema,
  type GetProductsReqQuerySchema,
  type ProductFilterSchema,
  type ProductOptionsSchema,
} from "@repo/shared";
import { PackagePlus, SlidersHorizontal } from "lucide-react";
import qs from "qs";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [, setSearchParams] = useSearchParams();

  const params = qs.parse(window.location.search.substring(1));
  const parsedParams = getProductsReqQuerySchema.safeParse(params).data;

  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [openCollapsible, setOpenCollapsible] = useState(false);

  const { data, isLoading, isError, error } = useGetProducts({
    query: parsedParams,
  });

  const updateSearch = debounce((query: string) => {
    setSearchParams(
      qs.stringify({
        filter: {
          ...parsedParams?.filter,
          name: query,
        },
      })
    );
  }, 1000);

  const updateSearchParams = debounce(
    ({ filter = {}, options = {} }: GetProductsReqQuerySchema) => {
      const { categoryId, price } = filter;

      const { sortBy, order } = options;

      setSearchParams(() => {
        return qs.stringify({
          filter: {
            ...parsedParams?.filter,
            categoryId,
            price,
          } satisfies ProductFilterSchema,

          options: {
            ...parsedParams?.options,
            sortBy,
            order,
          } satisfies ProductOptionsSchema,
        });
      });
    },
    1000
  );

  return (
    <main className="w-full min-h-full h-auto flex flex-col bg-(--primary) p-2">
      {/* Top section */}
      <div className="relative z-2 mt-3 flex min-h-8 w-full flex-wrap items-center justify-between gap-2">
        {/* Search Bar & Filter */}
        <div className="relative flex min-w-0 flex-1 gap-2 sm:flex-none">
          <input
            onChange={(e) => {
              updateSearch(e.target.value);
            }}
            type="search"
            className="h-8! min-w-0 flex-1 rounded-sm! py-0! text-xs! sm:w-50! sm:flex-none"
            placeholder="Search products..."
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
                <ProductQueryOptions
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

        <div className="flex h-full gap-2">
          <button
            onClick={() => {
              setOpenCreateProduct(true);
            }}
            title="New Product"
            className="button-accent h-8! shrink-0 rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!"
          >
            <PackagePlus className="stroke-2 h-5 stroke-inherit!" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="divider"></div>

      <section className="z-1 h-[65dvh] w-full overflow-auto">
        {isLoading ? (
          <ProductsTableSkeleton />
        ) : isError ? (
          <div className="flex min-h-40 items-center justify-center text-sm text-(--text-danger)!">
            {getApiErrorMessage(error)}
          </div>
        ) : data ? (
          <ProductsTable products={data} />
        ) : null}
      </section>

      <CreateProductModal
        isOpen={openCreateProduct}
        onClose={() => {
          setOpenCreateProduct(false);
        }}
      />
    </main>
  );
};

export default Products;
