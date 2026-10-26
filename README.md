# Jontai Energy: From Sun to Light

Marketing site and quote-based store for Jontai Energy (solar and LED, Aruba). One continuous scroll story with a single sticky 3D canvas, plus a front-end-only loyalty program, **The Circle**.

**Stack:** Next.js 14 (App Router, TypeScript) · Tailwind CSS v4 · React Three Fiber + drei · GSAP + ScrollTrigger · Zustand · next-intl · zod + React Hook Form · sonner · pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:3000 (redirects to /en)
pnpm build      # production build, type-check and lint
pnpm lint
```

Set `NEXT_PUBLIC_SITE_URL` (for example `https://www.example.aw`) in production. It feeds canonical URLs, the sitemap, OpenGraph and JSON-LD.

> The previous static site (`index.html`, `pages/`, `assets/`, `update-i18n*.ps1`) is still in the repo, untouched. Next.js ignores it (`pageExtensions`, ESLint dirs and the Tailwind `@source` list are scoped to the new app). Delete it once the new site ships.

## Routes

| Route | Notes |
| --- | --- |
| `/[locale]` | The scroll journey: Hero → Source → Capture → Storage → Light → Collection → The Circle → Impact → Commitment → Footer |
| `/[locale]/store` | Full product grid (indexable) |
| `/[locale]/quote` | Quote form with the items from the quote cart |
| `/[locale]/loyalty` | Public loyalty page (indexable, `Offer` JSON-LD, sitemap priority 0.9) |
| `/[locale]/account/login` · `/register` · `/account` | Mock loyalty auth and dashboard. `noindex, nofollow`, not in the sitemap |
| `/api/quote` | Stub: logs the request and returns `{ ok: true }` |

Locales: `en` (complete), `pap` and `nl` (nav and hero translated, everything else falls back to English).

## How the 3D story works

- **One canvas.** `components/sections/Stage3D.tsx` holds a single sticky, full-viewport `<Canvas>` (`components/canvas/Scene.tsx`) that spans Hero through Collection. Loyalty and everything after it is plain DOM. Quick look reuses this same canvas: while the dialog is open the stage is raised above the page and the scene switches to a focus mode.
- **One scroll source.** `components/sections/ScrollDirector.tsx` creates the only page-level ScrollTrigger (`scrub: 1`, `invalidateOnRefresh: true`). It writes smoothed progress into `lib/scrollStore.ts` and measures every `[data-section]`. Camera, lighting, the particle, every model and the DOM readouts (charge meter, assembly stages) read the same store, so 3D and DOM never run on separate timers.
- **Camera.** `components/canvas/CameraRig.tsx` lerps between the two nearest keyframes inside `useFrame` (never GSAP). Sections rest on their keyframe while their sticky content is pinned and fly to the next one in between.
- **Lazy set pieces.** The battery, bulb and product ring are code-split and mount when their section is within 300px of the viewport. The canvas itself mounts only after `requestIdleCallback` and once the stage is on screen.

### Edit camera keyframes

`lib/cameraKeyframes.ts`: `cameraKeyframes` (desktop) and `mobileCameraKeyframes` (≤ 768px), one `{ id, position, target, fov }` per section. World positions of the set pieces are in `lib/world.ts`; per-section light, sky and fog are in `lib/lighting.ts`.

In development, open `/?leva` to show the leva panel with the live draw-call count (budget: under 40). leva is never bundled in production.

### Swap a procedural model for a GLB

Every hero object is wrapped in `<ModelSlot>` (`components/canvas/ModelSlot.tsx`). Put the file in `public/models/` and pass `src`:

```tsx
// components/canvas/Scene.tsx
<ModelSlot src="/models/solar-panel.glb" position={WORLD.panel}>
  <SolarPanel isMobile={isMobile} />   {/* fallback while the GLB loads */}
</ModelSlot>
```

With `src` set, the GLB renders instead of the procedural mesh. The scroll choreography lives in the procedural components (`SolarPanel`, `BatteryStack`, `LedBulb`), so for an animated GLB read `sectionProgress(...)` from the scroll store in your own `useFrame` the same way they do.

## Edit pricing and calculator constants

`lib/pricing.ts`: utility rates (`HOUSEHOLD_RATE_AWG_PER_KWH`, `BUSINESS_RATE_AWG_PER_KWH`), `USD_PER_AWG`, `SUN_HOURS_PER_DAY`, `CO2_KG_PER_KWH`, plus the estimate assumptions (performance ratio, roof density, installed cost per kWp, battery cost) and slider ranges. `estimateSolar()` is the only function the calculator calls.

## Add a language

1. Add the code to `locales` and `localeLabels` in `i18n/routing.ts`.
2. Create `content/<code>.ts` exporting `PartialMessages` (any key you leave out falls back to English).
3. Register it in the `overrides` map in `content/index.ts`.
4. Add the code to the matcher in `middleware.ts` (`'/(en|pap|nl|<code>)/:path*'`).

All copy lives in `content/en.ts`. Product data is in `lib/products.ts`.

## The Circle (mock loyalty)

Front-end only. There is no backend, no auth library, no middleware guard and no network call anywhere in the loyalty flow.

- **Data:** `lib/loyalty.ts` holds the tiers, rewards, `MOCK_ACTIVITY` rows, the `PREVIEW_MEMBER` (Alex Croes, `JNT-AB12-CD34`) and the deterministic hash helpers that derive member IDs and referral codes from an email.
- **State:** `lib/loyaltyStore.ts` is a Zustand store persisted to `localStorage` under `jontai.loyalty` (`signIn`, `preview`, `signOut`, `updateProfile`). The login password is validated in the form and never stored.
- **Guard:** `/account` renders nothing until the store hydrates, then client-side redirects signed-out visitors to `/account/login`.
- **Preview:** "Preview dashboard" on `/account/login` signs in the mock member in one click.
- Redeem buttons show a toast and never change points.

The quote cart is a separate store, `lib/quoteStore.ts`, persisted under `jontai.quote`.

## Reduced motion and fallbacks

With `prefers-reduced-motion: reduce` the canvas never mounts. `public/posters/*.webp` (rendered from the real scene) cross-fade by section, the shelf and Quick look show CSS product posters, and tier-card tilt, the progress-bar fill and the fanned-card entrance are off. To regenerate posters, render each section at 1440×900 and save the canvas as `public/posters/<section>.webp`.

## Content still to replace

- Testimonials in `content/en.ts` are placeholders. Swap in real customers, with their permission.
- Product names and specs in `lib/products.ts` are a sample catalog.
- Gallery and page photos are the previous site's brand images (`public/media`). Replace them with photos of real installs.
- Certification badges in `components/sections/Commitment.tsx` are placeholders.
- `content/pap.ts` and `content/nl.ts` need native-speaker review and full translation.
