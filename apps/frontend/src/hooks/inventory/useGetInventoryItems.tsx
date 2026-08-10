import { inventoryItemApi } from "@/api/inventory-items.api";
import type { GetInventoryItemsResult } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

const useGetInventoryItems = () => {
  const { data, isLoading, isError, error } = useQuery<GetInventoryItemsResult>(
    {
      queryKey: ["inventory-items"],
      queryFn: ({ signal }) => inventoryItemApi.getAll({}, { signal }),
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
