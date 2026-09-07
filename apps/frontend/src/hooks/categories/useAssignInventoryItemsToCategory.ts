import { inventoryItemCategories } from "@/api/inventory-item-categories";
import type {
  AssignInventoryItemsToCategoryInput,
  AssignInventoryItemsToCategoryResult,
  IdParam,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAssignInventoryItemsToCategory = () => {
  const queryClient = useQueryClient();

  const {
    data,
    mutateAsync: assignItems,
    isError,
    error,
    isPending,
  } = useMutation<
    AssignInventoryItemsToCategoryResult,
    Error,
    IdParam & { data: AssignInventoryItemsToCategoryInput }
  >({
    mutationKey: ["categories", "inventory-items", "assign"],
    mutationFn: ({ id, data }) => inventoryItemCategories.assignItems(id, data),
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
    assignItems,
    isError,
    error,
    isPending,
  };
};
