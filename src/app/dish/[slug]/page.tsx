import dishesJson from '@/data/dishes.json';
import restaurantsJson from '@/data/restaurants.json';
import type { Dish, Restaurant } from '@/lib/types';
import Image from 'next/image';
import { formatPriceSom } from '@/lib/format';
import { notFound } from 'next/navigation';

type Params = { slug: string };

export async function generateStaticParams() {
  const list = dishesJson as Dish[];
  return list.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;   // <-- params теперь Promise
}) {
  const { slug } = await params;   // <-- ждём
  const list = dishesJson as Dish[];
  const dish = list.find((d) => d.slug === slug);
  if (!dish) return {};
  return {
    title: `${dish.name} — Food Explorer`,
    description: dish.shortDescription,
    openGraph: { title: dish.name, description: dish.shortDescription, images: [{ url: dish.image }] },
  };
}

export default async function DishPage({
  params,
}: {
  params: Promise<Params>;   // <-- тоже Promise
}) {
  const { slug } = await params;   // <-- ждём
  const list = dishesJson as Dish[];
  const rest = restaurantsJson as Restaurant[];
  const dish = list.find((d) => d.slug === slug);
  if (!dish) return notFound();

  const places = dish.places.map((p) => ({
    ...p,
    restaurant: rest.find((r) => r.id === p.restaurantId),
  }));

  return (
    <article className="grid md:grid-cols-2 gap-6">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-[#111114]">
        <Image src={dish.image} alt={dish.name} fill className="object-cover" /* unoptimized */ />
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{dish.name}</h1>
        <p className="text-white/80">{dish.description}</p>

        <div>
          <h2 className="text-sm uppercase tracking-wide text-white/60 mb-2">Ingredients</h2>
          <div className="flex flex-wrap gap-2">
            {dish.ingredients.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-sm">{tag}</span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-wide text-white/60 mb-2">Where to try</h2>
          <ul className="space-y-2">
            {places.map((p) => (
              <li key={p.restaurantId} className="flex items-center justify-between rounded-xl bg-[#111114] border border-white/10 p-3">
                <div>
                  <div className="font-medium">{p.restaurant?.name ?? 'Unknown place'}</div>
                  <div className="text-sm text-white/60">{p.restaurant?.address ?? ''}</div>
                </div>
                <div className="text-sm">{formatPriceSom(p.price)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
