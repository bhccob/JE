# Jontai Energy: one day of Aruban sun

The website for Jontai Energy, a retail store at Cumana 73, Oranjestad, Aruba, selling solar, power, LED lighting, solar cameras and everyday essentials, with furniture on the second floor.

The home page is one film of an Aruban day. As you scroll, the sun crosses a lime-plaster wall and each product appears at its hour doing its job: the panel at dawn, the inverter at noon, the solar air conditioner in the heat, the power station in the afternoon, the LED bulb at dusk, the solar camera at night, the generator in a power cut, and the furniture upstairs the next morning. After the film come loyalty and the store's visit details. A separate page takes quote requests by email.

The store sells; it does not install. That rule runs through all the copy (`SERVICE_LINE` in `lib/store.ts`).

**Stack:** Next.js 14 (App Router, TypeScript), plain CSS on design tokens, GSAP ScrollTrigger and Lenis for scrolling, Motion for the product panel, Phosphor icons, pnpm. The film is pre-rendered in Blender (Cycles), not real-time 3D.

## Getting started

You need Node 22.18 or newer (the tests run TypeScript directly; it is developed on Node 24) and pnpm 9.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

```bash
pnpm build        # production build
pnpm start        # serve the production build
pnpm lint
pnpm typecheck
pnpm test         # node --test on the logic in lib/
```

## Environment

