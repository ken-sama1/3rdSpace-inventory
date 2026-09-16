import { inventoryItemCategoriesApi } from "@/api/inventory-item-categories.api";
import type {
  IdParamSchema,
  UnassignInventoryItemsFromCategoryInput,
  UnassignInventoryItemsFromCategoryResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUnassignInventoryItemsFromCategory = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: unassignItems, ...rest } = useMutation<
    UnassignInventoryItemsFromCategoryResult,
    Error,
    IdParamSchema & {
      data: UnassignInventoryItemsFromCategoryInput;
    }
  >({
    mutationKey: ["categories", "inventory-items", "unassign"],
    mutationFn: ({ id, data }) =>
      inventoryItemCategoriesApi.unassignItems(id, data),
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
    unassignItems,
    ...rest,
  };
};
