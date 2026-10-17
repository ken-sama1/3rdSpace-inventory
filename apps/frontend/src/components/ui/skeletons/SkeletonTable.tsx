import Skeleton from "./Skeleton";

interface SkeletonTableProps {
  columnSpans?: number[];
  rows?: number;
}

const SkeletonTable = ({
  columnSpans = [3, 3, 3, 3],
  rows = 6,
}: SkeletonTableProps) => (
  <div
    aria-label="Loading table"
    role="status"
    className="min-w-[36rem] overflow-hidden rounded-md border border-(--line)"
  >
    <div className="grid h-10 grid-cols-12 items-center gap-3 border-b-3 border-(--line) px-4">
      {columnSpans.map((span, index) => (
        <Skeleton
          key={`header-${String(index)}`}
          className="h-3"
          style={{ gridColumn: `span ${String(span)}` }}
        />
      ))}
    </div>
    {Array.from({ length: rows }, (_, index) => (
      <div
        key={`row-${String(index)}`}
        className="grid h-11 grid-cols-12 items-center gap-3 border-b border-(--line) px-4 last:border-0"
      >
        {columnSpans.map((span, columnIndex) => (
          <Skeleton
            key={`cell-${String(index)}-${String(columnIndex)}`}
            className={`h-3 ${columnIndex === 0 ? "w-3/4" : "w-1/2"}`}
            style={{ gridColumn: `span ${String(span)}` }}
          />
        ))}
      </div>
    ))}
  </div>
);

export default SkeletonTable;
