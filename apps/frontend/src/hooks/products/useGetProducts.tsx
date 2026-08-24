import { productsApi } from "@/api/products.api";
import type { ProductFilterSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

const useGetProducts = (filter: ProductFilterSchema = {}) => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["products", filter],
    queryFn: ({ signal }) => productsApi.getAll(filter, { signal }),
  });

  return {
    isError,
    isLoading,
    data,
    error,
  };
};

export default useGetProducts;
