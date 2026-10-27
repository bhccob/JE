# One day of Aruban sun: home page design

Approved by the owner on 2026-10-26 (concept A of three, Blender plus Higgsfield production, the bulb slider and the day/night switch). Style frames approved before the full render.

## Why

The v2 page was rejected as plain: real-time Tripo models on flat mint fields, the same layout in every chapter, nothing carrying the eye from one product to the next, and motion too quiet to notice. The Seedance "inside the store" staircase clip was rejected because it looks nothing like the real store. The owner pointed at mdebeauty.com and fitosauna.com; both get their premium feel from photoreal pre-rendered frame sequences scrubbed by scroll, one continuous set and light, pinned moments where scroll is the playhead, and copy choreographed to the picture.

## What it is

One continuous film of an Aruban day on one lime-plaster wall with a divi-divi shadow. Scroll moves the sun; each product appears at its hour:

| Chapter | Hours | Product moment |
| --- | --- | --- |
| dawn (hero) | 05:30 to 09:00 | The panel catches first light; a sunrise plays once on load and the hero rests on the golden frame |
| noon (#shop) | 09:00 to 13:00 | Current runs along the skirting and up into the inverter; datasheet figures |
| heat | 13:00 to 15:00 | The solar AC switches on, airflow strands; brochure figures |
| afternoon | 15:00 to 17:30 | The power station's screen and light bars come up; spec-sheet figures |
| dusk | 17:30 to 20:00 | Three filament bulbs light one by one; the close-up hands over to the 3000K to 6500K slider |
| night | 20:00 to 22:30 | The solar camera pans; the oak ledge washes the wall |
| outage | 22:30 to 05:30 | Lights flicker out, the generator's light blinks on, the night passes |
| morning (#upstairs) | 05:30 to 07:00 | The camera climbs past the oak soffit into dawn upstairs: sofa, chair, lamp, the divi-divi shadow again |

Then loyalty (sun ring and sun stamp), visit (hours on a sun arc), footer.

## Rules that do not bend

- Retail only; the service line and delivery line verbatim; no installation implied.
- Afl. for every amount; figures only from the supplied Namkoo documents; no prices, stock, warranties or savings.
- Every control does something real (product panel, quote request by email, anchors, directions).
- The renders are illustrations, never presented as the store; still images carry "Rendered illustration" alt text.
- Reduced motion, Save-Data and no-JS get one still per chapter with its copy; the slider still works.

## How it is built

- `tools/blender/film/`: `build.py` (set, products, lights, cameras), `film.py` (sun, sky, exposure, camera path and every moving part as a function of film position), `render.py` and `render-all.sh` (Cycles on the GPU, desktop 1920x1080 and phone 1080x1440, plus eight bulb stills), `publish.mjs` (webp frames and posters into `public/film`).
- `lib/film.ts` holds the chapter manifest (hours, frame counts) shared with `film.py`; `lib/kelvin.ts` the colour-temperature maths. Both are covered by `node --test`.
- `components/film/`: `DayFilm` (one sticky canvas; a chapter's film runs from 'top bottom' to 'bottom bottom' so each product lands while its copy is held), `Chapter` (copy beats by progress), `KelvinBulb`, `SunDial`, `store.ts`, `frames.ts`.
- No pinning: Lenis on the GSAP ticker, ScrollTrigger only reads progress.
- Product holds (owner request, 2026-10-27): each product chapter rests on its last frame for 0.9 of a screen (the bulb for 1.2), shows a "See product info" marker on the product (positions from `tools/blender/film/spots.py`, placed through the canvas cover crop) and a quiet "Scroll to continue". When scrolling comes to rest inside a hold or just short of it, the page glides to the hold's middle; it never pulls back once the visitor has moved past.
- Product panels and quotes (owner request, 2026-10-27): "See product info" on the inverter, solar AC, power station, camera and generator opens that one product told in full (picture, what it does, figures from its document, four points, the full datasheet behind a disclosure); on furniture it opens how delivery works. Solar and LED still show the range. Every "Ask about" button became "Request a quote", which opens `/quote` with the product chosen; the form emails the store (`app/api/quote`, Resend) and falls back to the visitor's email app when sending is not set up.

- Glass (owner request, 2026-10-27, then "less box styling" the same day): glass is a treatment, not a box. The header is a floating glass bar; the product panel, the dropdown menu, the loyalty card, the sun dial and the marker labels are glass. The film's copy has no panes: behind it the film turns to frosted glass with no edge (a blurred, softened band that fades back to the clear picture), and the hero keeps its plain wash. Loyalty, visit and the quote page sit on a fixed backdrop of the plaster wall and its divi-divi shadow, rendered without products by `tools/blender/film/backdrop.py` and graded to the palette by `backdrop-publish.mjs` (`public/film/backdrop/`); their lists stay ruled, not boxed, and the quote fields are frosted. Glass turns solid with reduced transparency or without backdrop blur.

- Member login (owner request, 2026-10-27): loyalty gains a "Member login" button and the line that membership is opened in store, where the loyalty card is collected. The login dialog asks for the loyalty code on the card and the name, like the current site, and is a placeholder: it checks the fields and says plainly that nothing was sent until the points lookup is connected.

- Day colours only (owner, 2026-10-27): the day/night switch and the evening theme are gone; the film still turns to dusk and night on its own as you scroll. The header bar puts the wordmark and the directions pill at its two ends with the links centred. Loyalty lists the two programs as the current site states them.

- Loyalty card (owner request, 2026-10-27): the calculator became the loyalty card itself, in CSS 3D (`components/sections/LoyaltyCard.tsx`): it rests at an angle, leans toward the pointer with a moving highlight, and turns over between the regular face (ten sun stamps to 5,000 points, Afl. 25 each) and the business face (a ring to 5,000 points and 10% off), chosen with a Regular / Business switch and a points slider. The member login shows the same card filling in as the member types, shakes when a field is missing and turns over to say nothing was sent. Loyalty keeps the wall backdrop; Visit now sits apart on its own sand surface. Furniture follows Products in the header.

## Left to the builder

Frame counts per chapter, beat timings, scrim strength and exact camera keys, judged on rendered screenshots at desktop, tablet and phone sizes.
