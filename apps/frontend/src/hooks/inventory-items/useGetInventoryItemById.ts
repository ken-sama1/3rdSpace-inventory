import { inventoryItemsApi } from "@/api/inventory-items.api";
import type { GetInventoryItemByIdResult, IdSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "../types/QueryOptions";

interface UseGetInventoryItemParams {
  itemId: IdSchema;
  options?: QueryOptions<GetInventoryItemByIdResult>;
}

export const useGetInventoryItemById = ({
  itemId,
  options,
}: UseGetInventoryItemParams) => {
  return useQuery<GetInventoryItemByIdResult>({
    queryKey: ["inventory-items", itemId],
    queryFn: ({ signal }) => inventoryItemsApi.getById(itemId, { signal }),
    ...options,
  });
};
