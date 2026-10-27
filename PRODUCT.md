# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Households and small businesses in Aruba who want lower power bills or backup power, plus anyone furnishing a home. They browse on a phone or laptop before driving to the store, and they want to know what is in stock, what it does, and whether it can be delivered.

## Product Purpose

The website for Jontai Energy, a retail store at Cumana 73, Oranjestad. It shows what the store sells and gets people to visit, message on WhatsApp, or request a quote. Success is a visitor who knows which product fits and contacts or visits the store.

## Positioning

One store carries both sides of a home: solar panels, inverters, generators, LED lighting and solar security cameras on the ground floor, and furniture on the second floor. Jontai delivers large items (generators, furniture) to the door. Jontai does not install.

## Operating Context

- No online checkout. Buying happens in the store, over WhatsApp, or through a quote request. No prices are published on the site.
- Loyalty program: spend Afl. 500, get Afl. 25 back (earned per full Afl. 500 block), rewards accumulate, reset after one year of use. Business loyalty is being prepared; no rules exist yet.
- Delivery yes, installation no. Manufacturer documents say inverter wiring needs a licensed electrician and the solar AC needs an HVAC technician.

## Capabilities and Constraints

- Stack: Next.js 14 App Router, TypeScript, plain CSS on design tokens (`app/tokens.css`), Motion (UI), Lenis on the GSAP ticker, GSAP ScrollTrigger (scroll progress, no pinning), pnpm. No live WebGL: the home page is a scroll-scrubbed film of one Aruban day, rendered in Blender Cycles from `tools/blender/film` (build.py builds the set, film.py poses each instant, render-all.sh renders, publish.mjs writes `public/film`). Chapter timing lives in `lib/film.ts` and must match `CHAPTERS` in film.py.
- The legacy static site (`index.html`, `pages/`, `assets/`) stays in the repo untouched until the new site ships.
- Product facts come only from manufacturer documents (see Evidence). Categories without datasheets (LED, cameras, furniture, generators) list what is carried, with no invented specs.

## Brand Commitments

- Name: Jontai Energy. Hero copy from the owner's brief of 2026-10-26: "Aruba sunlight, made useful." with "Explore solar" and "Visit the store".
- Palette pinned by the owner: light green #B8D8A8, fresh green #79AE72, deep forest #173D2C, warm wood #B78455, light oak #D8B98E, warm background #F7F5EC, text #183128. Wood is architecture (stands, plinths, rails), not rustic decoration. This supersedes an earlier "dark and atmospheric" answer.
- Type: a distinctive display face with a readable sans; not technical or futuristic.
- Direction chosen 2026-10-26 after studying mdebeauty.com and fitosauna.com: "One day of Aruban sun". The scroll is the time of day; one sunlit lime-plaster wall with a divi-divi shadow carries every product at its hour, then morning light rises to the furniture floor. Interactions the owner asked for: a 3000K to 6500K bulb slider and a site-wide day/night switch (the switch was removed again on 2026-10-27; the site is in day colours only). No house interiors and no imitation of the real store (the staircase clip was removed for that reason).
- Copy rules: "Afl." for every amount. Never "We install", "Installation services", "Our installers" or anything implying installation comes with a purchase. Delivery wording: "Large-item delivery available. Ask us about furniture delivery." Service line, verbatim: "Jontai Energy is a retail store and does not provide installation services. Delivery is available for large items such as furniture."

## Evidence on Hand

- Namkoo SPI series datasheet and SPI-8K-UP / SPI-10K-UP user manual (`C:\Users\bhcco\Downloads\美标8KW说明书.pdf`, plus the datasheet image the owner shared).
- Namkoo 3000W Portable Power Station spec sheet (image the owner shared).
- Namkoo ACDC hybrid solar air conditioner brochure and installation manual (`C:\Users\bhcco\Downloads\`).
- Product photos in `public/products/`.
- Store facts in `lib/store.ts` (hours need confirming before launch).
- Absent: customer testimonials, real store interior photos, prices, stock levels. Do not fabricate them. Generated imagery and 3D models are illustrative and must not be presented as the actual store or stock.
- Open items for the owner: `docs/content-placeholders.md`.

## Product Principles

1. Every claim traces to a document or the owner; anything else is phrased as "ask in store".
2. The site sends people to a person: WhatsApp, the counter, or a quote. Never a dead-end cart.
3. Energy and furniture are one home, not two shops. Transitions between them should feel continuous.
4. Delivery is a promise worth repeating; installation is a boundary worth stating.

## Accessibility & Inclusion

Reduced motion, Save-Data and no-JS visitors get each chapter as a still with its copy, in order; the bulb slider still works. The film's canvas is decorative (`aria-hidden`); every chapter's copy and controls are real DOM. No custom cursor. Nothing essential lives only inside a canvas.
