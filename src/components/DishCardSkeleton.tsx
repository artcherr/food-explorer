
import { Skeleton } from "./Skeleton";

export default function DishCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#111114]">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
