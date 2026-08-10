import { inventoryItemApi } from "@/api/inventory-items.api";
import type { GetInventoryItemResult } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

export interface UseGetInventoryItemProps {
  itemId: string;
}

const useGetInventoryItem = ({ itemId }: UseGetInventoryItemProps) => {
  const { data, isLoading, isError, error } = useQuery<GetInventoryItemResult>({
    queryKey: ["inventory-item", itemId],
    queryFn: ({ signal }) => inventoryItemApi.get(itemId, { signal }),
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};

export default useGetInventoryItem;
