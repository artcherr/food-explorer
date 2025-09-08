import Image from 'next/image';
import Link from 'next/link';
import type { Dish } from '@/lib/types';
import { avg, formatPriceSom } from '@/lib/format';

export default function DishCard({ dish }: { dish: Dish }) {
  const avgPrice = avg(dish.places.map(p => p.price));

  return (
    <Link href={`/dish/${dish.slug}`} className="group block h-full">
      <article
        className="h-full min-h-[420px] rounded-2xl overflow-hidden
                   bg-[#111114] border border-white/10
                   hover:border-white/20 transition-colors
                   flex flex-col text-center"
      >
        <div className="relative aspect-[4/3]">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover transition-transform group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-base font-semibold">{dish.name}</h3>
          <p className="text-sm text-white/70 line-clamp-2">{dish.shortDescription}</p>

          {/* цена всегда прижата к низу */}
          <div className="mt-auto pt-2 text-sm text-white/80">
            {formatPriceSom(avgPrice)} avg
          </div>
        </div>
      </article>
    </Link>
  );
}
