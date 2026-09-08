import { productCategoriesApi } from "@/api/product-categories.api";
import type { IdSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

interface UseGetProductByIdProps {
  categoryId: IdSchema;
}

export const useGetProductCategoryById = ({
  categoryId,
}: UseGetProductByIdProps) => {
  return useQuery({
    queryKey: ["categories", "products", categoryId],
    queryFn: async ({ signal }) =>
      productCategoriesApi.getById(categoryId, { signal }),
  });
};