Copy `.env.example` to `.env.local` and fill in what you need.

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The public address, for example `https://www.jontaienergy.com`. The base for page metadata and the URL in the store's JSON-LD. |
| `RESEND_API_KEY` | Turns on quote emails, sent through [Resend](https://resend.com). |
| `QUOTE_FROM` | The sender, an address on a domain verified in Resend, for example `Jontai Energy website <quotes@your-domain.com>`. |
| `QUOTE_TO` | Where quote requests go. Defaults to the store email in `lib/store.ts`. |

Without `RESEND_API_KEY` and `QUOTE_FROM`, the quote form still works: it tells the visitor it could not send, and offers the same message in their own email app. It never claims a request went through when it did not.

## Pages

| Route | What it is |
| --- | --- |
| `/` | The day film, then loyalty, visit and the footer |
| `/quote` | Quote request by email. `?for=inverter` (or `generator`, `furniture` and so on) preselects the product; the product panels and chapters link here that way |
| `/api/quote` | Checks a quote request and emails it to the store (see Environment) |

## How it is put together

```
app/                     layout, the home page, /quote and /api/quote; tokens.css, base.css, globals.css
components/
  film/                  the day film: DayFilm (one sticky canvas), Chapter, DayChapters (the copy),
                         ProductSpot (the "See product info" marker), KelvinBulb, SunDial
  catalog/               the product panel: CategoryDrawer, ProductView, CatalogProvider
  quote/                 QuoteForm, ProductPicker (the product dropdown), StoreCard
  sections/              Loyalty, LoyaltyCard (the 3D card), MemberLogin, Visit, Footer
  ui/                    Header, RevealObserver
lib/                     film, kelvin, loyalty, quote, store and contact logic, with tests beside them
data/products.json       categories, product panels, datasheets and the film's copy
public/film/             the rendered frames: d/ (desktop 1920x1080), m/ (phone 1080x1440), kelvin/, backdrop/
public/catalog/          catalogue pictures for the product panels
tools/blender/film/      the Blender set, the film and the scripts that render and publish it
docs/                    the design spec and the list of content to confirm
```

### The film

- **Playback.** `DayFilm` draws pre-rendered webp frames on one sticky canvas. Each chapter's scroll progress picks a frame, crossfading between neighbours while scrolling. Frames load chapter by chapter, current and next first. `lib/film.ts` holds the manifest: hours, frame counts and marker positions.
- **Product holds.** Each product chapter rests on its last frame for most of a screen. A "See product info" marker appears on the product. If scrolling stops inside a hold, or just short of one, the page glides onto the product; it never pulls the visitor back once they have scrolled past.
- **Fallbacks.** With reduced motion, Save-Data or no JavaScript, each chapter becomes one still with its copy over it. The bulb slider still works.

### The product panel

Opened from the markers, the chapter buttons and the footer.

- **Single products:** the inverter, solar air conditioner, power station, camera and generator are told in full. Their figures come only from the supplied Namkoo documents, with the full datasheet behind a disclosure.
- **Furniture:** explains how delivery works.
- **Solar and LED:** show the range the store carries.

All of it lives in `data/products.json`, under `panels` and `categories`.

### Loyalty

- **The card.** `LoyaltyCard` is the loyalty card in CSS 3D. It leans toward the pointer and turns over between the regular face (ten Afl. 25 stamps up to 5,000 points) and the business face (a ring to 5,000 points for 10% off). The rules live in `lib/loyalty.ts`.
- **Member login.** `MemberLogin` asks for the loyalty code on the card and the member's name, as the current site does. It is a placeholder: it checks the fields and says plainly that nothing was sent. To connect a real points lookup, set `LOOKUP_URL` in `components/sections/MemberLogin.tsx`, or add a server route, and show the result in the dialog.

### Store facts

Hours, phone, WhatsApp, email, social links and the directions link are all in `lib/store.ts`. Edit them there and every page follows. The "Open now" line works in Aruba time (UTC-4) and does not know about public holidays.

## Changing content

| To change | Edit |
| --- | --- |
| Chapter copy, figures, product panels, datasheets | `data/products.json` |
| Hours, phone, email, address | `lib/store.ts` |
| Loyalty rules | `lib/loyalty.ts` and the program text in `components/sections/Loyalty.tsx` |
| Quote topics in the dropdown | `QUOTE_TOPICS` in `lib/quote.ts` |
| Catalogue pictures | `public/catalog/`, same file names, square |
| Colours, type and spacing | `app/tokens.css` |

Anything still to confirm before launch (delivery details, the points rate, the bulb colour range and so on) is listed in `docs/content-placeholders.md`.

## Rebuilding the film in Blender

You only need this if a product, a camera move or the light changes. It needs Blender 5.2 with an NVIDIA GPU for Cycles OptiX. The scripts look for Steam's Blender at `C:\Program Files (x86)\Steam\steamapps\common\Blender\blender.exe`; set `BLENDER` to use another one.

The renders (`tools/blender/film/out/`) and the scene (`day.blend`) are git-ignored and are rebuilt by these scripts.

```bash
# 1. Build the set (wall, floor, products, lights, cameras) into day.blend
blender -b --factory-startup -P tools/blender/film/build.py

# 2. Render every chapter for desktop and phone, plus the bulb stills (resumable)
bash tools/blender/film/render-all.sh
#    or only some chapters after a change:
bash tools/blender/film/render-some.sh dusk night kelvin

# 3. Convert the renders into the webp frames and posters the site plays
node tools/blender/film/publish.mjs

# 4. If a product or camera moved, print the marker positions and paste them into lib/film.ts
blender -b tools/blender/film/day.blend -P tools/blender/film/spots.py

# 5. The wall backdrop behind loyalty and the quote page (render, then grade to the palette)
blender -b tools/blender/film/day.blend -P tools/blender/film/backdrop.py -- day d
blender -b tools/blender/film/day.blend -P tools/blender/film/backdrop.py -- day m
node tools/blender/film/backdrop-publish.mjs
```

`film.py` poses everything for a point in the day: sun, sky, exposure, camera path and each product's animation. `lib/film.ts` and `film.py` each list the chapters and their frame counts; keep the two in step.

## Design notes

The palette is pinned by the owner: sand `#F7F5EC`, light green `#B8D8A8`, fresh green `#79AE72`, forest `#173D2C`, ink `#183128`, warm wood `#B78455` and light oak `#D8B98E`. Type is Gambetta for display and Hanken Grotesk for body.

Frosted glass is used as a finish (the header bar, product panel, dropdown and loyalty card), not as boxes around everything. The site is in day colours only; the film itself turns to dusk and night as you scroll. The full design record is in `docs/superpowers/specs/2026-10-26-one-day-of-sun-design.md`.

## The old static site

`index.html`, `pages/`, `assets/` and `update-i18n*.ps1` are the previous static site. Next.js ignores them: `pageExtensions` only picks up `.ts` and `.tsx`, and lint is scoped to `app/`, `components/` and `lib/`. Remove them once the new site is live.
