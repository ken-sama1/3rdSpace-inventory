import { inventoryItemsApi } from "@/api/inventory-items.api";
import type {
  GetInventoryItemsReqQuerySchema,
  GetInventoryItemsResult,
} from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "../types/QueryOptions";

interface UseGetInventoryItemsParams {
  query?: GetInventoryItemsReqQuerySchema;
  options?: QueryOptions<GetInventoryItemsResult>;
}

export const useGetInventoryItems = ({
  query = {},
  options,
}: UseGetInventoryItemsParams = {}) => {
  return useQuery<GetInventoryItemsResult>({
    queryKey: ["inventory-items", query.options, query.filter],
    queryFn: ({ signal }) =>
      inventoryItemsApi.getMany(
        { filter: query.filter, options: query.options },
        { signal }
      ),
    ...options,
  });
};
