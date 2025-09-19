# Food Explorer Lite

A small pet project to **apply new Next.js skills in practice**: App Router, Server/Client Components, SSR via `searchParams`, `generateMetadata` with `await params`, ISR, route-segment `loading.tsx`, plus global `not-found.tsx` and `error.tsx`, and basic SEO/A11y hygiene.

## 🚀 Demo

- Production: **https://food-explorer-self.vercel.app/**
- Useful routes:
  - Home: `/`
  - Dish example: `/dish/<slug>`
  - Restaurant example: `/restaurant/<slug>`
  - Search: `/?q=lagman`
  - Cuisine filter: `/?cuisine=uyghur`

> Replace `<your-domain>` after deploying to Vercel (**Project → Domains**).

## ✨ Features

- **Search** across dishes / restaurants / cuisines
  - Free-text query `?q=…` and cuisine filter `?cuisine=…`
  - Enter without selecting a suggestion → free search to `/?q=…`
  - Dropdown closes on outside click and on route changes
  - A11y: `role="combobox"`, `aria-controls`, `aria-activedescendant`
- **ChipBar (RSC)** — quick cuisine chips (preserve `?q`, with “Clear”)
- **SEO**: `generateMetadata` (home/dish/restaurant) + `metadataBase`
- **Loading UX**: skeletons via segment-level `loading.tsx` for dish/restaurant pages
- **Errors**: global `not-found.tsx` (404) and `error.tsx` (with `reset()`)
- **Images**: `next/image` with proper `sizes` and `priority` where needed
- **Single source of truth for cuisines**: `lib/cuisines.ts` (`CUISINES`, `CuisineKey`, `toCuisineKey`, etc.)

## 📦 Download

### Option A — ZIP from GitHub
1. Open: `https://github.com/artcherr/food-explorer`
2. Click **Code → Download ZIP**
3. Unzip to any folder

### Option B — Git clone
```bash
git clone https://github.com/artcherr/food-explorer.git
cd food-explorer
# switch branch if needed
git checkout dev
```

## 🛠️ Local Development

> Requires Node.js ≥ 18.17

```bash
# install
npm i
# dev mode
npm run dev
# production build and start
npm run build
npm start
```

### Environment Variables (optional)
`.env.local` can specify a canonical base URL for OG/Canonical:

```
NEXT_PUBLIC_BASE_URL=https://<your-domain>.vercel.app
```

The code falls back to `VERCEL_URL`, so the project also works without this variable.

## 🗂️ Project Structure

```
app/
  page.tsx                      # home (search, chips, carousels)
  layout.tsx                    # shared layout (header logo links to /)
  not-found.tsx / error.tsx     # global 404 and error boundary
  dish/[slug]/{page,loading}.tsx
  restaurant/[slug]/{page,loading}.tsx
components/
  ChipBar.tsx  DishCard.tsx  Carousel.tsx
  SearchBar.tsx  Skeleton.tsx  DishCardSkeleton.tsx
lib/
  cuisines.ts  format.ts  search/  (data.ts — for future DB migration)
data/
  dishes.json  restaurants.json
```

## 🧭 Quick Feature Walkthrough

- Type `uyghur` and press **Enter** → goes to `/?q=uyghur`
- Pick **Cuisine: Uyghur** from suggestions → goes to `/?cuisine=uyghur`
- Click the header logo → goes to `/`
- Navigating to dish/restaurant shows **skeleton loaders** instead of a blank screen
- 404 page appears for `/abracadabra`

## 🧩 Tech Stack

- Next.js 15 (App Router, RSC), TypeScript
- Tailwind CSS
- Vercel (SSR/ISR hosting)

## 🗺️ Roadmap

- `sitemap.ts` and `robots.ts` using the project domain
- CI (build/lint/test) and Lighthouse CI on PRs
- (MVP) Admin: Prisma + Postgres + Server Actions (create dishes/restaurants), Basic Auth in `middleware`
- `/favorites` (optional) via Redux Toolkit

---

> The goal isn’t a full-blown product, but a focused demonstration of modern Next.js practices: server components, `searchParams` patterns, metadata and SEO basics, and segment-level loading/error handling with a clean developer experience.
