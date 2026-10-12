import { productsApi } from "@/api/products.api";
import type { GetProductByIdResult, IdSchema } from "@repo/shared";
import { useQuery, type QueryOptions } from "@tanstack/react-query";

interface UseGetProductByIdParams {
  productId: IdSchema;
  options?: QueryOptions<GetProductByIdResult>;
}

export const useGetProductById = ({
  productId,
  options,
}: UseGetProductByIdParams) => {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: ({ signal }) => productsApi.getById(productId, { signal }),
    ...options,
  });
};
