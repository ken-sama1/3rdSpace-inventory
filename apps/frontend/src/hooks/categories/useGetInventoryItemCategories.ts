import { inventoryItemCategories } from "@/api/inventory-item-categories";
import type { GetInventoryItemCategoriesResult } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

export const useGetInventoryItemCategories = () => {
  const { data, isError, error, isLoading } =
    useQuery<GetInventoryItemCategoriesResult>({
      queryKey: ["categories", "inventory-items"],
      queryFn: async ({ signal }) =>
        await inventoryItemCategories.getMany({}, { signal }),
    });
  return {
    data,
    isError,
    error,
    isLoading,
  };
};
