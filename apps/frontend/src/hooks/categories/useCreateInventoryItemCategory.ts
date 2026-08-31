import { inventoryItemCategories } from "@/api/inventory-item-categories";
import type {
  CreateInventoryItemCategoryInput,
  CreateInventoryItemCategoryResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateInventoryItemCategory = () => {
  const queryClient = useQueryClient();

  const { data, mutateAsync, isError, error, isPending } = useMutation<
    CreateInventoryItemCategoryResult,
    Error,
    CreateInventoryItemCategoryInput
  >({
    mutationKey: ["categories", "inventory-items", "create"],
    mutationFn: inventoryItemCategories.create,
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
    create: mutateAsync,
    isError,
    error,
    isPending,
  };
};

export default useCreateInventoryItemCategory;
