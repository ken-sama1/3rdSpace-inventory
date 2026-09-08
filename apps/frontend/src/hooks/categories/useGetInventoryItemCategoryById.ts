import { inventoryItemCategoriesApi } from "@/api/inventory-item-categories.api";
import type { IdSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

interface UseGetInventoryItemByIdProps {
  categoryId: IdSchema;
}

export const useGetInventoryItemCategoryById = ({
  categoryId,
}: UseGetInventoryItemByIdProps) => {
  return useQuery({
    queryKey: ["categories", "inventory-items", categoryId],
    queryFn: async ({ signal }) =>
      inventoryItemCategoriesApi.getById(categoryId, { signal }),
  });
};
