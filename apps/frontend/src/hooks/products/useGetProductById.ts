import { productsApi } from "@/api/products.api";
import type { GetProductByIdResult, IdSchema } from "@repo/shared";
import { useQuery, type QueryOptions } from "@tanstack/react-query";

interface UseGetProductByIdProps {
  productId: IdSchema;
  options?: QueryOptions<GetProductByIdResult>;
}

export const useGetProductById = ({
  productId,
  options,
}: UseGetProductByIdProps) => {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: ({ signal }) => productsApi.getById(productId, { signal }),
    ...options,
  });
};
