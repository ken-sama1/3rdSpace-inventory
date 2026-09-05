import { productCategories } from "@/api/product-categories";
import type { IdSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

interface UseGetProductByIdProps {
  categoryId: IdSchema;
}

export const useGetProductCategoryById = ({
  categoryId,
}: UseGetProductByIdProps) => {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["categories", "products", categoryId],
    queryFn: async ({ signal }) =>
      productCategories.getById(categoryId, { signal }),
  });

  return {
    data,
    isError,
    error,
    isLoading,
  };
};
