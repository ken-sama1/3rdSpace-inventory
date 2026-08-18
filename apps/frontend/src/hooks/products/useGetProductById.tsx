import { productsApi } from "@/api/products.api";
import { useQuery } from "@tanstack/react-query";

const useGetProductById = (productId: string) => {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["products", productId],
    queryFn: ({ signal }) => productsApi.get(productId, { signal }),
  });

  return {
    data,
    isError,
    isLoading,
    error,
  };
};

export default useGetProductById;
