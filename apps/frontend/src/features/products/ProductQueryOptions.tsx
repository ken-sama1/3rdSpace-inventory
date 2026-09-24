import SelectCategory from "@/components/shared/SelectCategory";
import SelectNumberRange from "@/components/shared/SelectNumberRange";
import SelectSortOrder from "@/components/shared/SelectSortOrder";
import {
  productSortBy,
  type GetProductsReqQuerySchema,
  type ProductFilterSchema,
  type ProductOptionsSchema,
  type ProductSortBySchema,
} from "@repo/shared";
import { useEffect, useState, type FC } from "react";

interface ProductQueryOptionsProps {
  initialQuery?: GetProductsReqQuerySchema;
  onChange: (value: GetProductsReqQuerySchema) => void;
}

const ProductQueryOptions: FC<ProductQueryOptionsProps> = ({
  onChange,
  initialQuery = {},
}) => {
  const [filter, setFilter] = useState<ProductFilterSchema>(
    initialQuery.filter ?? {}
  );
  const [options, seOptions] = useState<ProductOptionsSchema>(
    initialQuery.options ?? {}
  );

  useEffect(() => {
    if (onChange) onChange({ filter, options });
  }, [filter, options]);

  return (
    <div className="size-full">
      <div className="grid grid-cols-4 gap-y-2">
        <div className="col-span-4 grid items-center grid-cols-5 gap-x-2">
          <div className="col-span-2 divider my-0!"></div>
          <span className="text-(--text-muted)! text-center font-semibold">
            Filter
          </span>
          <div className="col-span-2 divider my-0!"></div>
        </div>

        {/* Category */}
        <div className="col-span-4 grid grid-cols-4 items-center">
          <span className="font-semibold text-(--text-muted)! text-sm col-span-1">
            Category:
          </span>

          <SelectCategory
            type="product"
            initialValue={initialQuery.filter?.categoryId?.[0] ?? null}
            onChange={(v) => {
              setFilter((prev) => {
                return {
                  ...prev,
                  categoryId: v?.id ? [v.id] : undefined,
                };
              });
            }}
          />
        </div>

        {/* Price  */}
        <div className="col-span-4 grid grid-cols-4 items-center">
          <span className="font-semibold text-(--text-muted)! text-sm col-span-1">
            Price
          </span>
          <div className="col-span-3 flex">
            <SelectNumberRange
              initialRange={initialQuery.filter?.price}
              onChange={(value) => {
                setFilter((prev) => {
                  return {
                    ...prev,
                    price: value ?? undefined,
                  };
                });
              }}
            />
          </div>
        </div>

        {/* Sort Section */}
        <div className="col-span-4 grid items-center grid-cols-5 gap-x-2">
          <div className="col-span-2 divider my-0!"></div>
          <span className="text-(--text-muted)! text-center font-semibold">
            Sort
          </span>
          <div className="col-span-2 divider my-0!"></div>
        </div>

        {/* Sort By */}
        <div className="col-span-4 grid grid-cols-4 items-center">
          <span className="font-semibold text-(--text-muted)! text-sm col-span-1">
            Sort By:
          </span>

          <div className="col-span-3 flex">
            <select
              value={options.sortBy}
              onChange={(e) => {
                seOptions((prev) => {
                  return {
                    ...prev,
                    sortBy: e.target.value as ProductSortBySchema,
                  };
                });
              }}
              className="py-1! text-center!"
            >
              {productSortBy.map((field) => {
                return (
                  <option key={field} value={field}>
                    {field}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Order */}
        <div className="col-span-4 grid grid-cols-4 items-center">
          <span className="font-semibold text-(--text-muted)! text-sm col-span-1">
            Order:
          </span>

          <div className="col-span-3 flex">
            <SelectSortOrder
              initialOrder={options.order}
              onChange={(v) => {
                seOptions((prev) => {
                  return {
                    ...prev,
                    order: v,
                  };
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQueryOptions;
