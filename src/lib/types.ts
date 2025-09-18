export type Cuisine = "kyrgyz" | "uyghur" | "dungan" | "japanese" | "italian" | "european";

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisineTags: Cuisine[];
}


type ById = { restaurantId: string; restaurantName?: string };
type ByName = { restaurantName: string; restaurantId?: string };
export type RestaurantRef = (ById | ByName) & { price: number };

export interface Dish {
  id: string;
  slug: string;
  name: string;
  cuisine: Cuisine;
  image: string;
  shortDescription: string;
  description: string;
  ingredients: string[];
  rating?: number;           
  places: RestaurantRef[];
  price?: number;             
}
