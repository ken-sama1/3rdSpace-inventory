import { inventoryItemsApi } from "@/api/inventory-items.api";
import {
  type StockOutInventoryItemResult,
  type IdParamSchema,
  type StockOutInventoryItemInput,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStockOutInventoryItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: stockOut, ...rest } = useMutation<
    StockOutInventoryItemResult,
    Error,
    IdParamSchema & { data: StockOutInventoryItemInput }
  >({
    mutationKey: ["inventory-items", "stock-out"],
    mutationFn: async ({ id, data }) => {
      return await inventoryItemsApi.stockOut(id, data);
    },
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
    stockOut,
    ...rest,
  };
};
