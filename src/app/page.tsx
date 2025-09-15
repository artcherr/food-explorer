import Link from "next/link";
import Carousel, { CarouselItem } from "@/components/Carousel";
import ChipBar from "@/components/ChipBar";
import DishCard from "@/components/DishCard";
import dishesJson from "@/data/dishes.json";
import restaurantsJson from "@/data/restaurants.json";
import { CUISINES, toCuisineKey, type CuisineKey } from "@/lib/cuisines";
import { toSlug } from "@/lib/search/slug";
import type { Dish, Restaurant } from "@/lib/types";

export const revalidate = 300; // ISR

type PageSearch = { q?: string; cuisine?: string };

export default async function HomePage({ searchParams }: { searchParams: Promise<PageSearch> }) {
  const { q = "", cuisine = "" } = await searchParams;
  const query = q.toLowerCase().trim();
  const cuisineKey = toCuisineKey(cuisine);
  const hasFilters = Boolean(query || cuisineKey);

  const dishes = dishesJson as Dish[];
  const restaurants = restaurantsJson as Restaurant[];

  let matchedRestaurants: Restaurant[] = restaurants;
  if (query) {
    matchedRestaurants = matchedRestaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.cuisineTags.some((tag) => (tag as string).toLowerCase().includes(query)),
    );
  }
  if (cuisineKey) {
    matchedRestaurants = matchedRestaurants.filter((r) =>
      r.cuisineTags.some((tag) => (tag as string).toLowerCase() === cuisineKey),
    );
  }

  let matchedDishes: Dish[] = dishes;
  if (query) {
    matchedDishes = matchedDishes.filter((d) => {
      const inName = d.name.toLowerCase().includes(query);
      const inIngredients =
        Array.isArray(d.ingredients) &&
        d.ingredients.some((ing) => ing.toLowerCase().includes(query));
      const inPlaces =
        Array.isArray(d.places) &&
        d.places.some((p) => (p.restaurantName ?? "").toLowerCase().includes(query));
      return inName || inIngredients || inPlaces;
    });
  }
  if (cuisineKey) {
    matchedDishes = matchedDishes.filter((d) => (d.cuisine as string).toLowerCase() === cuisineKey);
  }

  if (!hasFilters) {
    return (
      <div className="space-y-8">
        <section className="rounded-2xl p-6 bg-[#111114] border border-white/10 text-center">
          <h1 className="text-2xl mb-3">Discover local cuisines</h1>
          <p className="text-white/70 text-sm">
            Browse dishes by cuisine. Click a card to see details and where to try it in Bishkek.
          </p>

          <ChipBar />
        </section>

        {CUISINES.map(({ key, label }) => {
          const items = dishes.filter((d) => d.cuisine === key);
          if (!items.length) return null;
          return (
            <Carousel key={key} title={label}>
              {items.map((d) => (
                <CarouselItem key={d.id}>
                  <DishCard dish={d} />
                </CarouselItem>
              ))}
            </Carousel>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl p-6 bg-[#111114] border border-white/10 text-center">
        <h1 className="text-2xl mb-2">
          {query && !cuisineKey && <>Results for “{q}”</>}
          {cuisineKey && !query && <>Cuisine: “{cuisine}”</>}
          {query && cuisineKey && (
            <>
              “{q}” in cuisine “{cuisine}”
            </>
          )}
        </h1>
        <p className="text-white/70 text-sm">
          {matchedRestaurants.length} restaurants · {matchedDishes.length} dishes
        </p>

        <ChipBar active={cuisineKey ?? undefined} q={query} />
      </section>

      {matchedRestaurants.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Restaurants ({matchedRestaurants.length})</h2>
          <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {matchedRestaurants.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl bg-[#111114] border border-white/10 p-4 hover:border-white/20 transition-colors"
              >
                <Link href={`/restaurant/${toSlug(r.name)}`} className="block">
                  <div className="font-medium">{r.name}</div>
                  {r.cuisineTags?.length ? (
                    <div className="text-sm text-white/60">{r.cuisineTags.join(", ")}</div>
                  ) : null}
                  <div className="text-xs text-white/50 mt-1">{r.address}</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {matchedDishes.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Dishes ({matchedDishes.length})</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {matchedDishes.map((d) => (
              <DishCard key={d.id} dish={d} />
            ))}
          </div>
        </section>
      )}

      {matchedRestaurants.length === 0 && matchedDishes.length === 0 && (
        <div className="rounded-2xl bg-white/5 px-4 py-6 text-white/80">
          Nothing found. Try another query.
        </div>
      )}
    </div>
  );
}
