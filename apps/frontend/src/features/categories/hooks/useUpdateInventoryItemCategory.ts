import { inventoryItemCategoriesApi } from "@/api/inventory-item-categories.api";
import type {
  IdParamSchema,
  UpdateInventoryItemCategoryInput,
  UpdateInventoryItemCategoryResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateInventoryItemCategory = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: update, ...rest } = useMutation<
    UpdateInventoryItemCategoryResult,
    Error,
    IdParamSchema & {
      data: UpdateInventoryItemCategoryInput;
    }
  >({
    mutationKey: ["categories", "inventory-items", "update"],
    mutationFn: async ({ id, data }) =>
      await inventoryItemCategoriesApi.update(id, data),
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
    update,
    ...rest,
  };
};
