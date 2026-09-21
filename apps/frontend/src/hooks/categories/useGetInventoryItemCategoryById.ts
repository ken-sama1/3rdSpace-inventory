import { inventoryItemCategoriesApi } from "@/api/inventory-item-categories.api";
import type {
  GetInventoryItemCategoryByIdResult,
  IdSchema,
} from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "../types/QueryOptions";

interface UseGetInventoryItemByIdProps {
  categoryId: IdSchema;
  options?: QueryOptions<GetInventoryItemCategoryByIdResult>;
}

export const useGetInventoryItemCategoryById = ({
  categoryId,
  options,
}: UseGetInventoryItemByIdProps) => {
  return useQuery({
    queryKey: ["categories", "inventory-items", categoryId],
    queryFn: async ({ signal }) =>
      inventoryItemCategoriesApi.getById(categoryId, { signal }),
    ...options,
  });
};
