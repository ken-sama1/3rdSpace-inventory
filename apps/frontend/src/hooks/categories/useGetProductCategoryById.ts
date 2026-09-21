import { productCategoriesApi } from "@/api/product-categories.api";
import type { GetProductCategoryByIdResult, IdSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "../types/QueryOptions";

interface UseGetProductCategoryByIdProps {
  categoryId: IdSchema;
  options?: QueryOptions<GetProductCategoryByIdResult>;
}

export const useGetProductCategoryById = ({
  categoryId,
  options,
}: UseGetProductCategoryByIdProps) => {
  return useQuery<GetProductCategoryByIdResult>({
    queryKey: ["categories", "products", categoryId],
    queryFn: ({ signal }) =>
      productCategoriesApi.getById(categoryId, { signal }),
    ...options,
  });
};
