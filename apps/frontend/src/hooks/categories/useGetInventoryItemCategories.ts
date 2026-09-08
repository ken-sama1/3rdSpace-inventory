import { inventoryItemCategoriesApi } from "@/api/inventory-item-categories.api";
import type { GetInventoryItemCategoriesResult } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

export const useGetInventoryItemCategories = () => {
  return useQuery<GetInventoryItemCategoriesResult>({
    queryKey: ["categories", "inventory-items"],
    queryFn: async ({ signal }) =>
      await inventoryItemCategoriesApi.getMany({}, { signal }),
  });
};
