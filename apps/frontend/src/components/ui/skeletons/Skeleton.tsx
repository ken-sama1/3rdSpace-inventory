import type { CSSProperties, FC } from "react";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

const Skeleton: FC<SkeletonProps> = ({ className = "", style }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded bg-(--bg-muted) ${className}`}
    style={style}
  />
);

export default Skeleton;
