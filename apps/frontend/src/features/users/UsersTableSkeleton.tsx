import SkeletonTable from "@/components/ui/skeletons/SkeletonTable";

const UsersTableSkeleton = () => (
  <SkeletonTable columnSpans={[4, 2, 3, 3]} rows={6} />
);

export default UsersTableSkeleton;
