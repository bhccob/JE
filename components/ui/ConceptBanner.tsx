import { CONCEPT, OFFICIAL_URL } from '@/lib/store';

/** Bottom right on every page, over the loading screen too: this is a concept redesign, and where the real store is.
 *  Phones get the short form on one line along the bottom edge. */
export function ConceptBanner() {
  if (!CONCEPT) return null;
  return (
    <aside className="concept" aria-label="About this website">
      <p>
        Concept redesign, not the official <span className="concept__long">Jontai Energy </span>site.{' '}
        <a href={OFFICIAL_URL} rel="noopener noreferrer">
          <span className="concept__long">Visit </span>jontaienergy.com
        </a>
      </p>
    </aside>
  );
}
