import { inventoryItemCategories } from "@/api/inventory-item-categories";
import type { DeleteInventoryItemCategoryResult, IdSchema } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteInventoryItemCategory = () => {
  const queryClient = useQueryClient();

  const { data, mutateAsync, isError, error, isPending } = useMutation<
    DeleteInventoryItemCategoryResult,
    Error,
    IdSchema
  >({
    mutationKey: ["categories", "inventory-items", "delete"],
    mutationFn: inventoryItemCategories.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (q) => {
          const [resource, type] = q.queryKey;

          return (
            resource === "inventory-items" ||
            (resource === "categories" && type === "inventory-items")
          );
        },
      });
    },
  });

  return {
    data,
    delete: mutateAsync,
    isError,
    error,
    isPending,
  };
};
