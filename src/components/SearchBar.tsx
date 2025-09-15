"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { buildIndex } from "@/lib/search/index";
import { SearchHit } from "@/lib/search/types";

type DishLite = { name: string; restaurantName?: string; cuisine?: string; price?: number };
type RestLite = { name: string; cuisines?: string[] | string };

export default function SearchBar({
  dishes,
  restaurants,
  cuisines,
}: {
  dishes: DishLite[];
  restaurants: RestLite[];
  cuisines?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { search } = useMemo(
    () => buildIndex({ dishes, restaurants, cuisines }),
    [dishes, restaurants, cuisines],
  );

  useEffect(() => {
    const id = setTimeout(() => setResults(query ? search(query, 8) : []), 200);
    return () => clearTimeout(id);
  }, [query, search]);

  useEffect(() => {
    setOpen(false);
    setActive(-1);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActive(-1);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function go(hit: SearchHit) {
    if (hit.kind === "dish") {
      router.push(`/dish/${hit.slug}`);
    } else if (hit.kind === "restaurant") {
      router.push(`/restaurant/${hit.slug}`);
    } else {
      router.push(`/?cuisine=${encodeURIComponent(hit.title)}`);
    }
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const last = results.length - 1;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i < last ? i + 1 : last)); // -1 → 0
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i > -1 ? i - 1 : -1)); // 0 → -1
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (active === -1 || results.length === 0) {
        const q = query.trim();
        if (q) router.push(`/?q=${encodeURIComponent(q)}`);
      } else {
        go(results[active]);
      }
      setOpen(false);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
  }

  return (
    <div
      className="relative"
      role="combobox"
      aria-expanded={open}
      aria-owns="search-listbox"
      ref={containerRef}
    >
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search dishes, restaurants, cuisines…"
        className="h-10 w-full max-w-[520px] rounded-2xl px-4 border border-white/10 bg-white/5 placeholder-white text-white outline-none focus:border-white/30"
        aria-autocomplete="list"
        aria-controls="search-listbox"
      />

      {open && query && results.length > 0 && (
        <div
          className="absolute z-50 mt-2 w-full max-w-[520px] rounded-2xl
          bg-black/70 supports-[backdrop-filter]:bg-black/70
          backdrop-blur backdrop-brightness-75
          ring-1 ring-white/15 shadow-xl">
          <ul
            id="search-listbox"
            role="listbox"
            className="max-h-[60vh] overflow-auto py-2 pr-1 overscroll-contain glass-scroll "
          >
            {results.map((hit, i) => (
              <li
                key={`${hit.kind}-${hit.id}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(hit)}
                className={`px-4 py-2 cursor-pointer rounded-lg transition-colors ${
                  i === active ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <div className="text-sm font-medium text-white">
                  {hit.title}
                  {hit.subtitle ? <span className="text-white/60"> · {hit.subtitle}</span> : null}
                </div>
                <div className="text-xs text-white/50">
                  {hit.kind === "dish"
                    ? "Dish"
                    : hit.kind === "restaurant"
                      ? "Restaurant"
                      : "Cuisine"}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {open && query && results.length === 0 && (
        <div
          className=" absolute z-50 mt-2 w-full max-w-[520px] rounded-2xl
      bg-black/70 supports-[backdrop-filter]:bg-black/40
      backdrop-blur-xl backdrop-brightness-75
      ring-1 ring-white/15 shadow-xl
      text-white/80 px-4 py-3 text-sm"
        >
          Nothing found. Press Enter to search on the home page.
        </div>
      )}
    </div>
  );
}
