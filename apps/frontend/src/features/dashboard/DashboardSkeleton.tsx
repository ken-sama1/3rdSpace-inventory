import Skeleton from "@/components/ui/skeletons/Skeleton";

const DashboardSkeleton = () => (
  <div aria-label="Loading dashboard" role="status" className="space-y-3">
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={`dashboard-kpi-${String(index)}`}
          className="flex min-h-32 flex-col justify-between rounded-md border border-(--line) p-4"
        >
          <Skeleton className="h-4 w-2/3" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </section>
    <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {Array.from({ length: 2 }, (_, index) => (
        <div
          key={`dashboard-panel-${String(index)}`}
          className="space-y-5 rounded-md border border-(--line) p-4"
        >
          <Skeleton className="h-5 w-1/3" />
          {Array.from({ length: 3 }, (_, row) => (
            <div
              key={`dashboard-panel-row-${String(index)}-${String(row)}`}
              className="space-y-2"
            >
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      ))}
    </section>
    <div className="space-y-4 rounded-md border border-(--line) p-4">
      <Skeleton className="h-5 w-1/4" />
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton
          key={`dashboard-product-${String(index)}`}
          className="h-8 w-full"
        />
      ))}
    </div>
  </div>
);

export default DashboardSkeleton;
