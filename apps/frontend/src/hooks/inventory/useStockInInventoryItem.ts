import { inventoryItemApi } from "@/api/inventory-items.api";
import type {
  IdParam,
  StockInInventoryItemInput,
  StockInInventoryItemResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useStockInInventoryItem = () => {
  const queryClient = useQueryClient();
  const { data, mutateAsync, isError, error, isPending } = useMutation<
    StockInInventoryItemResult,
    Error,
    IdParam & {
      data: StockInInventoryItemInput;
    }
  >({
    mutationKey: ["inventory-items", "stock-in"],
    mutationFn: async ({ id, data }) =>
      await inventoryItemApi.stockIn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory-items"],
      });
    },
  });

  return {
    data,
    stockIn: mutateAsync,
    isError,
    error,
    isPending,
  };
};

export default useStockInInventoryItem;
