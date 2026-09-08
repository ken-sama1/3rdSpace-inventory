import { inventoryItemCategoriesApi } from "@/api/inventory-item-categories.api";
import type {
  CreateInventoryItemCategoryInput,
  CreateInventoryItemCategoryResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateInventoryItemCategory = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: create, ...rest } = useMutation<
    CreateInventoryItemCategoryResult,
    Error,
    CreateInventoryItemCategoryInput
  >({
    mutationKey: ["categories", "inventory-items", "create"],
    mutationFn: inventoryItemCategoriesApi.create,
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
    create,
    ...rest,
  };
};
