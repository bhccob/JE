import { OpenCategoryButton } from '@/components/catalog/OpenCategoryButton';
import { CATEGORIES } from '@/lib/products';
import { QUOTE_ACTION } from '@/lib/quote';
import { CONCEPT, OFFICIAL_URL, STORE } from '@/lib/store';

/** `base` is '/' on pages other than home, so the section links lead back to it. */
export function Footer({ base = '' }: { base?: string }) {
  return (
    <footer className="footer" data-concept={CONCEPT || undefined}>
      <div className="container footer__grid">
        <a href={base || '#top'} className="wordmark" aria-label={base ? 'Jontai Energy, home' : 'Jontai Energy, back to the top'}>
          Jontai <span>Energy</span>
        </a>
        <div className="footer__col">
          <h2>Products</h2>
          {CATEGORIES.map((c) => (
            <OpenCategoryButton key={c.id} id={c.id}>
              {c.name}
            </OpenCategoryButton>
          ))}
        </div>
        <div className="footer__col">
          <h2>The store</h2>
          <a href="/quote">{QUOTE_ACTION}</a>
          <a href={`${base}#rewards`}>Loyalty</a>
          <a href={`${base}#delivery`}>Large-item delivery</a>
          <a href={`${base}#visit`}>Visit us</a>
          <a href={STORE.facebook} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </div>
        <div className="footer__legal">
          <p>Jontai Energy is a retail store and does not provide installation services.</p>
          {CONCEPT && (
            <p>
              A concept redesign, not the official Jontai Energy website. The store&rsquo;s own site is{' '}
              <a href={OFFICIAL_URL} rel="noopener noreferrer">
                jontaienergy.com
              </a>
              .
            </p>
          )}
          <p>
            © {new Date().getFullYear()} {STORE.name}, {STORE.street}, {STORE.city}, {STORE.country}
          </p>
        </div>
      </div>
    </footer>
  );
}
