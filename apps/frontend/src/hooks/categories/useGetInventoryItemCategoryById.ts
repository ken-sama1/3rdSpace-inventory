import { inventoryItemCategories } from "@/api/inventory-item-categories";
import type { IdSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

interface UseGetInventoryItemByIdProps {
  categoryId: IdSchema;
}

export const useGetInventoryItemCategoryById = ({
  categoryId,
}: UseGetInventoryItemByIdProps) => {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["categories", "inventory-items", categoryId],
    queryFn: async ({ signal }) =>
      inventoryItemCategories.getById(categoryId, { signal }),
  });

  return {
    data,
    isError,
    error,
    isLoading,
  };
};
