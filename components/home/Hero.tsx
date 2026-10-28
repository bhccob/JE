import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { FitText } from '@/components/ui/FitText';
import { Words } from '@/components/ui/Split';
import { HOME_COPY } from '@/lib/products';
import { HeroMotion } from './HeroMotion';
import { OpenStatus } from './OpenStatus';

/**
 * The name is the picture: a quiet line on top (family-owned, open now), JONTAI across the full width, then the owner's
 * line with the lead and two ways in beside it. What is in the store follows in its own band (InStore). The entrance
 * is HeroMotion's; without it everything is simply here.
 */
export function Hero() {
  const { hero } = HOME_COPY;
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero__meta label">
        <span data-hero>Family-owned · Cumana 73, Oranjestad</span>
        <OpenStatus data-hero />
      </div>

      <FitText text="JONTAI" chars className="wordmark" />

      <div className="hero__grid">
        <h1 id="hero-title" className="hero__title h-display">
          <Words text={hero.title} />
        </h1>
        <div className="hero__side">
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
      </div>
      <HeroMotion />
    </section>
  );
}
