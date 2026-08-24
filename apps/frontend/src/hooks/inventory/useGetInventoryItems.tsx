import { inventoryItemApi } from "@/api/inventory-items.api";
import type {
  GetInventoryItemsResult,
  InventoryItemFilterSchema,
} from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

const useGetInventoryItems = (filter: InventoryItemFilterSchema = {}) => {
  const { data, isLoading, isError, error } = useQuery<GetInventoryItemsResult>(
    {
      queryKey: ["inventory-items", filter],
      queryFn: ({ signal }) => inventoryItemApi.getAll(filter, { signal }),
    }
  );

  return {
    data,
    isLoading,
    isError,
    error,
  };
};

export default useGetInventoryItems;
