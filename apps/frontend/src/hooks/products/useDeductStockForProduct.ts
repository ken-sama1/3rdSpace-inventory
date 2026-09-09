import { productsApi } from "@/api/products.api";
import type {
  DeductStockForProductInput,
  DeductStockForProductResult,
  IdParamSchema,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeductStockForProduct = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deduct, ...rest } = useMutation<
    DeductStockForProductResult,
    Error,
    { data: DeductStockForProductInput } & IdParamSchema
  >({
    mutationKey: ["products", "deduct-stock-for-product"],
    mutationFn: async ({ id, data }) =>
      productsApi.deductStockForProduct(id, data),

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
    deduct,
    ...rest,
  };
};
