import { productCategoriesApi } from "@/api/product-categories.api";
import type { GetProductCategoriesResult } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "../types/QueryOptions";

interface UseGetProductCategoriesProps {
  options?: QueryOptions<GetProductCategoriesResult>;
}
export const useGetProductCategories = ({
  options,
}: UseGetProductCategoriesProps = {}) => {
  return useQuery<GetProductCategoriesResult>({
    queryKey: ["categories", "products"],
    queryFn: ({ signal }) => productCategoriesApi.getMany({}, { signal }),
    ...options,
  });
};
