import { useGetInventoryItems } from "@/hooks/inventory-items/queries/useGetInventoryItems";
import { useStockConfig } from "@/hooks/useStockConfig";
import {
  AlertTriangle,
  /* Banknote,*/ Boxes,
  Check,
  PackageX,
} from "lucide-react";
import { useMemo } from "react";

const StatusBar = () => {
  const { getStatus } = useStockConfig();
  const { data } = useGetInventoryItems();

  const {
    lowStockCount = 0,
    noStockCount = 0,
    inStockCount = 0,
  } = useMemo(() => {
    if (!data) return {};

    const lowStock = data.filter(
      (v) => getStatus(v.quantity, v.unit) === "low"
    );
    const noStock = data.filter((v) => getStatus(v.quantity, v.unit) === "out");

    return {
      lowStockCount: lowStock.length,
      noStockCount: noStock.length,
      inStockCount: data.length - (noStock.length + lowStock.length),
    };
  }, [data, getStatus]);

  return (
    // Footer Container
    <footer className="fixed bottom-0 z-10 h-12 w-full border-t border-(--line) shadow-[0_-2px_8px_0] shadow-black/10">
      {/* Wrapper */}
      <div className="flex size-full items-center justify-between gap-1 bg-(--primary) px-2 sm:gap-3 sm:px-5">
        {/* Left Side Section */}
        <div className="flex h-6 shrink-0 items-center justify-center">
          {/* Total Items */}
          <div className="h-full w-auto flex items-center justify-center gap-1">
            <Boxes className="hidden h-full stroke-1 sm:block" />
            <span className="flex items-center text-[10px]! sm:text-xs!">
              Total:
            </span>
            <strong className="text-xs! font-bold">{data?.length}</strong>
          </div>
          {/* Total Items End */}
        </div>
        {/* Left Side Section End */}

        {/* Right Side Section */}
        <div className="flex h-6 min-w-0 items-center justify-end gap-1 overflow-x-auto sm:gap-1.5">
          {/* Low Stock */}
          <div className="flex h-full shrink-0 items-center justify-center gap-1 rounded-md border px-1 py-0.5 status-warning stroke-(--text-warning) sm:gap-1.5 sm:px-1.5">
            <AlertTriangle className="h-full stroke-2 stroke-inherit!" />
            <span className="flex items-center text-[10px]! text-inherit! sm:text-xs!">
              Low:
            </span>
            <strong className="text-xs! font-bold text-inherit!">
              {lowStockCount}
            </strong>
          </div>
          {/* Low Stock End */}
          {/* Out of Stock */}
          <div className="flex h-full shrink-0 items-center justify-center gap-1 rounded-md border px-1 py-0.5 status-danger stroke-(--text-danger) sm:gap-1.5 sm:px-1.5">
            <PackageX className="stroke-2 stroke-inherit! h-full" />
            <span className="flex items-center text-[10px]! text-inherit! sm:text-xs!">
              Out:
            </span>
            <strong className="text-xs! font-bold text-inherit!">
              {noStockCount}
            </strong>
          </div>
          {/* Out of Stock End */}
          {/* In Stock */}
          <div className="flex h-full shrink-0 items-center justify-center gap-1 rounded-md border border-(--line-success) bg-(--bg-success) px-1 py-0.5 stroke-(--text-success) text-(--text-heathy)! sm:gap-1.5 sm:px-1.5">
            <Check className="stroke-2 stroke-inherit! size-4.5" />
            <span className="text-[10px]! text-inherit! sm:text-xs!">In:</span>
            <strong className="text-xs! font-bold text-inherit!">
              {inStockCount}
            </strong>
          </div>
          {/* In Stock End*/}
        </div>
        {/* Right Side Section End  */}
      </div>
      {/* Wrapper End */}
    </footer>
    // Footer End
  );
};

export default StatusBar;
