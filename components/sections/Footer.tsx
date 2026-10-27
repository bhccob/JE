import { OpenCategoryButton } from '@/components/catalog/OpenCategoryButton';
import { FitText } from '@/components/ui/FitText';
import { CATEGORIES } from '@/lib/products';
import { QUOTE_ACTION } from '@/lib/quote';
import { CONCEPT, OFFICIAL_URL, STORE } from '@/lib/store';

/**
 * The page's last word: the products and the store as one row each, the store's socials, then JONTAI ENERGY across the
 * width. On wide screens the page lifts off it, and the letters rise with the last stretch of scroll.
 * `base` is '/' on pages other than home, so the section links lead back to it.
 */
export function Footer({ base = '' }: { base?: string }) {
  return (
    <footer className="footer" data-concept={CONCEPT || undefined}>
      <nav className="footer__nav label" aria-label="Footer">
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <OpenCategoryButton id={c.id}>{c.name}</OpenCategoryButton>
            </li>
          ))}
        </ul>
        <ul>
          <li>
            <a href="/quote">{QUOTE_ACTION}</a>
          </li>
          <li>
            <a href={`${base}#rewards`}>Rewards</a>
          </li>
          <li>
            <a href={`${base}#delivery`}>Large-item delivery</a>
          </li>
          <li>
            <a href={`${base}#visit`}>Visit</a>
          </li>
          <li>
            <a href={`${base}#faq`}>FAQ</a>
          </li>
        </ul>
      </nav>
      <div className="footer__social">
        <a href={STORE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Jontai Energy on Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" />
          </svg>
        </a>
        <a href={STORE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Jontai Energy on Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
          </svg>
        </a>
      </div>
      <FitText text="JONTAI ENERGY" chars="end" className="footer__mark" />
      <div className="footer__fine">
        <p>
          © {new Date().getFullYear()} {STORE.name} · {STORE.street}, {STORE.city}, {STORE.country}
        </p>
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
      </div>
    </footer>
  );
}
