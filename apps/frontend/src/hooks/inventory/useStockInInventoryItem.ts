import { inventoryItemApi } from "@/api/inventory-items.api";
import type {
  IdParamSchema,
  StockInInventoryItemInput,
  StockInInventoryItemResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStockInInventoryItem = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: stockIn, ...rest } = useMutation<
    StockInInventoryItemResult,
    Error,
    IdParamSchema & {
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
    stockIn,
    ...rest,
  };
};
