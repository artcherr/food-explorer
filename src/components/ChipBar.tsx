import { CUISINES, type CuisineKey } from "@/lib/cuisines";
import Link from "next/link";

export type Chip = { key: CuisineKey; label: string };

interface ChipBarProps {
  items?: readonly Chip[];
  active?: string | CuisineKey | null;
  q?: string | null;
  className?: string;
  showClear?: boolean;
}

export default function ChipBar({
  items = CUISINES,
  active,
  q,
  className = "",
  showClear = true,
}: ChipBarProps) {
  const qPart = q && q.trim().length > 0 ? `&q=${encodeURIComponent(q.trim())}` : "";

  const base = "inline-block rounded-full border px-3 py-1 text-sm transition-colors";
  const idle = "border-white/10 bg-white/5 hover:bg-white/10";
  const on = "bg-white/90 text-black";

  return (
    <nav aria-label="Filter by cuisine" className={`mt-4 ${className}`}>
      <ul
        className="flex gap-2 flex-wrap justify-center md:justify-center
                   overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden"
      >
        {items.map(({ key, label }) => {
          const isActive = active === key;
          const href = `/?cuisine=${encodeURIComponent(key)}${qPart}`;
          return (
            <li key={key}>
              <Link
                href={href}
                className={`${base} ${isActive ? on : idle}`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}

        {showClear && active ? (
          <li>
            <Link
              href={q && q.trim() ? `/?q=${encodeURIComponent(q.trim())}` : "/"}
              className={`${base} ${idle}`}
            >
              Clear
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
