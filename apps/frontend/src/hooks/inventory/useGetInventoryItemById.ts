import { inventoryItemApi } from "@/api/inventory-items.api";
import type { GetInventoryItemByIdResult, IdSchema } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

export interface UseGetInventoryItemProps {
  itemId: IdSchema;
}

const useGetInventoryItemById = ({ itemId }: UseGetInventoryItemProps) => {
  const { data, isLoading, isError, error } =
    useQuery<GetInventoryItemByIdResult>({
      queryKey: ["inventory-item", itemId],
      queryFn: ({ signal }) => inventoryItemApi.getById(itemId, { signal }),
    });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};

export default useGetInventoryItemById;
