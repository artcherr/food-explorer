import { notFound } from "next/navigation";
import DishCard from "@/components/DishCard";
import dishesJson from "@/data/dishes.json";
import restaurantsJson from "@/data/restaurants.json";
import { toSlug } from "@/lib/search/slug";
import type { Dish, Restaurant } from "@/lib/types";

type PageParams = { slug: string };

export default async function RestaurantPage({
  params,
}: {
  params: Promise<PageParams>; 
}) {
  const { slug } = await params; 

  const restaurants = restaurantsJson as Restaurant[];
  const restaurant = restaurants.find((r) => toSlug(r.name) === slug);
  if (!restaurant) return notFound();

  const dishes = dishesJson as Dish[];
  const items = dishes.filter(
    (d) =>
      Array.isArray(d.places) &&
      d.places.some(
        (p) =>
          p.restaurantId === restaurant.id || toSlug(p.restaurantName) === toSlug(restaurant.name),
      ),
  );

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">{restaurant.name}</h1>
        {restaurant.cuisineTags?.length ? (
          <p className="text-white/60 text-sm">{restaurant.cuisineTags.join(", ")} kitchen</p>
        ) : null}
      </header>

      {items.length === 0 ? (
        <div className="text-white/70">No dishes listed for this restaurant yet.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {items.map((dish) => (
            <DishCard key={dish.slug} dish={dish} />
          ))}
        </div>
      )}
    </section>
  );
}
