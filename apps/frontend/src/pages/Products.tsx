import Collapsible from "@/components/ui/Collapsible";
import CreateProductModal from "@/features/products/CreateProductModal";
import ProductQueryOptions from "@/features/products/ProductQueryOptions";
import ProductsTable from "@/features/products/ProductsTable";
import { useGetProducts } from "@/hooks/products/useGetProducts";
import { debounce } from "@/utils/debounce";
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
  const [_, setSearchParams] = useSearchParams();

  const params = qs.parse(window.location.search.substring(1));
  const parsedParams = getProductsReqQuerySchema.safeParse(params).data;

  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [openCollapsible, setOpenCollapsible] = useState(false);

  const { data } = useGetProducts({
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
      <div className="mt-3 h-7! w-full z-2 flex justify-between align-center gap-2">
        {/* Search Bar & Filter */}
        <div className="flex gap-2 relative">
          <input
            onChange={(e) => {
              updateSearch(e.target.value);
            }}
            type="search"
            className="text-xs! rounded-sm! w-50! h-full! py-0!"
            placeholder="Search products..."
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

        {/* Create new product */}
        <button
          onClick={() => setOpenCreateProduct(true)}
          title="New Product"
          className="button-accent h-full! rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!"
        >
          <PackagePlus className="stroke-2 h-5 stroke-inherit!" />
        </button>
      </div>

      {/* Divider */}
      <div className="divider"></div>

      <section className="w-full z-1 h-[65dvh] overflow-auto">
        {data && <ProductsTable products={data} />}
      </section>

      <CreateProductModal
        isOpen={openCreateProduct}
        onClose={() => setOpenCreateProduct(false)}
      />
    </main>
  );
};

export default Products;
