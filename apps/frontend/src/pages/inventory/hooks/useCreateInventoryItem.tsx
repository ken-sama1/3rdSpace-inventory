import { inventoryItemApi } from "@/api/inventory-items.api";
import type {
  CreateInventoryItemInput,
  CreateInventoryItemResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateInventoryItem = () => {
  const quieryClient = useQueryClient();

  const { data, isPending, isError, mutateAsync, isSuccess } = useMutation<
    CreateInventoryItemResult,
    Error,
    CreateInventoryItemInput
  >({
    mutationKey: ["inventory-items", "create"],
    mutationFn: inventoryItemApi.create,
    onSuccess: () => {
      quieryClient.invalidateQueries({
        queryKey: ["inventory-items"],
      });
    },
  });

  return {
    data,
    isPending,
    isError,
    isSuccess,
    create: mutateAsync,
  };
};

export default useCreateInventoryItem;
