# Type-led redesign: home page and site shell

Direction approved by the owner on 2026-10-27 from mockup v2 (`public/mockups/home-redesign-v2.html`). It replaces the "One day of Aruban sun" film direction (`2026-10-26-one-day-of-sun-design.md`) on the home page, and the glass treatment everywhere.

## Why

The owner's verdict on the scroll film: the 3D does not look high quality or premium enough, and the store has few good photographs of itself. So big, easy-to-read type carries the page instead of pictures.

The owner pointed at two sites:

- **nexdash.com**: big, clear text; calm, clean 3D that never feels laggy; every scroll feels intentional, and you never scroll past text you have not finished reading.
- **sedlecky-kaolin.com**, especially the end of the page: big narrow numbers, line icons and labels sit straight on a warm surface with faint contour lines and thin rules, with no box styling. That is why it does not look generic or AI-made. The page is long, but you can read it and it never feels slow.

What the owner wants to fix in the current home page: its copy fades in and out as the film plays, so visitors scroll past text before they have read it.

## Goals

- The type is the hero: big, high-contrast and readable on a phone.
- Every scroll lands on one thing to read. Once text has appeared, it stays.
- Motion that feels premium and intentional, with the page always moving at the visitor's own speed.
- No box or card styling. Separation comes from full-bleed colour fields, thin rules and space.
- A branded loader that hands off cleanly to the hero.
- Products shown as clean objects on a plain colour, with no visible box around them.

## Non-goals

- New product photography or new 3D renders. The catalog renders in `public/catalog/` are the product pictures.
- Any change to the legacy static site (`index.html`, `pages/`, `assets/`).
- New features. Quotes, product panels, rewards, visit and the concept banner carry over; nothing is added beyond what this document names.
- Prices, stock levels or a checkout.

## Anti-goals (a failure even if it technically works)

- Text that fades out, slides away or is covered while someone is reading it.
- Scroll hijacking: pinned sections that hold the page, scroll snapping, or slowed scrolling.
- Cards, boxed panes or glass.
- A product render that shows the edge of its square backdrop.
- Motion that stutters on a mid-range phone.
- Anything implying installation, any invented spec, or a render presented as the store or as specific stock.

## Reference

The approved mockup is the visual and motion reference: `public/mockups/home-redesign-v2.html`, served at `/mockups/home-redesign-v2.html` by the dev server (or by the `jontai-mockups` entry in `.claude/launch.json`). Its sizes, colours, curves, durations and copy are the starting values. `home-redesign.html` (v1) is a static earlier step, kept only for comparison. Both files are throwaway and are deleted when the build lands.

## Look

### Colour

The owner's pinned palette is unchanged; this design gives each colour a role.

| Token | Value | Role |
| --- | --- | --- |
| sand | `#F7F5EC` | The page |
| ink | `#183128` | Text on sand |
| forest | `#173D2C` | Dark fields (products, visit), solid buttons, the wordmark |
| deep | `#0F281D` | Footer |
| stage | `#EEE6D8` | Behind every product render; matches the renders' own backdrop |
| oak | `#D8B98E` | The furniture chapter (upstairs) |
| fresh green | `#79AE72` | Status dot, filled reward stamps, underline |
| green ink | `#3D7443` | Green text on sand (fresh green is too light for text) |
| light green / mint | `#B8D8A8` | Lines and accents on forest |

### Type

One family, **Archivo** (variable, width 62 to 125, weight 300 to 900, OFL), loaded with `next/font/google` and its `wdth` axis. It replaces Gambetta and Hanken Grotesk.

| Role | Setting |
| --- | --- |
| Display headings | weight 800, tracking -0.038em, line height 0.96, sentence case |
| Fitted words | weight 800 (narrow width 62 for CUMANA 73), sized by script to fill their row exactly: JONTAI (hero), CUMANA 73 (visit), JONTAI ENERGY (footer). Re-fitted on resize and when fonts finish loading. |
| Labels | width 62, weight 700, uppercase, tracking 0.09em, 16px |
| Big figures | width 62, weight 800, tabular numbers |
| Body | 18px / 1.5 (17px on phones); leads 18 to 22px |

### Surfaces and controls

- No cards. Lists are ruled. Sections change by colour field.
- Product renders sit on the stage colour with feathered edges (a CSS mask that fades the outer 10 to 13% of the square), so no edge shows.
- Buttons are pills: solid forest, outline, and sand on dark. On hover the fill slides up from the bottom. A press scales the button to 0.97. Text links have a 2px mint or forest underline.
- Faint contour lines (generated SVG, 8 to 12% opacity) sit behind the numbers and visit sections.

## The home page, top to bottom

