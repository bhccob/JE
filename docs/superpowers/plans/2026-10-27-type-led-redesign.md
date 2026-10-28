# Type-led Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page's scroll film and the site's glass look with the type-led design approved in mockup v2. That covers a branded loader, a big-type hero, a shared product stage, numbers on contour lines, the 3D loyalty card, a new visit section and a new header and footer, with the same products, panels, quotes and concept mode.

**Architecture:** Sections stay server components that render plain, complete HTML with data attributes. One client `PageMotion` (mounted in the layout) adds the generic scroll motion by reading those attributes. A few client components own the interactive parts: `Loader`, `HeroMotion`, `HeroIndex`, `StageSwitcher`, `KelvinSlider`, `Header`, `Loyalty`. Lenis on the GSAP ticker (the existing `SmoothScroll`) stays the single scroll clock, and ScrollTrigger only reads progress.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, plain CSS on tokens, GSAP 3.13 with ScrollTrigger and `@gsap/react`, Lenis 1.3, `node --test` for pure logic, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-27-type-led-redesign-design.md`. The visual and motion reference is `public/mockups/home-redesign-v2.html`; its copy, sizes and timings are the starting values wherever a task says "as the mockup".

## Before Task 1

The working tree on `feature/remove-team` holds uncommitted work from another session, in files this plan rewrites (`components/ui/Header.tsx`, `components/sections/Visit.tsx`, `app/globals.css`, `lib/store.ts`, `PRODUCT.md`, plus the legacy site). Do not start until that work has been committed and merged into `Jontai-Energy`. Then:

1. Use superpowers:using-git-worktrees to create `feature/type-led-redesign` from the updated `Jontai-Energy`.
2. Copy in the uncommitted files this plan depends on: this plan, the spec, and `public/mockups/home-redesign.html` and `home-redesign-v2.html`. Commit them as the branch's first commit: `Add the type-led redesign spec, plan and mockups`.
3. Verification runs against a dev server on a free port: `pnpm exec next dev -p 3300`. Port 3000 may belong to another session.

## Global Constraints

- Copy: "Afl." before every amount. Never "We install", "Installation services", "Our installers" or anything implying installation comes with a purchase. Delivery line verbatim: "Large-item delivery available. Ask us about furniture delivery." Service line verbatim (`SERVICE_LINE` in `lib/store.ts`): "Jontai Energy is a retail store and does not provide installation services. Delivery is available for large items such as furniture."
- Facts only from the supplied documents. Every chapter with figures keeps its source note. Renders carry "Illustration, not specific stock" (or "Illustrations, not specific stock" on the shared stage).
- Palette: sand `#F7F5EC`, ink `#183128`, forest `#173D2C`, deep `#0F281D`, stage `#EEE6D8`, oak `#D8B98E`, fresh green `#79AE72`, green ink `#3D7443`, mint `#B8D8A8`.
- Type: Archivo only (variable, `wdth` 62–125, `wght` 300–900) through `next/font/google`. Narrow text uses `font-stretch: 62%`.
- Curves: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` (GSAP `expo.out`) and `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`. Only `transform`, `opacity` and `clip-path` animate. Entrances play once and never reverse. Nothing is pinned, nothing snaps, and scroll speed is never changed.
- Hover-only motion goes under `@media (hover: hover) and (pointer: fine)`.
- Reduced motion: no loader, no movement, no smoothing, all content in place. Without JavaScript: all content visible and no loader.
- Breakpoint: up to 960px wide is the stacked phone layout; from 961px, the split layout.
- While `CONCEPT` is on, the bottom-right corner belongs to `ConceptBanner`. Nothing fixed or sticky may sit under it.
- No new npm dependencies.
- Commit messages end with the line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Fonts arrive after first paint.** JONTAI, CUMANA 73 and JONTAI ENERGY must re-fit to their row once Archivo loads and on every resize, never overflowing or clipping. Pinned in Task 3.
2. **Coming back to the home page in the same visit** (the logo from `/quote`, or browser Back). There must be no second loader, the hero must show fully, and scroll motion must work again. Pinned in Task 8.
3. **Reloading mid-page** (the browser restores the scroll position at Visit). Everything above must be visible when scrolling back up, with no heading stuck below its line. Pinned in Task 6.
4. **The smallest phones (320 × 640).** No sideways scroll, fitted words inside the screen, and figures like "2 × 5,500 W" inside their column. Pinned in Task 6.
5. **Keyboard users while the header is hidden.** Tabbing into the header brings it back, and the phone menu traps nothing and closes on Escape with focus back on Menu. Pinned in Task 5.

## Files

| Path | Responsibility |
| --- | --- |
| `lib/countup.ts` (new) | Count-up text maths |
| `lib/contours.ts` (new) | Contour ring paths and the two presets |
| `lib/products.ts` | Types and export for the home copy (`HomeCopy`, `HOME_COPY`); film types removed |
| `data/products.json` | `home` block added; `film` block removed |
| `app/layout.tsx` | Archivo, head script, `PageMotion`; CursorGlow removed |
| `app/tokens.css`, `app/base.css` | New palette, type and curve tokens |
| `app/globals.css` | Only imports and page basics by the end |
| `app/styles/ui.css` (new) | Type roles, buttons, links, rules, split spans, feather, reveal states |
| `app/styles/shell.css` (new) | Header, phone menu, footer, concept banner |
| `app/styles/home.css` (new) | Loader, hero, statement, showroom and stage, numbers, visit |
| `app/styles/rewards.css` (new) | Loyalty section, card, member dialog |
| `app/styles/panel.css`, `app/styles/quote.css` (new) | Product panel and quote page, moved out of `globals.css` without glass |
| `components/ui/Split.tsx` (new) | `Words` for word-by-word text |
| `components/ui/FitText.tsx` (new) | Words sized to fill their row, optionally split into letters |
| `components/ui/Contours.tsx` (new) | Contour-line SVG |
| `components/motion/PageMotion.tsx` (new) | Generic scroll motion from data attributes |
| `components/ui/Header.tsx`, `components/sections/Footer.tsx` | Rewritten shell |
| `components/home/*` (new) | `Hero`, `HeroIndex`, `HeroMotion`, `Loader`, `intro.ts`, `Statement`, `Showroom`, `StageSwitcher`, `KelvinSlider`, `Numbers` |
| `components/sections/Visit.tsx`, `Loyalty.tsx`, `MemberLogin.tsx` | Restyled sections |
| `tools/shots/shoot.mjs` (new) | Headless screenshots for verification (not shipped) |
| Removed | `components/film/`, `lib/film.ts`, `lib/film.test.ts`, `public/film/`, `components/ui/CursorGlow.tsx`, `app/fonts/Gambetta-*.woff2` |

## The data-attribute contract

`PageMotion` (Task 4) reads these. The sections (Tasks 5 to 9) write them.

| Attribute | On | Motion |
| --- | --- | --- |
| `data-words` | A heading containing `Words` | Each `.wi` rises from `yPercent: 115` to 0 once its top reaches 88% (1.05s, `expo.out`, 45ms stagger). Skipped inside `#hero` (HeroMotion owns that). |
| `data-fill` | A paragraph containing `Words` | `.wi` opacity goes 0.14 → 1, scrubbed (`scrub: 0.5`) from its top at 85% to its bottom at 58%, stagger 0.1. |
| `data-line` | `.rule` | `scaleX` 0 → 1 once at 90% (1.3s). |
| `data-expand` | A dark section | `clip-path` from `inset(64px 4vw 0px 4vw round 36px)` (≤960px: `inset(24px 3vw 0px 3vw round 24px)`) to `inset(0px 0vw 0px 0vw round 0px)`, scrubbed from its top at the bottom of the screen to its top at 12%. |
| `data-parallax="from,to"` | Any element | `yPercent` from → to, scrubbed while its parent crosses the screen. Ghost numerals use `28,-18`; phone chapter pictures use `10,-4`. |
| `data-count` | `<dd>` | If `hasCount(text)`: on mount, fixes `min-width` to the current width and shows `countUpText(text, 0)`. Once at 90%, tweens progress 0 → 1 over 1.6s (`expo.out`, 0.2s delay), showing `countUpText(text, p)`. |
| `data-odometer="N"` | `.stat__n` containing a strip of digits 0…N | The strip goes to `yPercent: -100 * N / (N + 1)` once at 85% (1.9s, `expo.out`, 150ms apart within a section). |
| `data-draw` | SVG `path` with `pathLength="1"` | `stroke-dasharray: 1`; `stroke-dashoffset` 1 → 0. Default: scrubbed with the closest `section` from its top at 85% to its centre at 45%, stagger 0.03, `scrub: 1`. `data-draw="once"`: plays once at 65% (1.1s, 0.6s delay). |
| `data-chars` | `FitText` with `chars` | `.ci` rises from `yPercent: 110` once at 85% (1.2s, 45ms stagger). Skipped inside `#hero`. `data-chars="end"`: scrubbed from 105 to 0, from `main`'s bottom at the screen bottom to the end of scroll (`end: 'max'`). Below 961 × 720, it runs from its own top at the screen bottom to its bottom at 85%. |
| `.btn` | Buttons (pointer only) | Magnetic: `quickTo` x/y at 22% / 32% of the pointer offset (0.45s, `power3`). On leave, back to 0 with `elastic.out(1, 0.45)` over 0.8s. |

Plain fade-ups keep the existing `RevealObserver` (`[data-reveal]` → `.is-in`) with CSS: 28px rise, 0.9s, `--ease-out`.

---

### Task 1: Count-up text and contour rings

**Files:**
- Create: `lib/countup.ts`, `lib/countup.test.ts`, `lib/contours.ts`, `lib/contours.test.ts`
- Modify: `package.json` (`test` script lists the two new test files)

**Interfaces:**
- Produces: `countUpText(text: string, progress: number): string`, `hasCount(text: string): boolean`, `type Hill = readonly [cx: number, cy: number, rings: number]`, `contourRings(hills: readonly Hill[]): string[]`, `NUMBERS_HILLS: readonly Hill[]`, `VISIT_HILLS: readonly Hill[]`

- [ ] **Step 1: Write the failing tests** (style as in `lib/loyalty.test.ts`)

```ts
// lib/countup.test.ts
test('figures of ten or more count up from zero', () => {
  assert.equal(countUpText('8,000 W', 0), '0 W');
  assert.equal(countUpText('8,000 W', 0.5), '4,000 W');
  assert.equal(countUpText('8,000 W', 1), '8,000 W');
  assert.equal(countUpText('2,560 Wh', 0.5), '1,280 Wh');
  assert.equal(countUpText('10 ms', 0), '0 ms');
});
test('single digits stay put', () => {
  assert.equal(countUpText('2 × 5,500 W', 0.5), '2 × 2,750 W');
  assert.equal(countUpText('4', 0.3), '4');
});
test('ranges and percentages keep their shape', () => {
  assert.equal(countUpText('9k–36k', 0.5), '9k–18k');
  assert.equal(countUpText('Up to 100%', 0.25), 'Up to 25%');
  assert.equal(countUpText('No battery', 0.5), 'No battery');
});
test('progress is clamped, and nonsense shows the final text', () => {
  assert.equal(countUpText('8,000 W', 2), '8,000 W');
  assert.equal(countUpText('8,000 W', -1), '0 W');
  assert.equal(countUpText('8,000 W', Number.NaN), '8,000 W');
});
test('only text with a figure of ten or more counts', () => {
  assert.equal(hasCount('8,000 W'), true);
  assert.equal(hasCount('4'), false);
  assert.equal(hasCount('No battery'), false);
});

// lib/contours.test.ts
test('one closed ring per contour', () => {
  const rings = contourRings([[230, 820, 10], [1380, 180, 12]]);
  assert.equal(rings.length, 22);
  for (const d of rings) assert.match(d, /^M[\d.\- ]+(L[\d.\- ]+)+Z$/);
});
test('rings grow outward', () => {
  const [a, b] = contourRings([[800, 500, 2]]);
  assert.ok(maxRadius(b, 800, 500) > maxRadius(a, 800, 500)); // maxRadius: a helper in the test file that parses the points
});
test('the same hills always draw the same rings (server and client agree)', () => {
  assert.deepEqual(contourRings(NUMBERS_HILLS), contourRings(NUMBERS_HILLS));
  assert.equal(contourRings(NUMBERS_HILLS).length, 29);
  assert.equal(contourRings(VISIT_HILLS).length, 21);
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `node --test lib/countup.test.ts lib/contours.test.ts`
Expected: FAIL, because the modules do not exist yet.

- [ ] **Step 3: Implement `countUpText` and `hasCount` in `lib/countup.ts`**

Tokens are `/\d[\d,]*/g`. A token whose value is under 10 stays as written. Others become `Math.round(value * p)`, with en-US thousands separators when the original token had a comma. `p` is clamped to [0, 1], and a non-finite `p` is treated as 1.

- [ ] **Step 4: Implement `contourRings` in `lib/contours.ts`** (the mockup's maths, in the viewBox `0 0 1600 1000`)

```ts
// For each hill [cx, cy, count] and each ring 1..count: R = ring * 52; 141 points, a = i / 140 * 2π, i = 0..140;
// r = R * (1 + 0.11 * sin(3a + ring * 0.38 + cx) + 0.06 * sin(5a + 1.3 + ring * 0.21) + 0.035 * sin(8a + cy));
// point = (cx + r cos a, cy + 0.74 r sin a), each to one decimal; path = 'M' + first + 'L' + rest joined by 'L' + 'Z'.
export const NUMBERS_HILLS = [[230, 820, 10], [1380, 180, 12], [880, 1080, 7]] as const;
export const VISIT_HILLS = [[1420, 860, 12], [160, 120, 9]] as const;
```

- [ ] **Step 5: Run them and see them pass, along with the existing tests**

Run: `pnpm test`
Expected: PASS, with every test file listed.

- [ ] **Step 6: Commit**

```bash
git add lib/countup.ts lib/countup.test.ts lib/contours.ts lib/contours.test.ts package.json
git commit -m "Add count-up text and contour ring helpers for the redesign"
```

### Task 2: Home copy in the product data

**Files:**
- Modify: `data/products.json` (add a top-level `home` block; leave `film` until Task 6), `lib/products.ts` (types and export)
- Create: `lib/home-copy.test.ts`
- Modify: `package.json` (`test` script)

**Interfaces:**
- Produces, in `lib/products.ts`:

```ts
export type ChapterId = 'solar' | 'cooling' | 'backup' | 'light' | 'upstairs';
export interface HomeChapter {
  id: ChapterId;
  number: string;              // '01'..'05'
  label: string;               // after the number in the chapter label, e.g. 'Solar and inverters', 'Upstairs'
  index: string;               // the hero list name, e.g. 'Furniture, upstairs'
  floor: 'Ground floor' | 'Second floor';
  title: string;
  lead: string;
  facts?: Fact[];              // existing Fact { value, label }
  pull?: string;               // chapter 05: the delivery line
  note?: string;
  actions: { label: string; panel: PanelId }[];  // first is the primary text link
  quote: QuoteTopic;
  image: string;               // '/catalog/….webp'
  alt: string;
  tone?: 'oak';
}
export interface HomeCopy {
  hero: { title: string; lead: string; primary: string; secondary: string };
  statement: { label: string; strong: string; soft: string; points: { id?: string; label: string; text: string }[] };
  chapters: HomeChapter[];
  numbers: { label: string; stats: { value: number; label: string }[] };
}
export const HOME_COPY = data.home as HomeCopy;
```

- [ ] **Step 1: Write the failing test.** It reads `data/products.json` with `readFileSync` (Node cannot resolve `@/`) and imports `QUOTE_TOPICS` from `./quote.ts`.

```ts
test('the home page has the five chapters in order', () => {
  assert.deepEqual(home.chapters.map((c) => c.id), ['solar', 'cooling', 'backup', 'light', 'upstairs']);
  assert.deepEqual(home.chapters.map((c) => c.number), ['01', '02', '03', '04', '05']);
});
test('every chapter action opens a panel that exists', () => {
  const panels = new Set([...Object.keys(data.panels), ...data.categories.map((c) => c.id)]);
  for (const c of home.chapters) for (const a of c.actions) assert.ok(panels.has(a.panel), `${c.id} → ${a.panel}`);
});
test('every chapter asks for a real quote topic and shows a real render', () => {
  for (const c of home.chapters) {
    assert.ok(QUOTE_TOPICS.some((t) => t.id === c.quote), c.quote);
    assert.ok(existsSync(join('public', c.image)), c.image);
  }
});
test('the copy keeps the store rules', () => {
  const text = JSON.stringify(home);
  assert.doesNotMatch(text, /we install|installation services|our installers/i);
  assert.doesNotMatch(text, /\$|AWG/);
  assert.equal(home.chapters[4].pull, 'Large-item delivery available. Ask us about furniture delivery.');
});
```

- [ ] **Step 2: Run it and see it fail**

Run: `node --test lib/home-copy.test.ts`
Expected: FAIL, because `home` is undefined.

- [ ] **Step 3: Add the `home` block to `data/products.json`.** Copy it verbatim from the mockup v2 markup (hero, statement, chapters 01 to 05 with their figures and notes, numbers). Set the actions and quote topics as follows:

| Chapter | actions (label → panel) | quote | image | floor | index |
| --- | --- | --- | --- | --- | --- |
| solar | See the inverter → `inverter`; See solar panels → `solar` | `inverter` | `/catalog/inverter.webp` | Ground floor | Solar and inverters |
| cooling | See solar air conditioners → `solar-ac` | `solar-ac` | `/catalog/solar-ac.webp` | Ground floor | Solar air conditioning |
| backup | See the power station → `power-station`; See generators → `generator` | `power-station` | `/catalog/power-station.webp` | Ground floor | Backup power |
| light | See lighting → `led`; See security cameras → `cameras` | `led` | `/catalog/bulb.webp` | Ground floor | Lighting and cameras |
| upstairs | How delivery works → `furniture` | `furniture` | `/catalog/sofa.webp` | Second floor | Furniture, upstairs |

The statement's Delivery point gets `"id": "delivery"`. The hero is `film.dawn`'s title, line, primary and secondary. The numbers are `[{2, "Floors, power below and furniture above"}, {5, "Ranges: solar, power, lighting, cameras, furniture"}, {7, "Days a week, Sunday included"}]`.

- [ ] **Step 4: Add the types and `HOME_COPY` to `lib/products.ts`** (as in Interfaces).

- [ ] **Step 5: Run `pnpm test` and `pnpm typecheck`.** Expected: PASS.

- [ ] **Step 6: Commit:** `Add the home page copy for the type-led redesign`.

### Task 3: Foundation: tokens, Archivo, type and controls, text components, screenshot tool

**Files:**
- Modify: `app/layout.tsx` (fonts only), `app/tokens.css`, `app/base.css`, `app/globals.css` (remove its "Type", "Controls" and "Reveal" sections and `@import './styles/ui.css'`), `.gitignore` (`tools/shots/out/`)
- Create: `app/styles/ui.css`, `components/ui/Split.tsx`, `components/ui/FitText.tsx`, `components/ui/Contours.tsx`, `tools/shots/shoot.mjs`
- Delete: `app/fonts/Gambetta-Regular.woff2`, `app/fonts/Gambetta-Medium.woff2`

**Interfaces:**
- Consumes: `contourRings`, `Hill` (Task 1)
- Produces:
  - `Words({ text }: { text: string }): JSX.Element` renders `<span className="visually-hidden">{text}</span><span aria-hidden="true">` followed by each word as `<span className="w"><span className="wi">word</span></span>`, separated by plain spaces.
  - `FitText({ text, className, chars, label }: { text: string; className?: string; chars?: boolean | 'end'; label?: string })` is a client component. It renders `<p className={className} data-fit data-chars={chars === 'end' ? 'end' : chars ? '' : undefined}>`; with `label` it adds a visually hidden copy and makes the fitted copy `aria-hidden`, and without `label` the whole element is `aria-hidden`. The inner `<span className="fit">` holds the text, or with `chars` each letter as `.c > .ci` with spaces kept. It sets the font size to `100 * clientWidth / fitWidth` (measured at 100px) on mount, on `ResizeObserver` and after `document.fonts.ready`.
  - `Contours({ hills, className }: { hills: readonly Hill[]; className?: string })` is a server component. It renders `<svg className="contours …" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">` with one `<path pathLength="1" data-draw d=…>` per ring.
  - CSS in `ui.css`:
    - Type roles `.label`, `.display`, `.lead`, `.fine`, and the existing `.h-section`, `.h-title`, `.note`, `.figure` restyled to the spec's type table.
    - `.rule`, `.w`/`.wi` (padding `.06em .08em .16em` with matching negative margins), `.c`/`.ci`, `.feather` (the mockup's two-gradient mask), `.textlink`.
    - Buttons. Keep the existing modifier names so no component has to change them: `.btn--primary` is solid forest, `.btn--ghost` is an outline, `.btn--sm` is the small size. Inside `[data-tone="dark"]`, `.btn--primary` becomes a sand fill and `.btn--ghost` a sand outline. Hover fill slides up from the bottom (0.5s `--ease-out`), and a press sets `scale: .97` (120ms).
    - The `[data-reveal]` states.
  - Tokens. Keep every existing token name that surviving CSS uses, change the values to the palette, and add `--color-stage`, `--color-deep`, `--color-green-ink`, `--color-mint`, `--color-oak`, `--stretch-narrow: 62%` and `--ease-out` / `--ease-in-out` as above. `--font-display` and `--font-body` both become `var(--font-archivo)`. Leave the glass tokens until Task 10.

- [ ] **Step 1: Load Archivo** in `app/layout.tsx`: `Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' })` on `<html>`. Remove Gambetta and Hanken.
- [ ] **Step 2: Rewrite the tokens, base and `ui.css`** as described in Interfaces. Remove the three moved sections from `globals.css`.
- [ ] **Step 3: Write `Words`, `FitText` and `Contours`.**
- [ ] **Step 4: Add `tools/shots/shoot.mjs`.** Start from `C:\Users\bhcco\AppData\Local\Temp\claude\C--Users-bhcco-Documents-JE\663b0d89-8c1c-4dac-aa44-b85f293d3cbf\scratchpad\shoot.mjs`, or, if that file is gone, write it over the Chrome DevTools Protocol with Node's global `WebSocket`. The Chrome path comes from `CHROME_PATH`, defaulting to `%LOCALAPPDATA%/ms-playwright/chromium-1248/chrome-win64/chrome.exe`.

  Usage: `node tools/shots/shoot.mjs <url> <outPrefix> <width> <height> <targets>`. Targets are comma-separated and run in order. Only `t=`, `y=` and selectors capture a screenshot:

  | Target | Effect |
  | --- | --- |
  | `t=MS` | Wait until MS after the first navigation, then capture |
  | `wait=MS` | Wait |
  | `y=PX` or a CSS selector | Scroll there through `window.__lenis` (`immediate: true`), wait 1.7s, then capture |
  | `js=CODE` | Evaluate CODE (promises awaited) and print the result |
  | `size=WxH` | `Emulation.setDeviceMetricsOverride` without reloading |
  | `media=reduce` | `Emulation.setEmulatedMedia` with `prefers-reduced-motion: reduce`, then reload |
  | `nojs` | `Emulation.setScriptExecutionDisabled`, then reload |

  Page exceptions are printed at the end. The checks below run against the dev server, because `__lenis` and `__st` exist only in development.
- [ ] **Step 5: Verify.**
  - Run: `pnpm typecheck && pnpm lint && pnpm build`. Expected: all pass.
  - Run: `node tools/shots/shoot.mjs http://localhost:3300/quote tools/shots/out/t3 1440 900 "t=3000,js=getComputedStyle(document.querySelector('.label, label')).fontFamily"`. Expected: the font family includes Archivo, and no exceptions are printed.
- [ ] **Step 6: Review Focus 1 (fonts arrive late).** Add a temporary `FitText text="JONTAI"` to `/quote`'s heading area. With `fits` = `(()=>{const p=document.querySelector('[data-fit]');return p.querySelector('.fit').getBoundingClientRect().width<=p.clientWidth+1&&p.querySelector('.fit').getBoundingClientRect().width>=p.clientWidth*0.97})()`, run `"wait=200,js=document.fonts.ready.then(()=>new Promise(r=>setTimeout(r,300))).then(()=>FITS),size=390x844,wait=500,js=FITS"`, with FITS replaced by the expression. Expected: `true` twice (fills the row, never overflows). Remove the temporary element.
- [ ] **Step 7: Commit:** `Set up Archivo, the new tokens, type and controls for the redesign`.

### Task 4: The motion layer

**Files:**
- Create: `components/motion/PageMotion.tsx`
- Modify: `app/layout.tsx` (mount `<PageMotion />` after `<RevealObserver />`), `app/styles/ui.css` (states hidden before motion), `app/quote/page.tsx` (heading through `Words` with `data-words`)

**Interfaces:**
- Consumes: `countUpText`, `hasCount` (Task 1); the attribute contract above
- Produces: `PageMotion(): null`. A client component that rebuilds all contract behaviour on mount and on `usePathname()` change, inside `useGSAP` with `revertOnUpdate: true` so client navigation never duplicates triggers. It calls `ScrollTrigger.refresh()` after `document.fonts.ready`. `gsap.matchMedia()` chooses the inset values and the `data-chars="end"` mode at 961px wide and 720px tall. In development only, it sets `window.__st = ScrollTrigger` for the checks, as `SmoothScroll` does with `__lenis`.

- [ ] **Step 1: Hidden-before-motion CSS**, only under `html.js` and `(prefers-reduced-motion: no-preference)`: `[data-words] .wi` and `[data-chars] .ci` start below their line. Nothing else is hidden by CSS.
- [ ] **Step 2: Write `PageMotion`** to the contract table. Under reduced motion it returns before creating anything.
- [ ] **Step 3: Use it on `/quote`.** Wrap the "Request a quote." heading text in `Words` and give the `h1` `data-words`.
- [ ] **Step 4: Verify.**
  - Run: `pnpm typecheck && pnpm lint`.
  - Run: `node tools/shots/shoot.mjs http://localhost:3300/quote tools/shots/out/t4 1440 900 "t=600,t=2500"`. Expected: at 600ms the heading is mid-rise; at 2500ms it is fully in place; no exceptions.
  - The remaining contract rows are verified in Tasks 6, 7 and 9, where they are first used.
- [ ] **Step 5: Commit:** `Add the scroll motion layer driven by data attributes`.

### Task 5: Site shell: header, phone menu, footer

**Files:**
- Rewrite: `components/ui/Header.tsx`, `components/sections/Footer.tsx`
- Create: `app/styles/shell.css` (header, menu, footer, and the concept banner rules moved from `globals.css`)
- Modify: `app/globals.css` (remove "Nav", "Footer", the cursor-light rules, and the glass header, Products menu and phone-menu rules), `app/layout.tsx` (remove `CursorGlow`; give `main` its sand background and `z-index: 1` in CSS)
- Delete: `components/ui/CursorGlow.tsx`

**Interfaces:**
- Consumes: `FitText` (Task 3), `whatsappLink` and `DIRECTIONS_URL` (`lib/contact.ts`), `STORE`, `CONCEPT`, `OFFICIAL_URL`, `QUOTE_ACTION`, `OpenCategoryButton`, `CATEGORIES`
- Produces: `Header({ base = '' }: { base?: string })` and `Footer({ base = '' }: { base?: string })`, same props as today, used by `app/page.tsx` and `app/quote/page.tsx`.

Header (root `header.nav`):
- `a.brand` to `base || '#top'`: logo (`/icon-192.png`, 36px) and "Jontai Energy". Links stay plain `<a>`, as today.
- Links: Solar `#solar` (current while `#solar` or `#cooling` is mid-screen), Power `#backup`, Lighting `#light`, Furniture `#upstairs`, Rewards `#rewards`, Visit `#visit`, each prefixed with `base`.
- "Get a quote" goes to `/quote` (with `aria-current="page"` there). The "WhatsApp us" button (`.btn--primary .btn--sm`) goes to `whatsappLink()` in a new tab.
- Scroll behaviour, from Lenis `scroll` via `useLenis`: `data-solid` once scrolled past 12px; `data-hidden` when moving down past 70% of the screen height, cleared when moving up. `.nav:focus-within` always shows the header.
- Current-section underline, home only (`base === ''`): one 2px bar under the links, moved with `transform: translateX(offsetLeft) scaleX(offsetWidth)` (0.55s `--ease-out`). It is driven by ScrollTrigger `start: 'top 50%', end: 'bottom 50%'` per link.
- Phone menu (≤960px): a "Menu" button (`button.nav__menu`) opens a full-screen sand sheet (`nav#menu`, `role="dialog"`, `aria-modal="true"`) with the six links at display size, then "Get a quote", "WhatsApp us" and "Get directions". It opens with `clip-path: inset(0 0 100% 0)` → `inset(0)` (0.5s `--ease-out`), then focus goes to the first link, Lenis stops, and Escape or any link closes it with focus back on Menu.

Footer:
- On `[data-tone="dark"]` deep: centred narrow-caps link rows. Products are the five categories through `OpenCategoryButton`. The store row has Request a quote, Rewards, Large-item delivery (`#delivery`), Visit and FAQ (`#faq`).
- Facebook and Instagram icon links.
- `FitText text="JONTAI ENERGY" chars` with `data-chars="end"`.
- Fine print: © year and address, plus the concept line (when `CONCEPT`) with the link to jontaienergy.com.
- On desktop at least 961 × 720, `position: sticky; bottom: 0; z-index: 0`.

- [ ] **Step 1: Write `Header` and its CSS.**
- [ ] **Step 2: Write `Footer` and its CSS.** Remove `CursorGlow` and its CSS.
- [ ] **Step 3: Verify.**
  - Run: `pnpm typecheck && pnpm lint && pnpm build`.
  - Shots of `/quote` at 1440 × 900 and 390 × 844, top and `y=99999`. Expected: the new header and footer, the concept banner bottom right, no glass.
- [ ] **Step 4: Review Focus 5 (keyboard and the hidden header).**
  - On `/quote` at 1440 × 900, run `y=1200,js=document.querySelector('.nav').dataset.hidden` then `js=(document.querySelector('.nav a').focus(), getComputedStyle(document.querySelector('.nav')).transform)`. Expected: `'true'`, then `none` or the identity matrix.
  - At 390 × 844: `js=document.querySelector('.nav__menu').click()`, `wait=600`, `js=document.activeElement.textContent`. Expected: `Solar`. Then `js=document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`, `wait=600`, `js=document.activeElement===document.querySelector('.nav__menu')`. Expected: `true`.
- [ ] **Step 5: Commit:** `Rebuild the header, phone menu and footer in the new look`.

### Task 6: The home page, film removed

**Files:**
- Rewrite: `app/page.tsx`, `components/sections/Visit.tsx`
- Create: `components/home/Hero.tsx`, `components/home/Statement.tsx`, `components/home/Showroom.tsx`, `components/home/KelvinSlider.tsx`, `components/home/Numbers.tsx`, `app/styles/home.css`
- Modify: `app/layout.tsx` (the head script keeps only `d.classList.add('js')`), `data/products.json` (remove `film`), `lib/products.ts` (remove `FilmCopy`, `FILM_COPY`), `lib/home-copy.test.ts` (add the test below), `package.json` (`test` without `lib/film.test.ts`), `app/globals.css` (remove "The day film", "Visit" and the backdrop rules)
- Delete: `components/film/`, `lib/film.ts`, `lib/film.test.ts`, `public/film/`

**Interfaces:**
- Consumes: `HOME_COPY` (Task 2); `Words`, `FitText`, `Contours`, `NUMBERS_HILLS`, `VISIT_HILLS` (Tasks 1 and 3); the attribute contract (Task 4); `kelvinToRgb`, `kelvinLabel`, `kelvinValueText` (`lib/kelvin.ts`); `openState`, `arubaNow`, `hoursOn`, `STORE`, `SERVICE_LINE`, `FAMILY_LINE` (`lib/store.ts`)
- Produces:
  - `KelvinSlider(): JSX.Element` (client). A range input from 3000 to 6500 in steps of 100, labelled "Try a colour", with `aria-valuetext={kelvinValueText(k)}`. It shows `{k}K` and `kelvinLabel(k)`, and on input sets `--glow: rgb(…kelvinToRgb(k))` on every `[data-glow]` element.
  - Markup hooks for later tasks: `#hero` with `[data-hero]` on the meta items, lead, actions, list title and list items; `.wordmark` is `FitText text="JONTAI" chars` (aria-hidden); the `h1` holds `Words`. The list is plain anchors here, made interactive in Task 8. Each chapter is `article.chapter#{id}` containing `.chapter__media` (picture with `.feather` and `data-parallax="10,-4"`, the floor label, and on chapter 04 `<i className="stage__glow" data-glow />`), then `.ghost[data-parallax="28,-18"]`, label, `h2[data-words]`, lead, `dl.facts > div > dt + dd[data-count]`, note, actions. The section is `section.showroom#products[data-expand]`.

Page order: `CatalogProvider`, `Header`, `main#main`, then `Hero`, `Statement`, `Showroom`, `Numbers`, `Loyalty` (as it is until Task 9), `Visit`, then `Footer`.

Visit (client, as today, for the open state):
- `section#visit[data-expand][data-tone="dark"]`
- `Contours hills={VISIT_HILLS}`
- "Visit the store" label
- `FitText text="Cumana 73" chars label="Cumana 73, Oranjestad, Aruba"` in narrow caps
- "Oranjestad, Aruba"
- Three ruled columns: Opening hours (both rows from `STORE.hours`, plus the live line from `openState(arubaNow())`, set after mount), Talk to us (`tel:`, WhatsApp, `mailto:`) and Good to know (`SERVICE_LINE`)
- The four existing FAQ entries as `section#faq` with ruled `<details>` rows
- Get directions (`DIRECTIONS_URL`), WhatsApp us, Request a quote (`/quote`)

The sun arc (`TodayArc`) goes.

Showroom in this task: each chapter is a two-column split (text field left, its own `.chapter__media` right), alternating sides, with oak on chapter 05. Below 961px the media sits above the text. Each chapter's actions are `OpenCategoryButton` text links, one per `actions` entry, plus a `/quote?for={quote}` "Request a quote" link. Chapter 04 renders `KelvinSlider` in place of facts.

- [ ] **Step 1: Write the failing test** in `lib/home-copy.test.ts`: `test('the film copy is gone', () => assert.equal(data.film, undefined))`. Run `node --test lib/home-copy.test.ts`. Expected: FAIL.
- [ ] **Step 2: Delete the film files, its data and types, and its CSS.** Run `pnpm test`. Expected: PASS.
- [ ] **Step 3: Write `Hero`, `Statement`, `Showroom`, `KelvinSlider`, `Numbers` and `Visit`, assemble `app/page.tsx`, and write `home.css`** to the mockup's values. Every picture below the hero has `loading="lazy"`, `decoding="async"` and `width`/`height` 800.
  - Statement: `Words` for `strong` and `soft` inside `p[data-fill]`; the points with `.rule[data-line]`.
  - Numbers: `ul.stats > li > span.stat__n[data-odometer=N]` holds an `aria-hidden` strip of digits 0…N, with a visually hidden N before the label.
- [ ] **Step 4: Verify.**
  - Run: `pnpm typecheck && pnpm lint && pnpm build`.
  - Shots at 1440 × 900: `y=0,.intro,#solar,#light,.numbers,#visit,y=99999`. Expected: as the mockup. Figures count up, 2/5/7 roll, contours draw, CUMANA 73 rises, dark fields grow from rounded insets, footer letters rise, and no product edge shows.
  - Shots at 390 × 844 at the same targets. Expected: stacked layout, no sideways scroll (`js=document.documentElement.scrollWidth <= innerWidth` is `true`).
- [ ] **Step 5: Review Focus 3 (reload mid-page).** Run `"#visit,js=location.reload(),wait=4000,js=(__lenis.scrollTo(0,{immediate:true}),new Promise(r=>setTimeout(r,1500))).then(()=>[...document.querySelectorAll('[data-words] .wi')].filter(w=>new DOMMatrix(getComputedStyle(w).transform).m42!==0).length)"`. Expected: `0` (every word rose).
- [ ] **Step 6: Review Focus 4 (320 × 640).** Shots of `y=0,#solar,#visit,y=99999`. Expected: `scrollWidth <= innerWidth`, JONTAI and CUMANA 73 inside the screen, and "2 × 5,500 W" inside its column.
- [ ] **Step 7: Commit:** `Replace the home page film with the type-led sections`.

### Task 7: The shared product stage

**Files:**
- Create: `components/home/StageSwitcher.tsx`
- Modify: `components/home/Showroom.tsx` (render `<StageSwitcher chapters={HOME_COPY.chapters} />` beside the chapters), `app/styles/home.css`

**Interfaces:**
- Consumes: `HomeChapter[]` (Task 2); the `article.chapter#{id}` markup (Task 6); `useLenis` from `lenis/react`
- Produces: `StageSwitcher({ chapters }: { chapters: HomeChapter[] })` (client), rendering `div.stage[data-active]`.

At 961px and wider: `section.showroom` becomes a grid `1fr 1fr`, chapters fill the left column, `.chapter__media` is hidden, and `.stage__sticky` (`position: sticky; top: 0; height: 100svh`, stage colour with the mockup's light pool) holds:
- All five pictures stacked in one grid cell (`width: min(76%, 66vh)`, `.feather`).
- `i.stage__glow[data-glow]`, at opacity 0.6 when `data-active="3"` (CSS transition 0.7s).
- A top row with the floor label and "0N / 05".
- A bottom row on the left with the five tick buttons (`aria-label="0N {index}"`) and "Illustrations, not specific stock". The right side stays empty for the concept banner.

Behaviour, created inside `gsap.matchMedia('(min-width: 961px)')`:
- Per chapter, `ScrollTrigger` `start: 'top 55%', end: 'bottom 55%'`, `onToggle` when active with `self.direction` (`dir`):
  - The old picture goes to `opacity 0, yPercent -9·dir, scale .94` (0.6s `expo.out`).
  - The new one comes from `yPercent 12·dir, scale 1.05` to rest (1.1s `expo.out`).
  - The number and floor label roll: out to `yPercent -100·dir` (0.2s), text swapped, in from `100·dir` (0.55s `expo.out`).
  - `data-active` is set.
- Each tick's fill scrubs `scaleX` 0 → 1 over its chapter.
- Clicking a tick runs `lenis.scrollTo(chapter, { duration: 1.4 })`.
- The active picture's `img` drifts `yPercent 5 → -5` and `rotation -1.2 → 1.2`, scrubbed over its chapter.

- [ ] **Step 1: Write `StageSwitcher` and the wide-screen CSS.**
- [ ] **Step 2: Verify.**
  - Run: `pnpm typecheck && pnpm lint`.
  - Shots at 1440 × 900 of `#solar,#cooling,#light,#upstairs`, then `#light` again from below (`y=99999,#light`). Expected: the matching product and "0N / 05" each time, warm light on 04, "Second floor" on 05, and the picture entering from above when scrolling up.
  - Run `js=document.querySelectorAll('.stage__ticks button')[2].click()` then a 2s wait, then `js=document.querySelector('.stage').dataset.active`. Expected: `"2"`.
  - At 390 × 844 the stage is not displayed and each chapter shows its own picture.
- [ ] **Step 3: Commit:** `Hold one product stage beside the chapters on wide screens`.

### Task 8: Loader, hero entrance and the "In the store" list

**Files:**
- Create: `components/home/intro.ts`, `components/home/Loader.tsx`, `components/home/HeroMotion.tsx`, `components/home/HeroIndex.tsx`
- Modify: `app/layout.tsx` (head script), `app/page.tsx` (`<Loader line={HOME_COPY.hero.title} />` first, `<HeroMotion />` inside `#hero`), `components/home/Hero.tsx` (the list becomes `<HeroIndex items={HOME_COPY.chapters.map((c) => ({ id: c.id, number: c.number, name: c.index, image: c.image }))} />`), `app/styles/home.css`

**Interfaces:**
- Produces:
  - `introDone: Promise<void>` and `finishIntro(): void` in `components/home/intro.ts` (module scope, so a client navigation back finds it resolved).
  - `Loader({ line }: { line: string })` (client).
  - `HeroMotion(): null` (client).
  - `HeroIndex({ items }: { items: { id: ChapterId; number: string; name: string; image: string }[] })` (client).

The head script, exactly:

```js
(function(){var d=document.documentElement;d.classList.add('js');
try{var c=navigator.connection;if(location.pathname==='/'&&!sessionStorage.getItem('jontai-loader')&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!(c&&c.saveData))d.classList.add('is-loading')}catch(e){}})()
```

Loader:
- Styling: `.loader { display: none }`, and `html.is-loading .loader` is fixed, full-screen, forest, below the concept banner. `html.is-loading` hides overflow.
- Markup (both `aria-hidden`): two identical layers. The top row is the brand and "Cumana 73 · Oranjestad" (hidden ≤520px). The bottom row is `<span data-count>0</span><small>%</small>` and `line`. The second layer is sand with forest text and starts at `clip-path: inset(100% 0 0 0)`. A 2px mint edge with a glow sits at the fill line.
- On mount: if `html.is-loading` is not set, call `finishIntro()` and stop.
- Otherwise:
  - Fade the first layer's top and line in (0.7s, 70ms stagger).
  - Tween a level `p` to 86 over 1.35s (`power2.inOut`, 0.15s delay). Each update sets the clip to `inset({100-p}% 0 0 0)`, moves the edge to `(1 - p/100)·innerHeight`, and sets both counts.
  - Wait for `Promise.race([Promise.all([document.fonts.ready, the window load event]), a 4000ms timeout])`.
  - Tween `p` to 100 over 0.45s (`power2.out`) and fade the edge out (0.2s).
  - After 0.15s, lift the sand layer's content (`yPercent -60, opacity 0`, 0.6s `expo.out`, 50ms stagger).
  - 0.3s before that ends: set `sessionStorage['jontai-loader'] = '1'`, remove `is-loading`, start Lenis, refresh ScrollTrigger and call `finishIntro()`.

HeroMotion:
- CSS starting states, only under `html.js` and no-preference: `#hero [data-hero]` at `opacity 0; translateY(22px)`, and `#hero .wordmark .ci` and `#hero h1 .wi` at `translateY(110%)`.
- After `introDone`, one timeline (`expo.out`):
  - Letters rise from 0s (1.25s, 55ms stagger).
  - Meta items from 0.15s (0.8s, 60ms).
  - h1 words from 0.3s (1.05s, 45ms).
  - Lead and actions from 0.55s (0.9s, 80ms).
  - List items from 0.45s (0.8s, 50ms).
- Exit: each `#hero .wordmark .c` goes to `yPercent: -38 - i * 13`, scrubbed from the hero's top at the top of the screen to its bottom at the top.

HeroIndex:
- The "In the store" label and an `ol` of anchor rows `#{id}`: number, name, and an arrow rotated 45° that turns to 0 on hover.
- Pointer only:
  - Hovering the list dims the other rows to 0.32 and shifts the hovered name 12px.
  - A fixed `.peek` disc (`clamp(200px, 17vw, 270px)`, the stage-coloured radial gradient, holding the five feathered pictures) follows the pointer at `xPercent -112, yPercent -50` with `quickTo` (0.55s `power3`). It tilts `clamp(-10, 10, dx · 0.8)°` and settles to 0 after 90ms without movement.
  - It enters at `scale 1, opacity 1` (0.5s `expo.out`) and leaves to `scale .5, opacity 0` (0.3s).
  - The hovered row's picture is shown (0.25s opacity crossfade).

- [ ] **Step 1: Write `intro.ts`, `Loader`, the head script and the loader CSS.**
- [ ] **Step 2: Write `HeroMotion`, `HeroIndex` and their CSS.**
- [ ] **Step 3: Verify.**
  - Run: `pnpm typecheck && pnpm lint && pnpm build`.
  - Shots at 1440 × 900: `t=500,t=1100,t=1700,t=2300,t=2700,t=4600`. Expected: the charge climbing with the numbers changing colour at the edge, a sand screen at 100%, then the hero letters rising and the full hero by 4.6s.
  - The same at 390 × 844. Expected: the brand on one line.
  - A second load in the same tab: `t=5000,js=location.reload(),wait=300,js=document.documentElement.classList.contains('is-loading')`. Expected: `false` (no loader), and a capture at `wait=2500` shows the full hero.
  - Reduced motion: `media=reduce,wait=500,js=[getComputedStyle(document.querySelector('.loader')).display,[...document.querySelectorAll('#hero [data-hero]')].every(e=>getComputedStyle(e).opacity==='1')]` in a fresh run. Expected: `['none', true]`.
- [ ] **Step 4: Review Focus 2 (coming back home in the same visit).** Run from `/` with `t=5000,js=location.href='/quote',wait=3000,js=document.querySelector('.nav a.brand').click(),wait=300,js=document.documentElement.classList.contains('is-loading'),wait=2500,js=[...document.querySelectorAll('#hero [data-hero]')].every(e=>getComputedStyle(e).opacity==='1'),#solar`. Expected: `false`, then `true`, and the `#solar` capture shows its heading risen. Then `js=history.back(),wait=1500,js=history.forward(),wait=2000,js=__st.getAll().length` matches the count on a fresh home load.
- [ ] **Step 5: Commit:** `Open the home page with a charging loader and a rising hero`.

### Task 9: Rewards with the 3D card

**Files:**
- Modify: `components/sections/Loyalty.tsx`, `components/sections/LoyaltyCard.tsx` (stamp pop), `components/sections/MemberLogin.tsx` (drop `glass`)
- Create: `app/styles/rewards.css` (the "Loyalty" section and member-dialog rules moved from `globals.css` and restyled)
- Modify: `app/globals.css` (remove them)

**Interfaces:**
- Consumes: `Words` (Task 3); `REWARD_STEP_AFL`, `REWARD_PER_STEP_AFL`, `formatAfl` and the rest of `lib/loyalty.ts`; `data-draw="once"` (Task 4)
- Produces: no new exports.

Layout (spec, "Rewards"):
- Left: the "Jontai Rewards" label, then `h2[data-words]` = `Words "Spend Afl. 500."` and `<em>` (green ink) holding `Words "Get"`, `span.mark` (`Words "Afl. 25"` plus an SVG underline path with `pathLength="1"` and `data-draw="once"`) and `Words "back."`. Then the reset line, the in-store membership line, and `MemberLogin` and "Visit the store".
- Right: the card with the Regular / Business switch (no `glass`), the points field, the slider and the readout.
- Below: the two programs as ruled columns.
- The card in forest with sand type. `.lcard__stamp[data-state="earned"]` plays a 0.5s keyframe pop from `scale(.7)` (`cubic-bezier(0.34, 1.56, 0.64, 1)`), and is static under reduced motion.

Auto-run: on mount, unless reduced motion is on or the section's top is already above 65% of the screen, set points to 0. A `ScrollTrigger` (`start: 'top 65%', once: true`) then tweens a proxy from 0 to 1,250 over 1.8s (`power2.out`), calling the existing `set()` with values rounded to 50.

- [ ] **Step 1: Restyle and rewire `Loyalty`, the card and the member dialog.**
- [ ] **Step 2: Verify.**
  - Run: `pnpm typecheck && pnpm lint && pnpm test`.
  - Shots at 1440 × 900 and 390 × 844 of `#rewards`, then `wait=2500,#rewards`. Expected: two stamps earned, "Afl. 50 in vouchers", the underline drawn, no glass.
  - Turn the card with `js=document.querySelector('input[value="business"]').click()`. Expected: the business face.
  - Open Member login and submit it empty. Expected: the existing shake and messages.
- [ ] **Step 3: Commit:** `Restyle rewards around the 3D loyalty card`.

### Task 10: Product panel and quote page without glass

**Files:**
- Create: `app/styles/panel.css`, `app/styles/quote.css` (the "Product panel" and "Quote page" sections moved from `globals.css`)
- Modify: `app/globals.css` (remove those sections and the whole "Glass" section), `app/tokens.css` (remove the glass tokens), `components/catalog/CategoryDrawer.tsx` and `components/quote/ProductPicker.tsx` (drop `glass`), `components/catalog/ProductView.tsx` (product pictures on the stage colour with `.feather`), `app/quote/page.tsx` (drop `backdrop`)

Panel: a solid sand sheet sliding in from the right, ruled sections with no boxes, figures in narrow caps, and buttons as in Task 3. Quote page: sand, the form ruled into its two parts, solid fields with a 1.5px ink rule underneath, and the picker menu solid sand.

- [ ] **Step 1: Move and restyle the CSS and drop the classes.**
- [ ] **Step 2: Verify.**
  - Run: `pnpm typecheck && pnpm lint && pnpm build`. Then `rg -n "glass|backdrop-filter|\.backdrop" app components` should print nothing.
  - Shots at 1440 × 900 and 390 × 844: open the inverter panel from chapter 01 (`js=document.querySelector('#solar .textlink').click()`), the furniture panel from 05, and `/quote?for=generator`. Expected: solid surfaces, feathered pictures, and the generator preselected with the delivery field showing.
- [ ] **Step 3: Commit:** `Drop glass from the product panel and quote page`.

### Task 11: Cleanup, documents and the full check

**Files:**
- Modify: `app/globals.css` (only imports and page basics remain; its header comment names this direction), `PRODUCT.md`, `docs/content-placeholders.md` (if a placeholder changed), `docs/superpowers/specs/2026-10-27-type-led-redesign-design.md` (only if the build settled something it left open)
- Delete: `public/mockups/`

PRODUCT.md updates:
- Capabilities: Archivo; no film; GSAP and Lenis as now.
- Brand Commitments: the type line, and a direction entry for 2026-10-27 that names nexdash.com and sedlecky-kaolin.com and supersedes "One day of Aruban sun".
- Accessibility: remove the film-stills and cursor-sun sentences; state the reduced-motion, Save-Data and no-JS behaviour from the spec.

- [ ] **Step 1: Prune `globals.css`, delete the mockups and update the documents.**
- [ ] **Step 2: Full check.**
  - Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`. Expected: all pass.
  - On the dev server, shots at 1440 × 900, 768 × 1024 and 390 × 844 of the loader frames and every section (`t=500,t=1700,t=4600,.intro,#solar,#cooling,#backup,#light,#upstairs,.numbers,#rewards,#visit,y=99999`), plus `/quote` top and bottom.
  - Expected: matches the mockup's look; no text fades out on the way down; no product edge on the stage; no sideways scroll; no page exceptions.
  - Reduced motion: `media=reduce` then the same section targets. Expected: no loader, everything in place, the card at 1,250 points.
  - JavaScript off: `nojs,t=3000` then the section targets. Disabling page scripts leaves the tool's own scrolling working; if it does not, check in the browser pane with JavaScript off. Expected: every section's text visible and no loader.
- [ ] **Step 3: Commit:** `Finish the type-led redesign: docs and cleanup`.

---

## Round 2 (owner changes, 2026-10-28; spec section "Round 2")

Checks run through `tools/shots/shoot.mjs` against the worktree's dev server on `http://127.0.0.1:3300`, as in Round 1. Each task ends with `pnpm test && pnpm typecheck && pnpm lint` and a commit.

### Task 12: Copy and content
**Files:** `data/products.json`, `lib/products.ts` (statement points gain an optional `team` flag), `lib/home-copy.test.ts`, `app/layout.tsx` (title), `docs/content-placeholders.md`
- Statement points: Family-owned (`FAMILY_LINE` text, `team: true`), Delivery, Talk to a person.
- LED: blurb "Bulbs, LED strips, panels, tubes and floodlights."; `carries` and the range gain LED strips (picture: `public/catalog/led-strip.webp`, rendered for this, square, on the catalogue backdrop); chapter 04's lead names LED strips.
- Title: `Jontai Energy | Smart Lights Smart Savings`.
- Test first: `the lighting copy names LED strips` (chapter 04 lead and the led category's range) and `the family-owned point leads the statement`.

### Task 13: Glass
**Files:** `app/tokens.css` (glass tokens), `app/styles/ui.css` (`.glass` treatment and the glow helper), `shell.css`, `home.css`, `panel.css`, `rewards.css`, components that take the class.
- Check: computed `backdrop-filter` on the header, menu, panel, member dialog, stage capsules and visit panels; solid under `prefers-reduced-transparency`.

### Task 14: Calmer hero, the "In the store" band, family-owned note, Support link
**Files:** `components/home/Hero.tsx`, new `components/home/InStore.tsx` (the list and disc band), `components/home/Statement.tsx`, `components/ui/Header.tsx`, `app/page.tsx`, `home.css`, `shell.css`.
- Check: the hero holds no list; the band follows it; the statement's first point reads Family-owned with "Meet the team · Coming soon" not focusable; the header's right link reads Support and goes to `/support`.

### Task 15: `/support`
**Files:** new `app/support/page.tsx`, `components/support/*` as needed, `app/styles/support.css`, `components/sections/Footer.tsx` (FAQ → `/support#questions`), `components/sections/Visit.tsx` (a "More in Support" link).
- Check: the page renders its four sections and contact block at 1440 and 390; the copy test extends to support copy (no installation promise, no prices).

### Task 16: Snap
**Files:** `components/home/ChapterSnap.tsx` (Lenis Snap, proximity, chapters only, off with reduced motion), `components/home/Showroom.tsx`.
- Check: stopping a few hundred pixels past a chapter's start settles onto it; stopping mid-chapter (far from a start) does not move.

### Task 17: The 3D bulb
**Files:** `package.json` (`three`, `@types/three`), new `components/home/Bulb3D.tsx` (lazy three.js scene), `components/home/kelvinBus.ts` (slider → scene), `components/home/KelvinSlider.tsx`, `components/home/StageSwitcher.tsx` and `Showroom.tsx` (the bulb item), `home.css`.
- Check: the canvas renders a bulb at desktop and phone; dragging turns it; the slider changes the filament colour; without WebGL the picture shows; it renders nothing while off screen.

### Task 18: Docs and full check
`PRODUCT.md` (glass accent, snap, 3D bulb, Support page), then the full check at 1440/768/390, reduced motion and no-JS, and a fresh whole-branch review of the round.
