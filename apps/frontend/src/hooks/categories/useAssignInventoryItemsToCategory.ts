import { inventoryItemCategoriesApi } from "@/api/inventory-item-categories.api";
import type {
  AssignInventoryItemsToCategoryInput,
  AssignInventoryItemsToCategoryResult,
  IdParamSchema,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAssignInventoryItemsToCategory = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: assignItems, ...rest } = useMutation<
    AssignInventoryItemsToCategoryResult,
    Error,
    IdParamSchema & { data: AssignInventoryItemsToCategoryInput }
  >({
    mutationKey: ["categories", "inventory-items", "assign"],
    mutationFn: ({ id, data }) =>
      inventoryItemCategoriesApi.assignItems(id, data),
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
    assignItems,
    ...rest,
  };
};