| # | Section | Content | Anchor |
| --- | --- | --- | --- |
| 0 | Loader | Dark green screen, the brand, "Cumana 73 · Oranjestad", a giant percentage, "Aruba sunlight, made useful." | |
| 1 | Header | Logo and name; links Solar, Power, Lighting, Furniture, Rewards, Visit; "Get a quote" (to `/quote`); "WhatsApp us" pill. On phones: logo and a Menu button. | |
| 2 | Hero | Meta row (Cumana 73, Oranjestad · Family-owned · live open/closed line); JONTAI full width; "Aruba sunlight, made useful." with "Explore solar" and "Visit the store"; on the right, the "In the store" list of the five chapters (stacks under the copy on phones). | `#top` |
| 3 | Statement | "One store, two floors" label; "Power on the ground floor. Furniture one flight up." then the family line in a lighter tone; three ruled points: Delivery (the delivery line verbatim), Talk to a person, Rewards. | the Delivery point is `#delivery` |
| 4 | Showroom | Five chapters, each a screen tall: forest text field on the left, one shared product stage on the right (desktop). Furniture switches to oak. | `#solar`, `#cooling`, `#backup`, `#light`, `#upstairs` |
| 5 | Numbers | "Jontai at a glance": 2 floors, 5 ranges, 7 days a week, on contour lines | |
| 6 | Rewards | "Spend Afl. 500. Get Afl. 25 back." in huge type; see Rewards below | `#rewards` |
| 7 | Visit | Forest field; CUMANA 73 full width; Oranjestad, Aruba; ruled columns for hours with the live open/closed line, contact (phone, WhatsApp, email) and the service line verbatim; today's four FAQ answers as a ruled list of disclosures (`#faq`); Get directions, WhatsApp us, Request a quote. Today's small sun arc goes. | `#visit` |
| 8 | Footer | Centred narrow-caps links, social icons, a huge JONTAI ENERGY in forest on deep, the fine print and the concept line | |

### Chapter copy and actions

The copy is the mockup's, drawn from the existing product data. Every figure comes from a supplied document, and each chapter keeps its source note.

| Chapter | Heading | Figures | Opens | Quote topic |
| --- | --- | --- | --- | --- |
| 01 Solar and inverters | One wall unit runs the whole house. | 8,000 W rated output · 10 ms to switch to battery · 2 × 5,500 W solar inputs | `inverter` panel; second link to the `solar` range | `inverter` |
| 02 Solar air conditioning | Cooling that runs on sunlight. | 9k–36k BTU, by model · Up to 100% solar · No battery or separate inverter | `solar-ac` panel | `solar-ac` |
| 03 Backup power | Keep the fridge on when the grid drops. | 3,000 W · 2,560 Wh · 4 AC outlets | `power-station` panel; second link to the `generator` panel | `power-station` |
| 04 Lighting and cameras | Light in the colour you like. | the 3000K to 6500K slider instead of figures | `led` range; second link to the `cameras` range | `led` |
| 05 Upstairs | Furniture for every room, one flight up. | the delivery line as a pull quote | `furniture` panel (how delivery works) | `furniture` |

Panels open through the existing `CatalogProvider` / `CategoryDrawer`. Each chapter also keeps a "Request a quote" link to `/quote?for=<topic>`, as today. The copy moves out of the `film` block in `data/products.json` into a home-page block; its shape is the builder's call.

### Rewards

The owner chose on 2026-10-27 to keep the 3D loyalty card, the member login and the business program. The mockup's simpler calculator and stamps are not built.

- **Left:** the "Jontai Rewards" label and the huge statement "Spend Afl. 500. Get Afl. 25 back.", with the second line in green ink and the hand-drawn underline under "Afl. 25". Below it come the reset line, the in-store membership line ("Open your membership in store at Cumana 73 and collect your loyalty card…"), and the actions **Member login** and **Visit the store**. There is no "Join Rewards" button, because membership is opened in store, not online.
- **Right:** the existing `LoyaltyCard` (`components/sections/LoyaltyCard.tsx`). It keeps its regular face (ten sun stamps up to 5,000 points, Afl. 25 each), its business face (a ring toward 10% off), the Regular / Business switch, the points field and slider, the live readout, the lean toward the pointer and the turn-over. It is restyled to this look: no glass, the card itself in forest with sand type, controls as pills and rules.
- **Below:** the two programs as ruled columns, not boxes, with the same wording as today (vouchers cannot be converted to cash; the business reset at the account anniversary).
- `MemberLogin` stays a placeholder dialog, restyled the same way. It still checks the fields and says plainly that nothing was sent.
- All amounts come from `lib/loyalty.ts`.

## Motion

### Rules for all of it

