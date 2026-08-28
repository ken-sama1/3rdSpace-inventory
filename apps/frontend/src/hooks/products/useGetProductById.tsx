import { productsApi } from "@/api/products.api";
import type { ObjectIdSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

interface UseGetProductByIdProps {
  productId: ObjectIdSchema;
}

const useGetProductById = ({ productId }: UseGetProductByIdProps) => {
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
