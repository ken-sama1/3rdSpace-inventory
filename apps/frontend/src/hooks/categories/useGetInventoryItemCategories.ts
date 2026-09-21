import { inventoryItemCategoriesApi } from "@/api/inventory-item-categories.api";
import type { GetInventoryItemCategoriesResult } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "../types/QueryOptions";

interface UseGetInventoryItemCategoriesProps {
  options?: QueryOptions<GetInventoryItemCategoriesResult>;
}

export const useGetInventoryItemCategories = ({
  options,
}: UseGetInventoryItemCategoriesProps = {}) => {
  return useQuery<GetInventoryItemCategoriesResult>({
    queryKey: ["categories", "inventory-items"],
    queryFn: ({ signal }) => inventoryItemCategoriesApi.getMany({}, { signal }),
    ...options,
  });
};