- **Smooth scrolling** uses Lenis on the GSAP ticker: the existing `SmoothScroll` with lerp 0.12 and anchor offset. ScrollTrigger only reads progress. Nothing is pinned, nothing snaps, and nothing changes scroll speed.
- **Entrances play once** and never reverse. Nothing that has appeared fades out on the way down.
- **Properties:** only `transform`, `opacity` and `clip-path` animate.
- **Curves** are the project's tokens: `--ease-out` `cubic-bezier(0.16, 1, 0.3, 1)` (GSAP `expo.out`) for entrances, and `--ease-in-out` `cubic-bezier(0.65, 0, 0.35, 1)` for movement. Scrubbed motion is linear to the scroll.
- **Hover-only effects** (the cursor disc, magnetic buttons, fills) apply only under `(hover: hover) and (pointer: fine)`.
- **Reduced motion:** no loader, no movement and no smoothing. Everything shows in place. The colour slider and the loyalty card still work; the card starts at 1,250 points and switches faces without the turn.
- **Without JavaScript,** everything is visible and there is no loader.

### What moves

| Element | Trigger | Motion |
| --- | --- | --- |
| Loader | First home-page visit of the session (sessionStorage), not under reduced motion or Save-Data | A head script covers the page before first paint. Sand fills the dark green screen from the bottom like a battery charging, with a mint edge line; the percentage and brand are drawn twice so they switch colour as the edge passes. The fill runs to 86% over 1.35s (`power2.inOut`), waits for fonts and window load (given up after 4s), then goes to 100% in 0.45s. The content lifts away (0.6s, 50ms stagger), the loader goes, and the hero entrance starts. The sand screen and the page are the same colour, so there is no cut. |
| Hero entrance | After the loader, or on load when there is none | JONTAI letters rise from below their line (1.25s, 55ms stagger), then the meta row, the headline word by word (1.05s, 45ms stagger), the lead and buttons, and the list rows. |
| Hero exit | Scroll through the hero (scrubbed) | Each JONTAI letter slips back up into its line at its own speed. |
| "In the store" list | Pointer hover | The other rows dim to 0.32 and the hovered name shifts 12px. A sun-coloured disc (about 17vw) follows the cursor just left of it, shows that chapter's product, and tilts with horizontal speed (±10°). Clicking scrolls to the chapter. |
| Header | Scroll | Solid sand after 12px. Hides on the way down once past 70% of the first screen and returns on the way up. An underline glides to the link for the section in the middle of the screen; Solar covers chapters 01 and 02. |
| Headings | Top reaches 88% of the screen, once | Words rise out of their own line (1.05s, 45ms stagger). |
| Paragraphs, labels, controls | Top reaches 90%, once | Fade up 28px over 0.9s, in batches with an 80ms stagger. |
| Rules | Once | Draw left to right over 1.3s. |
| Statement | Scrubbed between its top at 85% and its bottom at 58% | Words go from 14% to full strength in reading order, finishing before the text reaches the middle of the screen. |
| Showroom and Visit fields | Scrubbed from their top entering to their top at 12% | They grow from a rounded inset to full width: 64px top and 4vw sides with a 36px radius, to 0. On phones: 24px, 3vw, 24px. |
| Product stage (desktop) | Each chapter's middle crosses 55% of the screen | The stage stays in place. The old product drops away (0.6s, to 94% scale) and the new one rises in (1.1s, from 105%), both in the direction of scrolling. "01 / 05" and "Ground floor / Second floor" roll to the new values. Five bars along the bottom fill with each chapter's progress and jump to a chapter on click. The active product drifts ±5% and turns ±1.2° across its chapter. Chapter 04 adds the bulb's coloured light. |
| Product pictures (phones) | Scrubbed | Each chapter has its own product picture above its text, which rises slightly as you scroll. |
| Big chapter numerals | Scrubbed | Drift behind the text (parallax). |
| Figures | First seen | Count up from 0 over 1.6s. Single digits stay as they are. Each figure keeps its final width, so nothing shifts. |
| 2 / 5 / 7 | First seen | Roll like an odometer (1.9s, 150ms apart). |
| Contour lines | Scrubbed through the section | Draw themselves in, ring by ring. |
| Rewards | Once, at 65% | The loyalty card's points run from 0 to its default 1,250 over 1.8s, so its stamps fill one by one (each pops in with `back.out`). The hand-drawn underline draws under "Afl. 25". After that the card is the visitor's to play with. |
| CUMANA 73 | Once | Letters rise one by one (1.2s, 45ms stagger). |
| Footer | Desktop at least 961 × 720 | The page lifts off the footer, which is held at the bottom underneath. JONTAI ENERGY rises letter by letter across the last stretch of scroll. On smaller screens the footer scrolls normally and the letters rise as it arrives. |
| Buttons | Pointer | Lean toward the cursor (22% across, 32% down), then spring back (`elastic.out(1, 0.45)`). |
| Colour slider | Input | The bulb's light (`lib/kelvin.ts` maths) washes over the stage through a multiply layer, so the light reaches the edges with no box. |

