# From Sunlight to Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Jontai Energy home page as one scroll journey from sunlight to the upstairs furniture floor, with a 3D solar hero and a 3D moment for every featured category.

**Architecture:** One fixed, pointer-transparent R3F `<Canvas>` renders every scene through drei `<View>`s that track DOM stages, so there is a single WebGL context and off-screen views cost nothing. GSAP ScrollTrigger (driven by Lenis on the GSAP ticker) writes scroll progress into refs that scenes read in `useFrame`; React never re-renders per frame. Products are Higgsfield Tripo GLBs normalised, compressed and rendered to fallback stills by headless Blender; the panel, sun, energy and LED light stay procedural so they can animate part by part.

**Tech Stack:** Next.js 14 app router, TypeScript, React Three Fiber 8 + drei 9, three 0.169, GSAP 3.13 + ScrollTrigger + @gsap/react, Lenis 1.3, Motion 14 (UI only), Blender 5.2 (headless), Higgsfield (GPT Image 2.5, Tripo H3.1, Seedance 2.5), Hallmark sloplint.

**Spec:** `docs/superpowers/specs/2026-10-26-sunlight-to-home-design.md`

## Global Constraints

- Palette tokens from the spec hexes: sand `#F7F5EC`, light green `#B8D8A8`, fresh green `#79AE72`, forest `#173D2C`, ink `#183128`, wood `#B78455`, light oak `#D8B98E`; written in OKLCH in `app/tokens.css`, no literal colour or font-family outside the token block (Hallmark Floor 48).
- Faces: Gambetta (Fontshare, self-hosted) for display, Hanken Grotesk (next/font/google) for body. Two families.
- Copy: no installation wording; "Afl." for every amount; no em or en dashes; no eyebrows, tracked caps or middle-dot strings; about 80 words per screen; hero head 7 words or fewer.
- Service line verbatim: "Jontai Energy is a retail store and does not provide installation services. Delivery is available for large items such as furniture."
- Every animation has a reduced-motion path; no `transition: all`; focus rings 3:1 and instant; `overflow-x: clip` on html and body.
- GLBs Draco-compressed, under 1.5 MB each; DPR clamped to 1.75 desktop, 1.25 phones.

## Review Focus

- No WebGL (or a lost context): every stage shows its Blender fallback still and all copy stays readable.
- Reduced motion: no pin, no scrub; scenes render once at their resting pose; content fully visible.
- 375px phone: no horizontal scroll; scenes simplified (fewer particles, no exploded view); pins shortened.
- Keyboard only: skip link, nav, CTAs, the loyalty slider (arrow keys change the spend), drawer open and close with focus return.
- Slow network: copy and actions usable before any GLB arrives; stages reserve their height so nothing shifts.

---

### Task 1: Data and pure logic

**Files:**
- Modify: `lib/loyalty.ts`, `lib/store.ts`
- Create: `lib/contact.ts`, `lib/journey.ts`, `lib/loyalty.test.ts`, `lib/contact.test.ts`, `lib/journey.test.ts`
- Modify: `package.json` (script `test`: `node --test lib/loyalty.test.ts lib/contact.test.ts lib/journey.test.ts`)

**Interfaces:**
- Produces: `rewardsFor(spendAfl: number): number`, `progressToNext(spendAfl: number): number` (0..1), `untilNextReward(spendAfl: number): number`, `formatAfl(n: number): string`, `REWARD_STEP_AFL = 500`, `REWARD_PER_STEP_AFL = 25`.
- Produces: `whatsappLink(text?: string): string`, `DIRECTIONS_URL: string`.
- Produces: `JOURNEY: { id: 'sunlight'|'energy'|'living'|'upstairs'; label: string; anchor: string }[]`, `stopForProgress(p: number): JourneyStop['id']`.

- [ ] Write tests: `rewardsFor(1500) === 75`, `rewardsFor(500) === 25`, `rewardsFor(499) === 0`, `rewardsFor(-5) === 0`, `rewardsFor(NaN) === 0`; `formatAfl(1500) === 'Afl. 1,500'`; `progressToNext(750) === 0.5`; `untilNextReward(750) === 250`; `whatsappLink('Ask about furniture delivery')` ends with `?text=Ask%20about%20furniture%20delivery`; `whatsappLink()` has no query; `stopForProgress(0) === 'sunlight'`, `stopForProgress(1) === 'upstairs'`, `stopForProgress(NaN) === 'sunlight'`.
- [ ] Run `pnpm test`: FAIL (missing modules).
- [ ] Implement with relative imports only (the test runner strips types but does not resolve `@/`).
- [ ] Run `pnpm test`: PASS.

### Task 2: 3D assets

**Files:**
- Create: `tools/blender/normalize.py`, `tools/blender/fallbacks.py`, `public/models/{inverter,power-station,generator,ac-indoor,camera,lounge-chair,sofa}.glb`, `public/media/fallback/*.webp`, `public/draco/*` (decoder copied from `three/examples/jsm/libs/draco/gltf/`)

**Interfaces:**
- Produces: GLBs with origin at the base centre, +Y up, facing +Z, real-world metres (inverter 0.445 x 0.62 x 0.13; power station 0.48 x 0.35 x 0.27; AC indoor 0.86 x 0.29 x 0.2; generator 0.5 x 0.42 x 0.3; camera 0.22 tall; chair 0.75 x 0.8 x 0.8; sofa 1.6 x 0.8 x 0.85).

