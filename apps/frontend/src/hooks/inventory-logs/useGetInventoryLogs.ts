import type {
  GetInventoryLogsReqQueryInput,
  GetInventoryLogsResult,
} from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "../types/QueryOptions";
import { inventoryLogsApi } from "@/api/inventory-logs.api";

interface UseGetInventoryLogsParams {
  query?: GetInventoryLogsReqQueryInput;
  options?: QueryOptions<GetInventoryLogsResult>;
}

export const useGetInventoryLogs = ({
  options = {},
  query = {},
}: UseGetInventoryLogsParams) => {
  return useQuery({
    queryKey: ["inventory-logs", query.filter, query.options],
    queryFn: () => inventoryLogsApi.getMany(query),
    ...options,
  });
};
