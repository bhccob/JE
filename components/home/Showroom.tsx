import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { OpenCategoryButton } from '@/components/catalog/OpenCategoryButton';
import { Words } from '@/components/ui/Split';
import { HOME_COPY, type HomeChapter } from '@/lib/products';
import { QUOTE_ACTION } from '@/lib/quote';
import { KelvinSlider } from './KelvinSlider';
import { StageSwitcher } from './StageSwitcher';

/**
 * The five product families, one screen each: a forest text field (oak upstairs) and the product on the stage colour.
 * On wide screens the chapters scroll past one product stage that holds still; on phones each chapter carries its
 * own picture. The dark field grows from a rounded inset to full width as it arrives.
 */
export function Showroom() {
  return (
    <section id="products" className="showroom" data-tone="dark" data-expand aria-label="Products">
      <div className="chapters">
        {HOME_COPY.chapters.map((c) => (
          <Chapter key={c.id} chapter={c} />
        ))}
      </div>
      <StageSwitcher chapters={HOME_COPY.chapters} />
    </section>
  );
}

function Chapter({ chapter: c }: { chapter: HomeChapter }) {
  return (
    <article id={c.id} className="chapter" data-tone={c.tone ?? 'dark'} data-floor={c.floor} aria-labelledby={`${c.id}-title`}>
      <div className="chapter__media">
        <span className="label">{c.floor}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="feather" src={c.image} alt={c.alt} width={800} height={800} loading="lazy" decoding="async" data-parallax="10,-4" />
        {c.id === 'light' && <i className="stage__glow" data-glow aria-hidden="true" />}
        <span className="chapter__caption">Illustration, not specific stock</span>
      </div>

      <div className="chapter__text">
        <span className="ghost" aria-hidden="true" data-parallax="28,-18">
          {c.number}
        </span>
        <p className="chapter__label label" data-reveal>
          {c.number} · {c.label}
        </p>
        <h2 id={`${c.id}-title`} className="h-section" data-words>
          <Words text={c.title} />
        </h2>
        <p className="lead" data-reveal>
          {c.lead}
        </p>
        {c.facts && (
          <dl className="facts" data-reveal>
            {c.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd data-count>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {c.id === 'light' && <KelvinSlider />}
        {c.pull && (
          <p className="pull" data-reveal>
            {c.pull}
          </p>
        )}
        {c.note && (
          <p className="fine" data-reveal>
            {c.note}
          </p>
        )}
        <div className="chapter__actions" data-reveal>
          {c.actions.map((a) => (
            <OpenCategoryButton key={a.panel} id={a.panel} className="textlink">
              {a.label} <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </OpenCategoryButton>
          ))}
          <a href={`/quote?for=${c.quote}`} className="textlink">
            {QUOTE_ACTION}
          </a>
        </div>
      </div>
    </article>
  );
}
