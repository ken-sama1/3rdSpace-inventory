import { productCategories } from "@/api/product-categories";
import type { IdSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

interface UseGetProductByIdProps {
  categoryId: IdSchema;
}

const useGetProductCategoryById = ({ categoryId }: UseGetProductByIdProps) => {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["categories", "products"],
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

export default useGetProductCategoryById;
