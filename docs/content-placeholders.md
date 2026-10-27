# Content to confirm or replace

Everything on the home page that Jontai Energy should check before launch. Nothing here was invented; each item is either taken from an existing source that needs confirming, or illustrative material that should be swapped for the real thing.

## Confirmed by the owner

- Opening hours, 2026-10-27: Monday to Saturday 9:00 to 19:00, Sunday 10:00 to 14:00 (shown as 9:00 AM to 7:00 PM and 10:00 AM to 2:00 PM; `lib/store.ts`). The "Open now" line uses Aruba time and does not know about public holidays.
- Phone and WhatsApp, 2026-10-27: +297 586 5323 for both (`lib/store.ts`). The current jontaienergy.com links WhatsApp to +297 566 6152; the owner confirmed +297 586 5323 is correct.

## Facts to confirm

| What | Where it shows | Current value | Source |
| --- | --- | --- | --- |
| Email | Visit the store, quote page, where quote requests are sent | jontai@qq.com | Old site pages |
| Instagram | Visit the store, Store JSON-LD | instagram.com/jontaienergy | Old site pages (Facebook was confirmed in the brief; Instagram was not) |
| LED colour temperatures | Dusk chapter, the bulb slider | "From warm 3000K to daylight 6500K." | The owner, 2026-10-26. Confirm which bulbs come in which temperatures |
| Loyalty terms | Loyalty section | Afl. 500 spent, Afl. 25 back, accumulates, resets after one year of use | Owner's brief. The page says full terms and the exact reset date are confirmed in store |
| Loyalty programs | Loyalty section, "Two loyalty programs" | Regular: every 500 points unlocks 1 voucher worth Afl. 25 in store credit; vouchers cannot be converted to cash. Business: reach 5,000 points and get 10% off for the rest of the year, until the next account anniversary, when points reset to 0 | Owner, 2026-10-27, from the current jontaienergy.com. Written in Afl. like the rest of the site (the current site says AWG) |
| Points per Afl. | Loyalty card on the page | The card works in points, 0 to 5,000, beside the brief's "Spend Afl. 500 and get Afl. 25 back", which reads as 1 point per Afl. 1 | Confirm how points are earned; the page never states a rate |
| Membership in store | Loyalty section, member login | "Open your membership in store at Cumana 73 and collect your loyalty card. The code on the card is your member login." | Owner, 2026-10-27 |
| Member login | Loyalty section (placeholder) | Asks for the loyalty code and name, as the current jontaienergy.com does, and says nothing was sent | Not connected. The current site looks members up in its Supabase database by loyalty code and name. Set `LOOKUP_URL` in `components/sections/MemberLogin.tsx` (or add a server route) once the lookup is shared |
| Generator delivery | FAQ "What do you deliver?", generator and furniture panels | Furniture and large generators | First brief ("large generators"); confirm it still applies |
| Delivery details | Furniture panel | "Delivery areas, days and any charge are confirmed when you buy." No areas, days or fees are stated | Add them to the furniture panel (`data/products.json`, panels.furniture) once confirmed |
| Camera and generator panels | Product panels | What the products do in general terms, with no models or figures | No datasheets were supplied. Send them and the panels can show figures like the inverter does |
| Team names and titles | Meet the team, after the furniture chapter (`lib/team.ts`) | Lily Xie, Chief Executive Officer · Founder; Chiwai Chung, Chief Financial Officer · Co-Founder; Chakho Chung, Chief Technology Officer; Chingho Chung, Chief Operating Officer; Bob Chung, Chief Design Officer | Owner, 2026-10-27. The owner wrote "Chief Designer Officer"; the page uses the usual "Chief Design Officer" |

All datasheet figures (SPI-8K-UP, 3000W power station, ACDC solar AC) come from the supplied Namkoo documents and are labelled as examples, not live stock.

## Quote requests by email

The quote page (`/quote`) sends each request to the store by email through Resend (resend.com), with Reply-To set to the visitor so a reply goes straight to them. To switch it on, set `RESEND_API_KEY` and `QUOTE_FROM` (an address on a domain verified in Resend) where the site is hosted; `QUOTE_TO` overrides the inbox, which defaults to jontai@qq.com. See `.env.example`. Until then the page does not pretend to send: it says it could not, and opens the same message in the visitor's own email app instead.

## Illustrative material to replace

| What | Where | Replace with |
| --- | --- | --- |
| The day film (Blender renders, `tools/blender/film`) | Every chapter of the home page | It is a rendered set, not the store, and every still is labelled "Rendered illustration" for screen readers. The inverter, power station and solar AC are remodelled from the store's product photos; the generator, LED pendant, solar camera, sofa and chair are representative designs, not specific stock items. Real product photos can replace the posters at any time. |
| Plaster, terrazzo and oak textures (GPT Image) | Inside the renders | Nothing needed; they are surface materials, not claims |
| Team portraits | Meet the team | Each frame is a crop of the plaster wall saying "Photo of … to come". Add a 4:5 portrait per person under `public/team/` and set its `photo` in `lib/team.ts`; the placeholder line hides itself |
| Catalogue pictures (GPT Image, `public/catalog`) | The product panel for each category | Studio-style illustrations of the kinds of products carried; the panels, AC, inverter, power station, generator, camera, sofa and chair follow the store's photos, the LED items and the site camera are representative. The panel says so ("Pictures show the kind of products we carry"). Swap in real product photos any time, same file names, square |

Removed on purpose: the Seedance staircase clip of a store interior (the owner said it looked nothing like the real store) and the earlier real-time 3D models.

## Not shown anywhere on purpose

Prices, stock levels, warranties beyond the inverter datasheet's 24 months, reviews, customer counts, founding dates, awards, energy savings, installation services. The panel copy names silicon cells without claiming a cell type, because no supplied document states one.
