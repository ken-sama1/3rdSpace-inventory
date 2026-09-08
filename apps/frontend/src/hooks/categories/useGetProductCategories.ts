import { productCategoriesApi } from "@/api/product-categories.api";
import type { GetProductCategoriesResult } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

export const useGetProductCategories = () => {
  return useQuery<GetProductCategoriesResult>({
    queryKey: ["categories", "products"],
    queryFn: async ({ signal }) =>
      await productCategoriesApi.getMany({}, { signal }),
  });
};
