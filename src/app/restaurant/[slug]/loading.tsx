
import DishCardSkeleton from "@/components/DishCardSkeleton";
import { Skeleton } from "@/components/Skeleton";

export default function LoadingRestaurant() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </header>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <DishCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
