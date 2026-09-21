import { productsApi } from "@/api/products.api";
import type { GetProductsResult, ProductFilterSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "../types/QueryOptions";

interface UseGetProductsProps {
  query?: { filter?: ProductFilterSchema };
  options?: QueryOptions<GetProductsResult>;
}

export const useGetProducts = ({
  query,
  options,
}: UseGetProductsProps = {}) => {
  return useQuery({
    queryKey: ["products", query?.filter],
    queryFn: ({ signal }) => productsApi.getMany(query?.filter, { signal }),
    ...options,
  });
};
