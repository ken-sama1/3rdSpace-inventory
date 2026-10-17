import Skeleton from "@/components/ui/skeletons/Skeleton";

interface TransactionsTableSkeletonProps {
  rows?: number;
}

const TransactionsTableSkeleton = ({
  rows = 5,
}: TransactionsTableSkeletonProps) => (
  <div aria-label="Loading transactions" role="status" className="space-y-3">
    {Array.from({ length: rows }, (_, index) => (
      <div
        key={`transaction-skeleton-${String(index)}`}
        className="grid grid-cols-12 items-center gap-3 border-b border-(--line) px-3 py-3"
      >
        <Skeleton className="col-span-6 h-4" />
        <Skeleton className="col-span-3 ml-auto h-4 w-2/3" />
        <Skeleton className="col-span-3 ml-auto h-3 w-3/4" />
      </div>
    ))}
  </div>
);

export default TransactionsTableSkeleton;
