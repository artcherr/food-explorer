import { BuildIndexArgs, SearchHit, DishHit, RestaurantHit, CuisineHit } from './types';
import { normalize, toSlug } from './slug';


const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / Math.max(arr.length, 1);


function tokenScore(hay: string, needle: string) {
  if (!needle) return 0;
  if (hay.startsWith(needle)) return 1.0;
  if (hay.includes(needle)) return 0.6;
  return 0;
}


const notNull = <T>(x: T | null | undefined): x is T => x != null;

export function buildIndex({ dishes, restaurants, cuisines = [] }: BuildIndexArgs) {
  const dishIndex = dishes.map(d => {
    const name = d.name ?? '';
    const rest = d.restaurantName ?? '';
    const cui = d.cuisine ?? '';
    return {
      ...d,
      _n_name: normalize(name),
      _n_rest: normalize(rest),
      _n_cui: normalize(cui),
      slug: toSlug(name),
      restaurantSlug: rest ? toSlug(rest) : undefined,
    };
  });

  const restIndex = restaurants.map(r => {
    const name = r.name ?? '';
    const cuis = Array.isArray(r.cuisines) ? r.cuisines : (r.cuisines ? [r.cuisines] : []);
    return {
      ...r,
      _n_name: normalize(name),
      _n_cuis: cuis.map(normalize),
      slug: toSlug(name),
      cuisines: cuis,
    };
  });

  const cuisineIndex = cuisines.map(c => ({ title: c, _n: normalize(c) }));

  function search(raw: string, limit = 8): SearchHit[] {
    const q = normalize(raw);
    if (!q) return [];

    const dishHits = dishIndex
      .map(d => {
        const score = avg([
          tokenScore(d._n_name, q) * 1.0,
          tokenScore(d._n_rest, q) * 0.7,
          tokenScore(d._n_cui, q) * 0.6,
        ]);
        if (score <= 0) return null;

        const hit: DishHit = {
          kind: 'dish',
          id: d.slug,
          title: d.name,
          subtitle: d.restaurantName,
          score,
          slug: d.slug,
          restaurantName: d.restaurantName,
          restaurantSlug: d.restaurantSlug,
          price: d.price,
        };
        return hit;
      })
      .filter(notNull);

    const restHits = restIndex
      .map(r => {
        const score = avg([
          tokenScore(r._n_name, q) * 1.0,
          Math.max(0, ...r._n_cuis.map(c => tokenScore(c, q))) * 0.7,
        ]);
        if (score <= 0) return null;

        const hit: RestaurantHit = {
          kind: 'restaurant',
          id: r.slug,
          title: r.name,
          subtitle: r.cuisines?.join(', ') ?? undefined,
          score,
          slug: r.slug,
          cuisines: r.cuisines,
        };
        return hit;
      })
      .filter(notNull);


    const cuisineHits = cuisineIndex
      .map(c => {
        const score = tokenScore(c._n, q);
        if (score <= 0) return null;

        const hit: CuisineHit = {
          kind: 'cuisine',
          id: c.title,
          title: c.title,
          score,
        };
        return hit;
      })
      .filter(notNull);

    const all: SearchHit[] = [...dishHits, ...restHits, ...cuisineHits]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return all;
  }

  return { search };
}
