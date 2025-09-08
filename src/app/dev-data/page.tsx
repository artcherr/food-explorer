import dishesJson from "@/data/dishes.json";
import { avg, formatPriceSom } from "@/lib/format";
import type { Cuisine, Dish } from "@/lib/types";

const CUISINES: { key: Cuisine; label: string }[] = [
  { key: "kyrgyz", label: "Kyrgyz" },
  { key: "uyghur", label: "Uyghur" },
  { key: "dungan", label: "Dungan" },
  { key: "japanese", label: "Japanese" },
  { key: "italian", label: "Italian" },
  { key: "european", label: "European" },
];

export default function DevDataPage() {
  const dishes = dishesJson as Dish[];
  const uyghur = dishes.filter((d) => d.cuisine === "uyghur");

  const counts = dishes.reduce(
    (acc, d) => {
      acc[d.cuisine] = (acc[d.cuisine] ?? 0) + 1;
      return acc;
    },
    {} as Record<Cuisine, number>,
  );

  return (
    <main>
      <h1> Проверка данных JSON</h1>
      <p>Всего блюд: {dishes.length}</p>

      <h2>Uyghur блюда</h2>
      {uyghur.map((d) => {
        const avgPrice = avg(d.places.map((p) => p.price));
        return (
          <li key={d.id}>
            {d.name} — средняя цена: {formatPriceSom(avgPrice)}
          </li>
        );
      })}

      <h2>Сводка по кухням</h2>
      <ul>
        {CUISINES.map(({ key, label }) => (
          <li key={key}>
            {label}: {counts[key] ?? 0}
          </li>
        ))}
      </ul>
    </main>
  );
}
