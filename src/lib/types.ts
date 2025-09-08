export type Cuisine = "kyrgyz" | "uyghur" | "dungan" | "japanese" | "italian" | "european";

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisineTag: Cuisine[];
}
export interface RestaurantRef {
  restaurantId: string;
  price: number; //KGS
}

export interface Dish {
  id: string;
  slug: string;
  name: string;
  cuisine: Cuisine;
  image: string;
  shortDescription: string;
  description: string;
  ingredients: string[];
  raiting?: number;
  places: RestaurantRef[]; //где подают позиции и по какой цене
}
