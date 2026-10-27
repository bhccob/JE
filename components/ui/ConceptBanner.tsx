import { CONCEPT, OFFICIAL_URL } from '@/lib/store';

/** Bottom right on every page, over the loading screen too: this is a concept redesign, and where the real store is. */
export function ConceptBanner() {
  if (!CONCEPT) return null;
  return (
    <aside className="concept" aria-label="About this website">
      <p>
        Concept redesign, not the official Jontai Energy site.{' '}
        <a href={OFFICIAL_URL} rel="noopener noreferrer">
          Visit jontaienergy.com
        </a>
      </p>
    </aside>
  );
}
