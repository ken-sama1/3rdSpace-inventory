import { inventoryItemsApi } from "@/api/inventory-items.api";
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
      await inventoryItemsApi.stockIn(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (q) => {
          const [resource] = q.queryKey;

          return resource === "inventory-items";
        },
      });
    },
  });

  return {
    stockIn,
    ...rest,
  };
};
