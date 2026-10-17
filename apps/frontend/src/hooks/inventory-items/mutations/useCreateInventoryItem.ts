import { inventoryItemsApi } from "@/api/inventory-items.api";
import type {
  CreateInventoryItemInput,
  CreateInventoryItemResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: create, ...rest } = useMutation<
    CreateInventoryItemResult,
    Error,
    CreateInventoryItemInput
  >({
    mutationKey: ["inventory-items", "create"],
    mutationFn: inventoryItemsApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["inventory-items"],
      });
    },
  });

  return {
    create,
    ...rest,
  };
};
