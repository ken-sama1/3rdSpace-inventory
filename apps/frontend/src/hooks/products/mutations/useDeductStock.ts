import { productsApi } from "@/api/products.api";
import type {
  DeductStockInput,
  DeductStockResult,
  IdParamSchema,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeductStock = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deduct, ...rest } = useMutation<
    DeductStockResult,
    Error,
    { data: DeductStockInput } & IdParamSchema
  >({
    mutationKey: ["products", "deduct-stock-for-product"],
    mutationFn: async ({ id, data }) => productsApi.deductStock(id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;

          return (
            key[0] === "products" ||
            key[0] === "inventory-items" ||
            key[0] === "reports"
          );
        },
      });
    },
  });

  return {
    deduct,
    ...rest,
  };
};
