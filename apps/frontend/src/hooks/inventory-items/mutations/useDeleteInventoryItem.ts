import { inventoryItemsApi } from "@/api/inventory-items.api";
import type { DeleteInventoryResult, IdSchema } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, ...rest } = useMutation<
    DeleteInventoryResult,
    Error,
    IdSchema
  >({
    mutationFn: inventoryItemsApi.delete,
    mutationKey: ["inventory-items", "delete"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["inventory-items"],
      });
    },
  });

  return {
    delete: mutateAsync,
    ...rest,
  };
};