- [ ] Product source stills from GPT Image 2.5 (three-quarter, white ground, no logos), the supplied photos as references where they exist.
- [ ] Tripo H3.1 image-to-3D, textured + PBR.
- [ ] `blender --background --python tools/blender/normalize.py -- <in.glb> <out.glb> <w> <h> <d> <maxTris>`: join, recentre, scale to the longest real dimension, decimate to `maxTris`, export Draco level 6 with WebP textures at 1024.
- [ ] `fallbacks.py` renders each GLB at three-quarter on a transparent ground (Eevee, 1200 px) to `public/media/fallback/<name>.webp`.
- [ ] Verify: each GLB under 1.5 MB; each fallback opens and shows the whole object.

### Task 3: System, chrome, stage

**Files:**
- Create: `app/tokens.css`, `app/base.css` (Hallmark scaffold `--custom`), `public/fonts/gambetta/*`, `components/three/Stage.tsx`, `components/three/SceneView.tsx`, `components/three/useScrub.ts`, `components/ui/JourneyRail.tsx`
- Modify: `app/globals.css`, `app/layout.tsx`, `components/ui/Header.tsx`, `components/ui/Logo.tsx`, `components/providers/SmoothScroll.tsx`

**Interfaces:**
- Produces: `<Stage />` (fixed full-viewport canvas, `View.Port`, `eventSource` = document body, pointer-events none, DPR clamp, renders nothing without WebGL), `useWebGL(): boolean`.
- Produces: `<SceneView fallback={{ src, alt, width, height }} className>` children = R3F scene; mounts children when within 1 viewport, exposes `useSceneActive(): MutableRefObject<boolean>`.
- Produces: `useScrub(target: RefObject<HTMLElement>, opts?: { start?: string; end?: string }): MutableRefObject<number>` (0..1, ScrollTrigger, reduced motion returns a ref fixed at `opts.rest ?? 1`).

- [ ] Nav: wordmark, Products, Loyalty, Furniture, Visit us, "Get directions" (to `DIRECTIONS_URL`); one line at 1024; mobile menu.
- [ ] JourneyRail: four stops from `JOURNEY`, a sun marker scaled by root scroll, hidden under 64rem and for reduced motion (shows static).
- [ ] Metadata: title "Jontai Energy | Solar, power, lighting and furniture in Oranjestad, Aruba", a retail description with no installation wording, Open Graph, `Store` JSON-LD from `lib/store.ts` only.
- [ ] Verify: `pnpm typecheck`, page renders with no console errors.

### Task 4: Solar hero

**Files:** Modify `components/sections/Hero.tsx`; create `components/three/scenes/HeroScene.tsx`; reuse `components/three/solar/*` (panel gains an oak stand; rays become energy pulses leaving the panel).

- [ ] Load: cells assemble row by row (0.9 s), sun sweeps a light band across, one pulse leaves the panel. Scroll (pinned 160vh desktop, 120vh phone): sun rises, panel turns to it, camera dollies toward the next section. Pointer parallax under 0.08 rad.
- [ ] Copy exactly: head "Aruba sunlight, made useful.", line "Solar, power, lighting and everyday essentials, plus furniture upstairs at Jontai Energy.", "Explore solar" to `#solar`, "Visit the store" to `#visit`.
- [ ] Verify at 1280 x 800: head, line and both actions visible without scrolling (Floor 44b).

### Task 5: Energy journey

**Files:** create `components/sections/Intro.tsx`, `components/sections/Chapter.tsx`, `components/three/scenes/{Solar,Inverter,Portable,Cooling,LightAndCamera}Scene.tsx`, `components/three/models/{Glb,LedPendant,Airflow}.tsx`; modify `data/products.json` (chapter copy and facts), `lib/products.ts`.

- [ ] Chapters `#solar`, `#power`, `#portable`, `#cooling`, `#lighting`, each a different composition (no two neighbours share a skeleton), each with one 3D moment from the spec, at most three facts taken from the datasheets, and one action (open the category drawer or ask on WhatsApp).
- [ ] Verify: each scene stops rendering off screen (frame counter stays flat while scrolled away).

### Task 6: Upstairs, loyalty, visit, footer

**Files:** create `components/sections/Upstairs.tsx`, `components/three/scenes/FurnitureScene.tsx`, `components/loyalty/RewardPath.tsx`, `components/sections/Visit.tsx`; rewrite `components/sections/Footer.tsx`, `components/sections/Loyalty.tsx`, `components/catalog/CategoryDrawer.tsx`; delete the replaced files (`Categories.tsx`, `Delivery.tsx`, `Newsletter.tsx`, `LoyaltyCalculator.tsx`, `RewardsCard.tsx`, `WoodShape.tsx`, `Parallax.tsx`, `Cursor.tsx`, `lib/cursor.ts`).

- [ ] Upstairs: the Seedance staircase clip scrubbed (existing `public/media/seq/loft`), ground warming from green to oak, then chair and sofa on an oak plinth turning in; "Large-item delivery available. Ask us about furniture delivery." with "Ask about furniture delivery" (WhatsApp link).
- [ ] Loyalty: ring fills to Afl. 500 and stamps Afl. 25; a range input sets the spend (step 50, 0 to 3,000); total rewards shown; terms note; business card with "Ask about business rewards".
- [ ] Visit: address, hours, phone, WhatsApp, email, Facebook, Instagram, directions; the service line verbatim; placeholders listed in `docs/content-placeholders.md`.
- [ ] Verify: every link resolves to a real target; no form claims success.

### Task 7: Sweep

- [ ] `node ~/.claude/skills/hallmark/scripts/sloplint.mjs app/page.tsx --genre editorial --render --kept --url http://localhost:3000/`: 0 FAIL; every REFLEX fixed or waived in the stamp.
- [ ] Impeccable detector on changed UI; `pnpm typecheck`; `pnpm lint`; `pnpm test`.
- [ ] Browser pass at 375, 768, 1440: no overflow, no console errors, reduced motion and no-WebGL paths checked.
