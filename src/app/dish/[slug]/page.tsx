import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import dishesJson from "@/data/dishes.json";
import restaurantsJson from "@/data/restaurants.json";
import { formatPriceSom } from "@/lib/format";
import { toSlug } from "@/lib/search/slug";
import type { Dish, Restaurant } from "@/lib/types";

export const revalidate = 300; 
type Params = { slug: string };

export async function generateStaticParams() {
  const list = dishesJson as Dish[];
  return list.filter((d) => Boolean(d.slug)).map((d) => ({ slug: d.slug! }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const list = dishesJson as Dish[];
  const dish = list.find((d) => d.slug === slug);
  if (!dish) return {};

  const title = `${dish.name} — Food Explorer`;
  const description = dish.shortDescription || dish.description?.slice(0, 140);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/dish/${slug}`,
      images: dish.image ? [{ url: dish.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: dish.image ? [dish.image] : undefined,
    },
    alternates: { canonical: `/dish/${slug}` },
  };
}

export default async function DishPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const list = dishesJson as Dish[];
  const restaurants = restaurantsJson as Restaurant[];

  const dish = list.find((d) => d.slug === slug);
  if (!dish) return notFound();

  const places = Array.isArray(dish.places)
    ? dish.places.map((p, i) => {
        const byId = p.restaurantId ? restaurants.find((r) => r.id === p.restaurantId) : undefined;
        const byName = p.restaurantName
          ? restaurants.find((r) => toSlug(r.name) === toSlug(p.restaurantName!))
          : undefined;
        const restaurant = byId ?? byName;
        return {
          ...p,
          key: `${p.restaurantId ?? toSlug(p.restaurantName ?? "unknown")}-${i}`,
          restaurant,
        };
      })
    : [];

  return (
    <article className="grid md:grid-cols-2 gap-6">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-[#111114]">
        <Image
          src={dish.image}
          alt={`${dish.name} — dish photo`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{dish.name}</h1>

        {dish.description ? <p className="text-white/80">{dish.description}</p> : null}

        {Array.isArray(dish.ingredients) && dish.ingredients.length > 0 && (
          <div>
            <h2 className="text-sm uppercase tracking-wide text-white/60 mb-2">Ingredients</h2>
            <div className="flex flex-wrap gap-2">
              {dish.ingredients.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm uppercase tracking-wide text-white/60 mb-2">Where to try</h2>
          {places.length === 0 ? (
            <div className="text-white/70">No listed places yet.</div>
          ) : (
            <ul className="space-y-2">
              {places.map((p) => (
                <li
                  key={p.key}
                  className="flex items-center justify-between rounded-xl bg-[#111114] border border-white/10 p-3"
                >
                  <div>
                    <div className="font-medium">
                      {p.restaurant?.name ?? p.restaurantName ?? "Unknown place"}
                    </div>
                    <div className="text-sm text-white/60">{p.restaurant?.address ?? ""}</div>
                  </div>
                  <div className="text-sm">
                    {typeof p.price === "number" ? formatPriceSom(p.price) : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
