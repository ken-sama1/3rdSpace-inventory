import { inventoryItemApi } from "@/api/inventory-items.api";
import type { DeleteInventoryResult, IdSchema } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  const { data, mutateAsync, error, isPending, isError, isSuccess } =
    useMutation<DeleteInventoryResult, Error, IdSchema>({
      mutationFn: inventoryItemApi.delete,
      mutationKey: ["inventory-items", "delete"],
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["inventory-items"],
        });
      },
    });

  return {
    data,
    error,
    isSuccess,
    delete: mutateAsync,
    isPending,
    isError,
  };
};
