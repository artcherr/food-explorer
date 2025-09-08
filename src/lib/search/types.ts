export type SearchKind = 'dish' | 'restaurant' | 'cuisine';

export interface SearchHitBase {
  id: string;        
  kind: SearchKind;
  title: string;    
  subtitle?: string; 
  score: number;    
}

export interface DishHit extends SearchHitBase {
  kind: 'dish';
  slug: string;
  restaurantName?: string;
  restaurantSlug?: string;
  price?: number;
}

export interface RestaurantHit extends SearchHitBase {
  kind: 'restaurant';
  slug: string;
  cuisines?: string[];
}

export interface CuisineHit extends SearchHitBase {
  kind: 'cuisine';
}

export type SearchHit = DishHit | RestaurantHit | CuisineHit;

export interface BuildIndexArgs {
  dishes: Array<{
    name: string;
    restaurantName?: string;
    cuisine?: string;
    price?: number;
  }>;
  restaurants: Array<{
    name: string;
    cuisines?: string[] | string;
  }>;
  cuisines?: string[];
}
