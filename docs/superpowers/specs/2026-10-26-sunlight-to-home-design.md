# From Sunlight to Home: design spec

Source: the owner's brief of 2026-10-26 (pasted in session), plus one follow-up note: "preferably don't make the 3D a house where the user can see inside, since it won't be very accurate when generating a model like that." Tools to use: Hallmark, GSAP, superpowers, Impeccable, taste skill, Higgsfield, Blender.

## Business rules (binding)

- Jontai Energy is a retail store at Cumana 73, Oranjestad, Aruba. It does not install anything.
- Never write "We install", "Installation services", "Our installers", "From consultation to installation", or imply installation comes with a purchase.
- Large-item delivery exists, especially for furniture. Wording: "Large-item delivery available. Ask us about furniture delivery."
- Service line, verbatim: "Jontai Energy is a retail store and does not provide installation services. Delivery is available for large items such as furniture."
- No prices, stock, invented specs, warranties, brands, review ratings, savings, certifications, customer counts or history.
- Loyalty (individual): spend Afl. 500, get Afl. 25 back; rewards keep accumulating; resets after one year of use. Use "Afl." everywhere. Add a note that full terms and reset timing are confirmed in store before launch.
- Loyalty (business): placeholder only. "Business loyalty" / "A separate program for business customers is being prepared. Contact Jontai Energy for current details." CTA "Ask about business rewards".
- No checkout, accounts, live stock, fake login or fake form success.

## Look

- Light green primary #B8D8A8, fresh green #79AE72, deep forest #173D2C, warm wood #B78455, light oak #D8B98E, warm background #F7F5EC, text #183128.
- Wood as architecture (stands, plinths, rails), not rustic decoration. Fresh, sunny, natural, modern, Aruban.
- Editorial type: a distinctive display face with a readable sans. Not technical or futuristic.
- Avoid: stock solar photo hero, identical rounded cards, heavy glass, blue corporate gradients, purple AI styling, badges and stats, long text, random floating shapes, card tilt passed off as 3D.

## Journey

SUNLIGHT → ENERGY → EVERYDAY LIVING → UPSTAIRS FURNITURE. Ground floor: solar, power, lighting, cameras, equipment. Second floor: furniture. The ascent introduces warm wood, interior light and furniture into the cool green energy world.

## Hero

Custom interactive 3D solar scene: modeled panel or compact array, warm sun with soft atmospheric light, realistic reflections, energy moving through the scene, a little natural wood, soft shadows. Headline "Aruba sunlight, made useful." Support: "Solar, power, lighting and everyday essentials, plus furniture upstairs at Jontai Energy." Primary "Explore solar", secondary "Visit the store". On load the panel assembles or rotates in, sunlight reveals the surface, an energy pulse travels away; restrained mouse parallax; scroll scrubs panel rotation and camera toward the next scene. Headline stays readable and stable.

## Motion

Smooth inertial scroll that keeps wheel, touch, keyboard and scrollbar behaviour; scroll-scrubbed 3D camera; subtle light and material changes between sections; staggered type reveals; products that rotate, open, light up as they enter; a restrained progress indicator tied to the journey; no scroll hijack, no forced long sequences, no waiting; scenes paused off screen; reduced motion gets a static or lightly animated alternative.

## Product moments (each with purposeful 3D)

Solar panels (tilt to sun, highlight across cells, construction reveal) · Inverters (wall unit rotates, indicators and energy paths) · Portable power station (turns to show front and outlets, charge animation; no claim that all models match the 3000W sheet) · Solar air conditioners (indoor unit, airflow ribbons, no installation imagery) · LED lighting (switches on with scroll, warm pool, day to evening) · Solar security cameras (gentle pan and tilt, panel catches light, not intimidating) · Generators (slow turn, power-on response, no smoke) · Furniture (warmer second floor, one or two pieces revealed, delivery message nearby). Six or seven excellent moments over many mediocre ones. Simplified scenes on small screens, static fallbacks without WebGL.

## Structure

1. Nav: Jontai Energy, Products, Loyalty, Furniture, Visit us, a small directions CTA.
2. Solar hero.
3. Short brand introduction (no founding dates, counts or awards).
4. Energy journey: solar, power and inverters, lighting and cameras, generators and portable power, solar air conditioning.
5. Upstairs at Jontai: furniture transition and large-item delivery.
6. Loyalty: "Your purchases give something back." / "Spend Afl. 500 and get Afl. 25 back. Your rewards keep accumulating, with an annual reset after one year of use." Ring or path fills to Afl. 500, Afl. 25 is stamped, further purchases keep building.
7. Visit the store: location, hours, phone, WhatsApp, email, socials only when verified; marked placeholders otherwise; working directions link.
8. Compact footer: categories, loyalty, delivery info, Facebook, retail-only line.

## Engineering

Componentised sections and scenes; product content in data; 3D lazy-loaded near the viewport and paused off screen; compressed GLBs (Draco or Meshopt) and textures; clamped DPR; reserved media sizes; only critical hero assets preloaded; usable before 3D loads; WebGL and reduced-data fallbacks; canvases never block navigation clicks; cleanup of frames, observers and listeners. WCAG contrast, landmarks, keyboard access, visible focus, alt text, nothing essential only inside a canvas. Local-retail metadata, Open Graph, Store JSON-LD from verified facts only, never "installer". Unknowns live in one placeholder list.
