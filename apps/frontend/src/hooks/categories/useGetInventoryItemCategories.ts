import { inventoryItemCategoriesApi } from "@/api/inventory-item-categories.api";
import type {
  GetInventoryItemCategoriesReqQueryInput,
  GetInventoryItemCategoriesResult,
} from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "../types/QueryOptions";

interface UseGetInventoryItemCategoriesProps {
  options?: QueryOptions<GetInventoryItemCategoriesResult>;
  query?: GetInventoryItemCategoriesReqQueryInput;
}

export const useGetInventoryItemCategories = ({
  options,
  query,
}: UseGetInventoryItemCategoriesProps = {}) => {
  return useQuery<GetInventoryItemCategoriesResult>({
    queryKey: ["categories", "inventory-items", query],
    queryFn: ({ signal }) =>
      inventoryItemCategoriesApi.getMany(query, { signal }),
    ...options,
  });
};
