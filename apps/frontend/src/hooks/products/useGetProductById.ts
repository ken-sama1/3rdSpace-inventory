import { productsApi } from "@/api/products.api";
import type { IdSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

interface UseGetProductByIdProps {
  productId: IdSchema;
}

const useGetProductById = ({ productId }: UseGetProductByIdProps) => {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["products", productId],
    queryFn: ({ signal }) => productsApi.getById(productId, { signal }),
  });

  return {
    data,
    isError,
    isLoading,
    error,
  };
};

export default useGetProductById;
