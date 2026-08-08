import { getInventoryItems } from "@/api/inventory-items.api";
import Table from "@/components/ui/Table";
import type { GetInventoryItemsResult } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import { base } from "motion/react-client";
import type { CSSProperties } from "react";

const ItemsTable = () => {
  const { data, isLoading, isError } = useQuery<GetInventoryItemsResult>({
    queryKey: ["inventory-items"],
    queryFn: ({ signal }) => getInventoryItems({}, { signal }),
  });

  console.log(data);
  return (
    <div className="h-full">
      {!isLoading && data && (
        <Table
          className="border"
          data={data}
          options={{
            cell: {
              style: {
                justifyContent: "start",
              },
            },
            row: {
              onClick: (item) => {
                console.log(item.itemId);
              },
              style: (rowData): CSSProperties => {
                const lowStock = rowData.quantity <= 1000;
                const noStock = rowData.quantity <= 0;

                const baseStyle: CSSProperties = {
                  cursor: "pointer",
                  paddingLeft: "10px",
                  borderLeft: "6px solid",
                  borderRadius: "4px 0 0 4px",
                };

                if (noStock) {
                  return {
                    ...baseStyle,
                    borderLeftColor: "var(--color-red-500)",
                  };
                }

                if (lowStock) {
                  return {
                    ...baseStyle,
                    borderLeftColor: "var(--color-amber-500)",
                  };
                }

                return {
                  ...baseStyle,
                  borderLeftColor: "var(--color-emerald-500)",
                };
              },
            },
            columns: 7,
            column: {
              name: {
                index: 0,
                colspan: 3,
              },
              quantity: {
                index: 1,
                colspan: 2,
              },
              unit: {
                index: 2,
                colspan: 2,
                style: {
                  textTransform: "lowercase",
                },
              },
            },
            exlude: ["itemId", "description", "imageUrl"],
          }}
        />
      )}
    </div>
  );
};

export default ItemsTable;
