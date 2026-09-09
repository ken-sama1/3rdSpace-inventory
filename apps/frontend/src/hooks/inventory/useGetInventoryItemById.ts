import { inventoryItemApi } from "@/api/inventory-items.api";
import type { GetInventoryItemByIdResult, IdSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

export interface UseGetInventoryItemProps {
  itemId: IdSchema;
}

export const useGetInventoryItemById = ({
  itemId,
}: UseGetInventoryItemProps) => {
  return useQuery<GetInventoryItemByIdResult>({
    queryKey: ["inventory-item", itemId],
    queryFn: ({ signal }) => inventoryItemApi.getById(itemId, { signal }),
  });
};
