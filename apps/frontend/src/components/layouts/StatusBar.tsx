import { inventoryItemApi } from "@/api/inventory-items.api";
import type { GetInventoryItemsResult } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, /* Banknote,*/ Boxes, PackageX } from "lucide-react";
import { useMemo } from "react";

const StatusBar = () => {
  const { data, isLoading } = useQuery<GetInventoryItemsResult>({
    queryKey: ["inventory-items"],
    queryFn: ({ signal }) =>
      inventoryItemApi.getAll(
        {},
        {
          signal,
        }
      ),
  });

  const { lowStockCount, noStockCount } = useMemo(() => {
    if (!data?.length && !isLoading) return {};
    const lowStock = data?.filter((d) => d.quantity <= 1000 && d.quantity >= 1);
    const noStock = data?.filter((d) => d.quantity <= 0);

    return {
      lowStockCount: lowStock?.length ?? 0,
      noStockCount: noStock?.length ?? 0,
    };
  }, [data?.length, isLoading]);

  return (
    // Footer Container
    <footer
      className="
      w-full border-(--line) border-t
      h-12 z-10 fixed bottom-0 shadow-[0_-2px_8px_0] shadow-black/10"
    >
      {/* Wrapper */}
      <div className="size-full bg-(--primary) flex justify-between items-center px-5">
        {/* Left Side Section */}
        <div className="h-6 flex justify-center items-center">
          {/* Total Items */}
          <div className="h-full w-auto flex items-center justify-center gap-1">
            <Boxes className="stroke-1 h-full" />
            <span className="text-xs! flex items-center">Total Items:</span>
            <strong className="text-xs! font-bold">
              {data?.length ?? "loading..."}
            </strong>
          </div>
          {/* Total Items End */}
        </div>
        {/* Left Side Section End */}

        {/* Right Side Section */}
        <div className="h-6 flex justify-center items-center gap-1.5">
          {/* Low Stock */}
          <div
            className="
            w-auto h-full flex items-center justify-center gap-1.5 px-1.5 py-0.5 rounded-md
            border status-warning stroke-(--text-warning)"
          >
            <AlertTriangle className="stroke-2 stroke-inherit! h-full" />
            <span className="text-xs! text-inherit! flex items-center">
              Low Stock:
            </span>
            <strong className="text-xs! font-bold text-inherit!">
              {lowStockCount ?? "loading..."}
            </strong>
          </div>
          {/* Low Stock End */}

          {/* Out of Stock */}
          <div
            className="
            w-auto h-full flex items-center justify-center gap-1.5 px-1.5 py-0.5 rounded-md
            border status-danger stroke-(--text-danger)"
          >
            <PackageX className="stroke-2 stroke-inherit! h-full" />
            <span className="text-xs! text-inherit! flex items-center">
              Out of Stock:
            </span>
            <strong className="text-xs! font-bold text-inherit!">
              {noStockCount ?? "loading..."}
            </strong>
          </div>
          {/* Out of Stock End */}

          {/* Total Valuation */}
          {/* <div */}
          {/*   className=" */}
          {/*   w-auto h-full flex items-center justify-center gap-1.5 px-1.5 py-0.5 rounded-md */}
          {/*   border border-(--line-success) bg-(--bg-success) stroke-(--text-success) text-(--text-heathy)!" */}
          {/* > */}
          {/*   <Banknote className="stroke-2 stroke-inherit! size-4.5" /> */}
          {/*   <span className="text-xs! text-inherit!">Revenue:</span> */}
          {/*   <strong className="text-xs! font-bold text-inherit!">6700</strong> */}
          {/* </div> */}
          {/* Total Valuation End*/}
        </div>
        {/* Right Side Section End  */}
      </div>
      {/* Wrapper End */}
    </footer>
    // Footer End
  );
};

export default StatusBar;
