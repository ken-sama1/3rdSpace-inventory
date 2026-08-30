import { productCategories } from "@/api/product-categories";
import type { GetProductCategoriesResult } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

const useGetProductCategories = () => {
  const { data, isError, error, isLoading } =
    useQuery<GetProductCategoriesResult>({
      queryKey: ["categories", "products"],
      queryFn: async ({ signal }) =>
        await productCategories.getMany({}, { signal }),
    });

  return {
    data,
    isError,
    error,
    isLoading,
  };
};

export default useGetProductCategories;
