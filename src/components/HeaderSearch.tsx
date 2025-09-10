'use client';

import SearchBar from './SearchBar';
import dishes from '@/data/dishes.json';
import restaurants from '@/data/restaurants.json';

export default function HeaderSearch() {
 
  const cuisines = Array.from(
    new Set(
      (restaurants as any[])
        .flatMap(r => Array.isArray(r.cuisines) ? r.cuisines : (r.cuisines ? [r.cuisines] : []))
    )
  ) as string[];


  const dishLite = (dishes as any[]).map(d => ({
    name: d.name ?? d.title ?? '',
    restaurantName: d.restaurantName ?? d.restaurant ?? '',
    cuisine: d.cuisine ?? d.kitchen ?? '',
    price: d.price,
  }));
  const restLite = (restaurants as any[]).map(r => ({
    name: r.name ?? r.title ?? '',
    cuisines: r.cuisineTags ?? r.cuisines,
  }));

  return <SearchBar dishes={dishLite} restaurants={restLite} cuisines={cuisines} />;
}
