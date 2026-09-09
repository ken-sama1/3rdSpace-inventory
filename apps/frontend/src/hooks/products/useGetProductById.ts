import { productsApi } from "@/api/products.api";
import type { IdSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

interface UseGetProductByIdProps {
  productId: IdSchema;
}

export const useGetProductById = ({ productId }: UseGetProductByIdProps) => {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: ({ signal }) => productsApi.getById(productId, { signal }),
  });
};
