'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLenis } from 'lenis/react';
import { X } from '@phosphor-icons/react/dist/ssr';
import { categoryById, panelById, type CategoryId, type PanelId } from '@/lib/products';
import { DIRECTIONS_URL } from '@/lib/contact';
import { QUOTE_ACTION, quoteHref } from '@/lib/quote';
import { ProductView } from './ProductView';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The product panel. A product the film arrives at (the inverter, the solar AC, the power station, the camera, the
 * generator) is told in full; furniture opens on how delivery works; the other categories show what the store
 * carries, pictures first. Every panel ends in a quote request.
 */
export function CategoryDrawer({ id, onClose, returnTo }: { id: PanelId | null; onClose: () => void; returnTo: HTMLElement | null }) {
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const panel = useRef<HTMLDivElement>(null);
  const product = id ? panelById(id) : null;
  const category = id && !product ? categoryById(id as CategoryId) : null;

  useEffect(() => {
    if (!id) return;
    lenis?.stop();
    const raf = requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab' && panel.current) {
        const nodes = panel.current.querySelectorAll<HTMLElement>('a[href], button, summary, [tabindex]:not([tabindex="-1"])');
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      lenis?.start();
      returnTo?.focus();
    };
  }, [id, lenis, onClose, returnTo]);

  const title = product?.name ?? category?.name;
  const quote = quoteHref(product?.quote ?? category?.quote);

  return (
    <AnimatePresence>
      {title && (
        <div className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          <motion.div
            className="drawer__scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            data-lenis-prevent
            className="drawer__panel"
            initial={reduced ? { opacity: 0 } : { x: '100%' }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="drawer__head">
              <div className="drawer__title">
                <h2 id="drawer-title" className="h-section">
                  {title}
                </h2>
                {product ? product.model && <p className="drawer__model">{product.model}</p> : <p className="lead">{category?.blurb}</p>}
              </div>
              <button type="button" data-autofocus onClick={onClose} aria-label="Close" className="drawer__close">
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {product ? (
              <ProductView panel={product} reduced={Boolean(reduced)} />
            ) : (
              <ul className="drawer__body range">
                {category?.range.map((item, i) => (
                  <motion.li
                    key={item.name}
                    className="range__item"
                    initial={reduced ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.18 + i * 0.07 }}
                  >
                    <div className="range__media">
                      <Image className="feather" src={item.image} alt={item.alt} width={800} height={800} sizes="(max-width: 40rem) 100vw, 320px" />
                    </div>
                    <h3 className="range__name">{item.name}</h3>
                    <p className="range__line">{item.line}</p>
                  </motion.li>
                ))}
              </ul>
            )}

            <div className="drawer__foot">
              <div className="actions">
                <a href={quote} className="btn btn--primary btn--sm">
                  {QUOTE_ACTION}
                </a>
                <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm">
                  Get directions
                </a>
              </div>
              {product ? (
                product.source && <p className="note">{product.source}</p>
              ) : (
                <p className="note">Pictures show the kind of products we carry. Ask for current models and stock.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
