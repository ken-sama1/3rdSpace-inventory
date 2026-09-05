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
  const { data, isLoading, isError, error } = useQuery<GetInventoryItemsResult>(
    {
      queryKey: ["inventory-items", filter, options],
      queryFn: ({ signal }) =>
        inventoryItemApi.getMany({ filter, options }, { signal }),
    }
  );

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
