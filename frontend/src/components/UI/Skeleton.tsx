import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

const Skeleton = ({ className = "", ...props }: SkeletonProps) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-slate-200/80 ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
