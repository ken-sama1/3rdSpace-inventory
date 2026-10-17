import Skeleton from "@/components/ui/skeletons/Skeleton";
import SkeletonTable from "@/components/ui/skeletons/SkeletonTable";

const ProductsTableSkeleton = () => (
  <div className="space-y-3">
    <div className="flex justify-end">
      <Skeleton className="h-8 w-36" />
    </div>
    <SkeletonTable columnSpans={[3, 3, 3, 3]} />
  </div>
);

export default ProductsTableSkeleton;
