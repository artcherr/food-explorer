"use client";

import { PropsWithChildren, useEffect, useId, useRef, useState } from "react";

type Props = PropsWithChildren<{ title: string }>;

export default function Carousel({ title, children }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft < maxScrollLeft - 1);
  };

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-carousel-item]");
    const itemW = first?.getBoundingClientRect().width ?? 300;
    const step = itemW + 16; // 16 = gap-4
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  useEffect(() => {
    updateButtons();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    const ro = new ResizeObserver(updateButtons);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      ro.disconnect();
    };
  }, []);

  return (
    <section role="region" aria-label={title} className="mb-10">
      <div className="mb-3 text-center">
        <h2 className="text-lg">{title}</h2>
      </div>

      <div
        ref={scrollerRef}
        id={listId}
        role="list"
        className="flex justify-center gap-4
                   overflow-x-hidden overflow-y-hidden scroll-smooth
                   snap-x snap-mandatory pb-2
                   [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2
                   [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {children}
      </div>

      <div className="flex justify-center gap-2 mt-3">
        <button
          type="button"
          onClick={() => scrollBy("left")}
          aria-controls={listId}
          disabled={!canLeft}
          className="px-3 py-1.5 border border-white/15 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollBy("right")}
          aria-controls={listId}
          disabled={!canRight}
          className="px-3 py-1.5 border border-white/15 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>
    </section>
  );
}

export function CarouselItem({ children }: PropsWithChildren) {
  return (
    <div
      role="listitem"
      data-carousel-item
      className="
        snap-start shrink-0
        basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4
        max-w-[275px] h-full
      "
    >
      {children}
    </div>
  );
}
