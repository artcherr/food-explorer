import type { Metadata } from "next";
import Link from "next/link";
import Carousel, { CarouselItem } from "@/components/Carousel";
import ChipBar from "@/components/ChipBar";
import DishCard from "@/components/DishCard";
import dishesJson from "@/data/dishes.json";
import restaurantsJson from "@/data/restaurants.json";
import { CUISINES, toCuisineKey, getCuisineLabel } from "@/lib/cuisines";
import { toSlug } from "@/lib/search/slug";
import type { Dish, Restaurant } from "@/lib/types";

export const revalidate = 300;


type PageSearch = { q?: string; cuisine?: string };

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<PageSearch> }
): Promise<Metadata> {
  const { q = "", cuisine = "" } = await searchParams;
  const query = q.trim();
  const cuisineLabel = getCuisineLabel(cuisine);

  const baseTitle = "Food Explorer — Discover local cuisines";
  const baseDesc =
    "Browse dishes and restaurants in Bishkek. Filter by cuisine or search by dish, ingredients, and places.";

  if (!query && !cuisineLabel) {
    return {
      title: baseTitle,
      description: baseDesc,
      openGraph: { title: baseTitle, description: baseDesc, type: "website", url: "/" },
      alternates: { canonical: "/" },
    };
  }

  const titleParts: string[] = [];
  if (query) titleParts.push(`Results for “${query}”`);
  if (cuisineLabel) titleParts.push(`Cuisine: ${cuisineLabel}`);
  const title = `${titleParts.join(" — ")} · Food Explorer`;

  const description =
    query && cuisineLabel
      ? `Search “${query}” in ${cuisineLabel} cuisine.`
      : query
      ? `Search results for “${query}”.`
      : `Browse ${cuisineLabel} cuisine.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: "/" },
    alternates: { canonical: "/" },
  };
}

export default async function HomePage({ searchParams }: { searchParams: Promise<PageSearch> }) {
  const { q = "", cuisine = "" } = await searchParams;
  const query = q.toLowerCase().trim();
  const cuisineKey = toCuisineKey(cuisine); // null | key
  const hasFilters = Boolean(query || cuisineKey);

  const dishes = dishesJson as Dish[];
  const restaurants = restaurantsJson as Restaurant[];

  let matchedRestaurants: Restaurant[] = restaurants;
  if (query) {
    matchedRestaurants = matchedRestaurants.filter((r) => {
      const byName = r.name.toLowerCase().includes(query);
      const byCuisine =
        Array.isArray(r.cuisineTags) &&
        r.cuisineTags.some((tag) => String(tag).toLowerCase().includes(query));
      return byName || byCuisine;
    });
  }
  if (cuisineKey) {
    matchedRestaurants = matchedRestaurants.filter(
      (r) => Array.isArray(r.cuisineTags) &&
        r.cuisineTags.some((tag) => String(tag).toLowerCase().trim() === cuisineKey)
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
    matchedDishes = matchedDishes.filter(
      (d) => String(d.cuisine ?? "").toLowerCase().trim() === cuisineKey
    );
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

  const cuisineLabel = cuisineKey ? getCuisineLabel(cuisineKey) : "";

  return (
    <div className="space-y-8">
      <section className="rounded-2xl p-6 bg-[#111114] border border-white/10 text-center">
        <h1 className="text-2xl mb-2">
          {query && !cuisineKey && <>Results for “{q}”</>}
          {cuisineKey && !query && <>Cuisine: “{cuisineLabel}”</>}
          {query && cuisineKey && <>“{q}” in cuisine “{cuisineLabel}”</>}
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
                  {Array.isArray(r.cuisineTags) && r.cuisineTags.length > 0 ? (
                    <div className="text-sm text-white/60">{r.cuisineTags.join(", ")}</div>
                  ) : null}
                  {r.address ? (
                    <div className="text-xs text-white/50 mt-1">{r.address}</div>
                  ) : null}
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
