import { avg, formatPriceSom } from "@/lib/format";
import type { Dish } from "@/lib/types";

const demoDish: Dish = {
  id: "demo-steak",
  slug: "demo-steak",
  name: "Demo Steak",
  cuisine: "european",
  image: "https://placehold.co/800x600?text=Demo+Steak",
  shortDescription: "Проверка типов форматирования",
  description: "Это тестовый объект для проверки сборки",
  ingredients: ["говядина", "масло", "специи"],
  places: [
    { restaurantId: "reast-a", price: 1000 },
    { restaurantId: "reast-a", price: 1000 },
  ],
};

export default function Page() {
  const avgPrice = avg(demoDish.places.map((p) => p.price));
  return (
    <div style={{ padding: 24 }}>
      <h1>{demoDish.name}</h1>
      <p>Ингредиенты: {demoDish.ingredients.join(", ")}</p>
      <p>Средняя цена: {formatPriceSom(avgPrice)}</p>
      <p>Кухня: {demoDish.cuisine}</p>
    </div>
  );
}
