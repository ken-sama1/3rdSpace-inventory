import { productsApi } from "@/api/products.api";
import type { GetProductsReqQueryInput, GetProductsResult } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "../types/QueryOptions";

interface UseGetProductsParams {
  query?: GetProductsReqQueryInput;
  options?: QueryOptions<GetProductsResult>;
}

export const useGetProducts = ({
  query,
  options,
}: UseGetProductsParams = {}) => {
  return useQuery({
    queryKey: ["products", query?.filter, query?.options],
    queryFn: ({ signal }) => productsApi.getMany(query, { signal }),
    ...options,
  });
};
