import Skeleton from "@/components/ui/skeletons/Skeleton";

const ReportsSkeleton = () => (
  <div aria-label="Loading report" role="status" className="space-y-3">
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={`report-kpi-${String(index)}`}
          className="flex min-h-32 flex-col justify-between rounded-md border border-(--line) p-4"
        >
          <Skeleton className="h-4 w-2/3" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </section>
    <section className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
      {Array.from({ length: 2 }, (_, index) => (
        <div
          key={`report-overview-${String(index)}`}
          className="space-y-4 rounded-md border border-(--line) p-4"
        >
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-56 w-full" />
        </div>
      ))}
    </section>
  </div>
);

export default ReportsSkeleton;
