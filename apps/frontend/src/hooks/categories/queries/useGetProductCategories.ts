import { productCategoriesApi } from "@/api/product-categories.api";
import type {
  GetProductCategoriesReqQueryInput,
  GetProductCategoriesResult,
} from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "@/hooks/types/QueryOptions";

interface UseGetProductCategoriesParams {
  options?: QueryOptions<GetProductCategoriesResult>;
  query?: GetProductCategoriesReqQueryInput;
}
export const useGetProductCategories = ({
  options,
  query,
}: UseGetProductCategoriesParams = {}) => {
  return useQuery<GetProductCategoriesResult>({
    queryKey: ["categories", "products", query],
    queryFn: ({ signal }) => productCategoriesApi.getMany(query, { signal }),
    ...options,
  });
};
