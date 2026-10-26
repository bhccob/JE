import type { Product } from '@/lib/products';
import { clsx } from '@/lib/clsx';

/**
 * DOM stand-in for a product model: used in /store, in the reduced-motion shelf and in the
 * reduced-motion Quick look. Pure CSS, no imagery.
 * TODO: replace with real product photography when available.
 */
export function ProductPoster({ product, size = 'md', className }: { product: Product; size?: 'md' | 'lg'; className?: string }) {
  const [from, to] = product.swatch;
  const light = product.category === 'batteries' || product.id === 'panel-600' || product.id === 'rail-kit';
  return (
    <div
      className={clsx('relative isolate overflow-hidden rounded-[20px]', size === 'lg' ? 'aspect-[4/3]' : 'aspect-[5/4]', className)}
      style={{
        background: `radial-gradient(120% 90% at 20% 0%, ${from} 0%, ${to} 70%)`,
        boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.12), inset 0 0 0 1px rgb(255 255 255 / 0.06)',
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-40 mix-blend-overlay"
        style={{ background: 'repeating-linear-gradient(115deg, rgb(255 255 255 / 0.06) 0 2px, transparent 2px 14px)' }}
      />
      <div className={clsx('absolute inset-x-5 bottom-4 flex items-end justify-between', light ? 'text-night-900' : 'text-bone')}>
        <span className={clsx('display', size === 'lg' ? 'text-[4.5rem]' : 'text-[3rem]')}>{product.headline}</span>
      </div>
    </div>
  );
}
