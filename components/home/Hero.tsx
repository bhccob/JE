import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { FitText } from '@/components/ui/FitText';
import { Words } from '@/components/ui/Split';
import { HOME_COPY } from '@/lib/products';
import { OpenStatus } from './OpenStatus';

/**
 * The name is the picture: JONTAI across the full width, the owner's line under it, and on the right what is in the
 * store, each row a way down to its chapter. The entrance is HeroMotion's; without it everything is simply here.
 */
export function Hero() {
  const { hero, chapters } = HOME_COPY;
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero__meta label">
        <span data-hero>Cumana 73, Oranjestad</span>
        <span data-hero>Family-owned</span>
        <OpenStatus data-hero />
      </div>

      <FitText text="JONTAI" chars className="wordmark" />

      <div className="hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="h-display">
            <Words text={hero.title} />
          </h1>
          <p className="lead" data-hero>
            {hero.lead}
          </p>
          <div className="actions" data-hero>
            <a href="#solar" className="btn btn--primary">
              {hero.primary} <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </a>
            <a href="#visit" className="btn btn--ghost">
              {hero.secondary}
            </a>
          </div>
        </div>

        <nav className="index" aria-label="In the store">
          <p className="label index__title" data-hero>
            In the store
          </p>
          <ol>
            {chapters.map((c) => (
              <li key={c.id} data-hero>
                <a href={`#${c.id}`}>
                  <span className="index__n">{c.number}</span>
                  <span className="index__name">{c.index}</span>
                  <ArrowRight size={22} weight="bold" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
