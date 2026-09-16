import { inventoryItemApi } from "@/api/inventory-items.api";
import type {
  IdParamSchema,
  UpdateInventoryItemInput,
  UpdateInventoryResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: update, ...rest } = useMutation<
    UpdateInventoryResult,
    Error,
    {
      data: UpdateInventoryItemInput;
    } & IdParamSchema
  >({
    mutationFn: ({ id, data }) => inventoryItemApi.update(id, data),
    mutationKey: ["inventory-items", "update"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory-items"],
      });
    },
  });

  return {
    update,
    ...rest,
  };
};
