import Carousel, { CarouselItem } from "@/components/Carousel";
import DishCard from "@/components/DishCard";
import dishesJson from "@/data/dishes.json";
import type { Cuisine, Dish } from "@/lib/types";

export const revalidate = 300; //ISR

const CUISINES: { key: Cuisine; label: string }[] = [
  { key: "kyrgyz", label: "Kyrgyz" },
  { key: "uyghur", label: "Uyghur" },
  { key: "dungan", label: "Dungan" },
  { key: "japanese", label: "Japanese" },
  { key: "italian", label: "Italian" },
  { key: "european", label: "European" },
];

export default function HomePage() {
  const dishes = dishesJson as Dish[];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl p-6 bg-[#111114] border border-white/10 text-center">
        <h1 className="text-2xl mb-3">Discover local cuisines</h1>
        <p className="text-white/70 text-sm">
          Browse dishes by cuisine. Click a card to see details and where to try it in Bishkek.
        </p>
      </section>
      {CUISINES.map(({ key, label }) => {
        const items = dishes.filter((d) => d.cuisine === key);
        if (!items.length) return null;
        return (
          <Carousel key={key} title={label}>
            {items.map((d) => (
              <CarouselItem key={d.id}>
                <DishCard dish={d} />
              </CarouselItem>
            ))}
          </Carousel>
        );
      })}
    </div>
  );
}
