import { productsApi } from "@/api/products.api";
import type {
  DeductStockForProductInput,
  DeductStockForProductResult,
  IdParam,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeductStockForProduct = () => {
  const queryClient = useQueryClient();

  const { data, mutateAsync, error, isError, isPending } = useMutation<
    DeductStockForProductResult,
    Error,
    DeductStockForProductInput & IdParam
  >({
    mutationKey: ["products", "deduct-stock-for-product"],
    mutationFn: async ({ id, quantity }) =>
      productsApi.deductStockForProduct(id, { quantity }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;

          return key[0] === "products" || key[0] === "inventory-items";
        },
      });
    },
  });

  return {
    data,
    deduct: mutateAsync,
    error,
    isError,
    isPending,
  };
};
