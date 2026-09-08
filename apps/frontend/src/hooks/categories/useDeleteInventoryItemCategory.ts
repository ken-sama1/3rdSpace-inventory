import { inventoryItemCategoriesApi } from "@/api/inventory-item-categories.api";
import type { DeleteInventoryItemCategoryResult, IdSchema } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteInventoryItemCategory = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, ...rest } = useMutation<
    DeleteInventoryItemCategoryResult,
    Error,
    IdSchema
  >({
    mutationKey: ["categories", "inventory-items", "delete"],
    mutationFn: inventoryItemCategoriesApi.delete,
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
    delete: mutateAsync,
    ...rest,
  };
};
