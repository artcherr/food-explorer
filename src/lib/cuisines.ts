export const CUISINES = [
    { key: "kyrgyz", label: "Kyrgyz" },
    { key: "uyghur", label: "Uyghur" },
    { key: "dungan", label: "Dungan" },
    { key: "japanese", label: "Japanese" },
    { key: "italian", label: "Italian" },
    { key: "european", label: "European" },
] as const;

export type CuisineKey = typeof CUISINES[number]["key"];

export const CUISINE_KEYS = CUISINES.map(c => c.key) as CuisineKey[];

export const CUISINE_MAP: Record<CuisineKey, { label: string }> =
    Object.fromEntries(CUISINES.map(c => [c.key, { label: c.label }])) as
    Record<CuisineKey, { label: string }>;

const CUISINE_SET = new Set<string>(CUISINE_KEYS);

export function isCuisineKey(v: unknown): v is CuisineKey {
    return typeof v === "string" && CUISINE_SET.has(v);
}

export function toCuisineKey(input?: string | null): CuisineKey | null {
    if (!input) return null;
    const v = String(input).toLowerCase().trim();
    return isCuisineKey(v) ? (v as CuisineKey) : null;
}

export function getCuisineLabel(key: string | null | undefined): string {
    const norm = toCuisineKey(key);
    return norm ? CUISINE_MAP[norm].label : "";
}
