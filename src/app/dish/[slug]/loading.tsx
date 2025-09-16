import { Skeleton } from "@/components/Skeleton";

export default function LoadingDish() {
  return (
    <article className="grid md:grid-cols-2 gap-6">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-[#111114]">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-2/3" />
        <div className="space-y-2">
          {" "}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        <div>
          <Skeleton className="h-3 w-32 mb-2" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="h-3 w-40 mb-2" />
          <ul className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-xl bg-[#111114] border border-white/10 p-3"
              >
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
