import { inventoryItemCategories } from "@/api/inventory-item-categories";
import type {
  IdParam,
  UpdateInventoryItemCategoryInput,
  UpdateInventoryItemCategoryResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateInventoryItemCategory = () => {
  const queryClient = useQueryClient();

  const { data, mutateAsync, isError, error, isPending } = useMutation<
    UpdateInventoryItemCategoryResult,
    Error,
    IdParam & {
      data: UpdateInventoryItemCategoryInput;
    }
  >({
    mutationKey: ["categories", "inventory-items", "update"],
    mutationFn: async ({ id, data }) =>
      await inventoryItemCategories.update(id, data),
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
    update: mutateAsync,
    isError,
    error,
    isPending,
  };
};

export default useUpdateInventoryItemCategory;
