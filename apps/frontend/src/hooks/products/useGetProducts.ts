import { productsApi } from "@/api/products.api";
import type { ProductFilterSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

export const useGetProducts = (filter: ProductFilterSchema = {}) => {
  return useQuery({
    queryKey: ["products", filter],
    queryFn: ({ signal }) => productsApi.getMany(filter, { signal }),
  });
};
