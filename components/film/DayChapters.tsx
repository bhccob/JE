import { OpenCategoryButton } from '@/components/catalog/OpenCategoryButton';
import { QUOTE_ACTION, quoteHref, type QuoteTopic } from '@/lib/quote';
import { FILM_COPY as C, type Fact } from '@/lib/products';
import { Chapter } from './Chapter';
import { KelvinControl, KelvinPicture } from './KelvinBulb';

function Facts({ facts }: { facts: Fact[] }) {
  return (
    <dl className="facts">
      {facts.map((f) => (
        <div key={f.label}>
          <dt>{f.label}</dt>
          {/* A unit never wraps away from its number. */}
          <dd className="figure">{f.value.replace(/ (?=\S+$)/, '\u00a0')}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The second button at each product: a quote request by email, with the product already chosen. */
function Quote({ topic }: { topic: QuoteTopic }) {
  return (
    <a href={quoteHref(topic)} className="btn btn--ghost">
      {QUOTE_ACTION}
    </a>
  );
}

const INFO = 'See product info';
/** Screens the film rests on each product once the camera arrives. */
const HOLD = 0.6;

/**
 * The day, chapter by chapter. Beat ranges are fractions of each chapter's film. A chapter of length L slides in over
 * its first 1/L and is held on screen for the rest, so beats sit between 1/L and 1; the frames reach each product at 1,
 * then hold there (HOLD) with a marker on the product before the next chapter begins.
 */
export function DayChapters() {
  return (
    <>
      <Chapter id="dawn" length={1.8} product={{ panel: 'solar', name: 'Solar panels' }} still="Rendered illustration: a solar panel on an oak post catching first light, the shadow of a divi-divi tree on a plaster wall.">
        <div className="beat beat--hero" data-beat="0,0.74">
          <h1 id="dawn-title" className="h-display">
            {C.dawn.title}
          </h1>
          <p className="lead">{C.dawn.line}</p>
          <div className="actions">
            <a href="#shop" className="btn btn--primary">
              {C.dawn.primary}
            </a>
            <a href="#visit" className="btn btn--ghost">
              {C.dawn.secondary}
            </a>
          </div>
        </div>
      </Chapter>

      <Chapter
        id="noon"
        length={2.5}
        hold={HOLD}
        product={{ panel: 'inverter', name: 'Hybrid solar inverter' }}
        anchors={[{ id: 'shop', at: 0.43 }]}
        still="Rendered illustration: an inverter on a sunlit wall, the cable from the solar panel glowing as it carries power."
      >
        <div className="beat" data-beat="0.38,0.68">
          <h2 id="noon-title" className="h-section">
            {C.noon.title}
          </h2>
          <p className="lead">{C.noon.line}</p>
          <div className="actions">
            <OpenCategoryButton id="solar" className="btn btn--ghost">
              {C.noon.panelAction}
            </OpenCategoryButton>
          </div>
        </div>
        <div className="beat" data-beat="0.73,1.01">
          <h3 className="h-title">{C.noon.inverterTitle}</h3>
          <p className="body">{C.noon.inverterLine}</p>
          <Facts facts={C.noon.facts} />
          <p className="note">{C.noon.source}</p>
          <div className="actions">
            <OpenCategoryButton id="inverter" className="btn btn--primary">
              {INFO}
            </OpenCategoryButton>
            <Quote topic="inverter" />
          </div>
        </div>
      </Chapter>

      <Chapter id="heat" length={2.1} hold={HOLD} product={{ panel: 'solar-ac', name: 'Hybrid solar air conditioner' }} still="Rendered illustration: a solar air conditioner on a white wall, cool air flowing from it, the outdoor unit below.">
        <div className="beat" data-beat="0.45,1.01">
          <h2 id="heat-title" className="h-section">
            {C.heat.title}
          </h2>
          <p className="lead">{C.heat.line}</p>
          <Facts facts={C.heat.facts} />
          <p className="note">{C.heat.note}</p>
          <div className="actions">
            <OpenCategoryButton id="solar-ac" className="btn btn--primary">
              {INFO}
            </OpenCategoryButton>
            <Quote topic="solar-ac" />
          </div>
        </div>
      </Chapter>

      <Chapter id="afternoon" length={2.0} hold={HOLD} product={{ panel: 'power-station', name: 'Portable power station' }} still="Rendered illustration: a portable power station on an oak bench in late afternoon light.">
        <div className="beat" data-beat="0.48,1.01">
          <h2 id="afternoon-title" className="h-section">
            {C.afternoon.title}
          </h2>
          <p className="lead">{C.afternoon.line}</p>
          <Facts facts={C.afternoon.facts} />
          <p className="note">{C.afternoon.note}</p>
          <div className="actions">
            <OpenCategoryButton id="power-station" className="btn btn--primary">
              {INFO}
            </OpenCategoryButton>
            <Quote topic="power-station" />
          </div>
        </div>
      </Chapter>

      <Chapter
        id="dusk"
        length={2.4}
        hold={HOLD + 0.3}
        product={{ panel: 'led', name: 'LED lighting' }}
        tone="dark"
        overlay={<KelvinPicture />}
        still="Rendered illustration: an LED filament bulb glowing against a plaster wall at dusk."
      >
        <div className="beat" data-beat="0.39,0.74">
          <h2 id="dusk-title" className="h-section">
            {C.dusk.title}
          </h2>
          <p className="lead">{C.dusk.line}</p>
        </div>
        <div className="beat" data-beat="0.78,1.01">
          <p className="h-title">{C.dusk.kelvin}</p>
          <KelvinControl label="Try a colour temperature" />
          <div className="actions">
            <OpenCategoryButton id="led" className="btn btn--primary">
              {INFO}
            </OpenCategoryButton>
            <Quote topic="led" />
          </div>
        </div>
      </Chapter>

      <Chapter id="night" length={1.8} hold={HOLD} product={{ panel: 'cameras', name: 'Solar security cameras' }} tone="dark" still="Rendered illustration: a solar security camera on its wall bracket at night.">
        <div className="beat" data-beat="0.53,1.01">
          <h2 id="night-title" className="h-section">
            {C.night.title}
          </h2>
          <p className="lead">{C.night.line}</p>
          <div className="actions">
            <OpenCategoryButton id="cameras" className="btn btn--primary">
              {INFO}
            </OpenCategoryButton>
            <Quote topic="cameras" />
          </div>
        </div>
      </Chapter>

      <Chapter id="outage" length={2.0} hold={HOLD} product={{ panel: 'generator', name: 'Generators' }} tone="dark" still="Rendered illustration: a portable generator with its panel light on, keeping the lights on through a power cut.">
        <div className="beat" data-beat="0.48,1.01">
          <h2 id="outage-title" className="h-section">
            {C.outage.title}
          </h2>
          <p className="lead">{C.outage.line}</p>
          <div className="actions">
            <OpenCategoryButton id="generator" className="btn btn--primary">
              {INFO}
            </OpenCategoryButton>
            <Quote topic="generator" />
          </div>
        </div>
      </Chapter>

      <Chapter
        id="morning"
        length={2.4}
        hold={HOLD}
        product={{ panel: 'furniture', name: 'Furniture delivery' }}
        place="top"
        anchors={[
          { id: 'upstairs', at: 0.9 },
          { id: 'delivery', at: 0.93 },
        ]}
        still="Rendered illustration: a sofa, a lounge chair and a floor lamp on an oak floor upstairs, in morning light."
      >
        <p className="beat h-display beat--climb" data-beat="0.38,0.62">
          {C.morning.climb}
        </p>
        <div className="beat" data-beat="0.68,1.01">
          <h2 id="morning-title" className="h-section">
            {C.morning.title}
          </h2>
          <p className="lead">{C.morning.line}</p>
          <p className="delivery">{C.morning.delivery}</p>
          <div className="actions">
            <OpenCategoryButton id="furniture" className="btn btn--primary">
              {INFO}
            </OpenCategoryButton>
            <Quote topic="furniture" />
          </div>
        </div>
      </Chapter>
    </>
  );
}
