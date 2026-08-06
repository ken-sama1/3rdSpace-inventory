import { getInventoryItems } from "@/api/inventory-items.api";
import Table from "@/components/ui/Table";
import type { GetInventoryItemsResult } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

const ItemsTable = () => {
  const { data, isLoading, isError } = useQuery<GetInventoryItemsResult>({
    queryKey: ["inventory-items"],
    queryFn: ({ signal }) => getInventoryItems({}, { signal }),
  });

  console.log(data);
  return <div>{!isLoading && data && <Table data={data} />}</div>;
};

export default ItemsTable;
