import type { MetadataRoute } from "next";
import dishes from "@/data/dishes.json";
import restaurants from "@/data/restaurants.json";
import { toSlug } from "@/lib/search/slug";
import type { Dish, Restaurant } from "@/lib/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const now = new Date().toISOString();

  const dishUrls = (dishes as Dish[])
    .filter(d => d.slug)
    .map(d => ({
      url: `${base}/dish/${d.slug}`,
      lastModified: now, changeFrequency: "weekly" as const, priority: 0.7,
    }));

  const restUrls = (restaurants as Restaurant[]).map(r => ({
    url: `${base}/restaurant/${toSlug(r.name)}`,
    lastModified: now, changeFrequency: "weekly" as const, priority: 0.6,
  }));

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...dishUrls,
    ...restUrls,
  ];
}
