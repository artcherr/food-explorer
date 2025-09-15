'use client';

import SearchBar from './SearchBar';
import dishes from '@/data/dishes.json';
import restaurants from '@/data/restaurants.json';

export default function HeaderSearch() {

    const cuisinesFromRestaurants = new Set(
    (restaurants as any[]).flatMap(r =>
      Array.isArray(r.cuisineTags)
        ? r.cuisineTags
        : r.cuisineTags
        ? [r.cuisineTags]
        : []
    )
  );

   for (const d of dishes as any[]) {
    if (d.cuisine) cuisinesFromRestaurants.add(d.cuisine);
  }

   const cuisines = Array.from(cuisinesFromRestaurants) as string[];
 
  const dishLite = (dishes as any[]).map(d => ({
    name: d.name ?? '',
    restaurantName: d.places?.[0]?.restaurantName ?? '',
    cuisine: d.cuisine ?? '',
    price: d.places?.[0]?.price, 
  }));

  const restLite = (restaurants as any[]).map(r => ({
    name: r.name ?? '',
    cuisines: r.cuisineTags ?? [], 
  }));

  return <SearchBar dishes={dishLite} restaurants={restLite} cuisines={cuisines} />;
}
