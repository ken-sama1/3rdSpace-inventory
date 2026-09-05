import { inventoryItemApi } from "@/api/inventory-items.api";
import {
  type StockOutInventoryItemResult,
  type IdParam,
  type StockOutInventoryItemInput,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStockOutInventoryItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, data, error, isPending, isError } = useMutation<
    StockOutInventoryItemResult,
    Error,
    IdParam & { data: StockOutInventoryItemInput }
  >({
    mutationKey: ["inventory-items", "stock-out"],
    mutationFn: async ({ id, data }) => {
      return await inventoryItemApi.stockOut(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory-items"],
      });
    },
  });
  return {
    stockOut: mutateAsync,
    data,
    error,
    isPending,
    isError,
  };
};
