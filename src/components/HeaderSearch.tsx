"use client";

import dishesJson from "@/data/dishes.json";
import restaurantsJson from "@/data/restaurants.json";
import { CUISINES } from "@/lib/cuisines";
import type { Dish, Restaurant } from "@/lib/types";
import SearchBar from "./SearchBar";

type DishLite = { name: string; restaurantName?: string; cuisine?: string; price?: number };
type RestLite = { name: string; cuisines?: string[] | string };

export default function HeaderSearch() {
  const dishesFull = dishesJson as Dish[];
  const restaurantsFull = restaurantsJson as Restaurant[];

  const dishes: DishLite[] = dishesFull.map((d) => ({
    name: d.name,
    cuisine: typeof d.cuisine === "string" ? d.cuisine : String(d.cuisine ?? ""),
    price: typeof d.price === "number" ? d.price : undefined,
  }));

  const restaurants: RestLite[] = restaurantsFull.map((r) => ({
    name: r.name,
    cuisines: Array.isArray(r.cuisineTags) ? r.cuisineTags : [],
  }));

  // ключи кухонь из единого справочника
  const cuisines: string[] = CUISINES.map((c) => c.key);

  return <SearchBar dishes={dishes} restaurants={restaurants} cuisines={cuisines} />;
}
