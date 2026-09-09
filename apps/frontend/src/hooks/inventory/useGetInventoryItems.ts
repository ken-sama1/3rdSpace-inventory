import { inventoryItemApi } from "@/api/inventory-items.api";
import type {
  GetInventoryItemsReqQuery,
  GetInventoryItemsResult,
} from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

export const useGetInventoryItems = ({
  filter,
  options,
}: GetInventoryItemsReqQuery = {}) => {
  return useQuery<GetInventoryItemsResult>({
    queryKey: ["inventory-items", filter, options],
    queryFn: ({ signal }) =>
      inventoryItemApi.getMany({ filter, options }, { signal }),
  });
};
