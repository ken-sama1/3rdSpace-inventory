import { inventoryItemApi } from "@/api/inventory-items.api";
import type {
  UpdateInventoryItemInput,
  UpdateInventoryResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, data, isError, isSuccess, isPending } = useMutation<
    UpdateInventoryResult,
    Error,
    {
      data: UpdateInventoryItemInput;
      id: string;
    }
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
    update: mutateAsync,
    data,
    isError,
    isSuccess,
    isPending,
  };
};

export default useUpdateInventoryItem;
