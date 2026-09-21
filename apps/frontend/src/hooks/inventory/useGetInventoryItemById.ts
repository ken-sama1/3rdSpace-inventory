import { inventoryItemApi } from "@/api/inventory-items.api";
import type { GetInventoryItemByIdResult, IdSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "../types/QueryOptions";

export interface UseGetInventoryItemProps {
  itemId: IdSchema;
  options?: QueryOptions<GetInventoryItemByIdResult>;
}

export const useGetInventoryItemById = ({
  itemId,
  options,
}: UseGetInventoryItemProps) => {
  return useQuery<GetInventoryItemByIdResult>({
    queryKey: ["inventory-item", itemId],
    queryFn: ({ signal }) => inventoryItemApi.getById(itemId, { signal }),
    ...options,
  });
};
