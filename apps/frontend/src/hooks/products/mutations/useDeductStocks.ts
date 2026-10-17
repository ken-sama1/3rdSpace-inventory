import { productsApi } from "@/api/products.api";
import type { DeductStocksInput, DeductStocksResult } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeductStocks = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deductStocks, ...rest } = useMutation<
    DeductStocksResult,
    Error,
    DeductStocksInput
  >({
    mutationKey: ["products", "deduct-stocks"],
    mutationFn: productsApi.deductStocks,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) =>
          ["products", "inventory-items", "reports", "transactions"].includes(
            String(query.queryKey[0])
          ),
      });
    },
  });

  return {
    deductStocks,
    ...rest,
  };
};