## Site shell (every Next.js page)

- **Header and footer:** the new design on every page. On other pages, the section links go to `/#section` (the existing `base` prop).
- **Contact links are real, as today:** `tel:`, the WhatsApp link from `lib/contact.ts`, `mailto:`, and directions to `STORE.maps`.
- **Up to 960px wide** (tablets and phones), the page uses the stacked phone layout. From 961px it uses the split layout.
- **The bottom-right corner belongs to the concept banner** while `CONCEPT` is on. Nothing fixed or sticky (such as the stage caption) may sit underneath it.
- **Phone menu:** a full-screen sand sheet with big links, opened by "Menu". (My call; the mockup only shows the button.)
- **Product panel:** the drawer stays and is restyled: solid sand, ruled rather than boxed, no glass, and the product picture on the stage colour with feathered edges.
- **`/quote`:** re-skinned with the new type, colours and buttons. Its layout and behaviour do not change, and the plaster-wall backdrop goes.
- **Concept mode** stays exactly as it is: the banner, noindex, the concept line in link previews and the footer, and nothing sent to the store.

## What goes

- The film on the home page: `components/film/*` (DayFilm, DayChapters, Chapter, Daybreak, SunDial, ProductSpot, KelvinBulb, frames, store), `lib/film.ts` and its test, and `public/film/` (28 MB, including the plaster backdrop). `lib/kelvin.ts` stays; the new slider uses it.
- The head script's film logic (`still`, `before-dawn`). The new loader brings its own before-paint cover.
- The glass treatment and the plaster-wall backdrop.
- The header's Products dropdown. The hero list, the chapters, the footer and the panels reach every category. (My call.)
- The small sun that follows the mouse (`components/ui/CursorGlow.tsx`). The owner chose to drop it on 2026-10-27; the hero list's product disc is now the one cursor moment.
- Gambetta and Hanken Grotesk.
- `tools/blender/` stays in the repository untouched. It is not shipped. (My call.)

## Constraints that carry over

- Copy rules: "Afl." for every amount; never "We install" or anything like it; the delivery line and the service line verbatim.
- Facts only from the supplied documents, with source notes on chapters. Renders are labelled "Illustration, not specific stock".
- Stack: Next.js 14 App Router, TypeScript, plain CSS on tokens, GSAP 3.13 with ScrollTrigger, Lenis 1.3, pnpm. The only new resource is the Archivo font. No other new dependencies.
- **Performance:** the hero is server-rendered text, so the largest paint is text. Images below the hero load lazily. Count-ups and fitted words cause no layout shift.
- **Accessibility:** all copy is real DOM. Text split for animation keeps an accessible name (the original string as a label, or visually hidden text). The loader is `aria-hidden`. Sliders and stage bars are labelled controls. Focus stays visible. Body text meets WCAG AA.

## Documents to update

- `PRODUCT.md`: the direction, type, capabilities (no film), and the accessibility lines about the film, the stills and the cursor sun.
- `docs/content-placeholders.md`, if any placeholder changes.

## How we know it works

- `pnpm test`, `pnpm typecheck`, `pnpm lint` and `pnpm build` pass. Tests cover any new pure logic, such as the figure count-up formatting.
- Screenshots at 1440 × 900, 768 × 1024 and 390 × 844: loader frames and every section, plus reduced motion and no-JS.
- Checks: no text fades out on the way down; no product edge shows on the stage; no sideways scroll at 390px; the header hides and returns; anchors land on their sections; panels and quote links open the right product.

## Left to the builder

- Component breakdown and file layout. Whether `app/globals.css` (3,362 lines) is rewritten or pruned.
- Whether plain fade-ups use the existing `RevealObserver` (CSS transition) or a GSAP batch. Use the cheaper one where it gives the same result.
- Exact sizes and timings, tuned by eye from the mockup's values.
- The shape of the home copy in `data/products.json`.
- The phone menu's details, within this look.

## Calls made in writing this (for the owner to check)

1. The header's Products dropdown goes; categories are reached from the hero list, chapters, footer and panels.
2. Phones get a full-screen sand menu.
3. `/quote` and the product panel are re-skinned to match; their layout and behaviour stay.
4. The film code and its 28 MB of frames leave the app; `tools/blender/` stays untouched.
5. The loader plays once per visit (session), like today's, and never under reduced motion or Save-Data.
6. Chapters 03 and 04 each carry two products (power station and generators; lighting and cameras), each with its own panel link.

## Owner decisions, 2026-10-27

1. Rewards keeps the 3D loyalty card, the member login and the business program, restyled to this look, instead of the mockup's calculator.
2. The sun that follows the mouse is dropped.
