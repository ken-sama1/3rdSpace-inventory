import SkeletonTable from "@/components/ui/skeletons/SkeletonTable";

const CategoryTableSkeleton = () => (
  <SkeletonTable columnSpans={[3, 3, 3, 3]} rows={5} />
);

export default CategoryTableSkeleton;
