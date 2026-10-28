import { HOME_COPY } from '@/lib/products';
import { StoreIndex } from './StoreIndex';

/** Right after the hero: what is in the store, five big ruled rows that each lead down to their chapter. */
export function InStore() {
  const { chapters } = HOME_COPY;
  return (
    <section className="instore" aria-labelledby="instore-title">
      <h2 id="instore-title" className="label instore__title" data-reveal>
        In the store
      </h2>
      <StoreIndex items={chapters.map((c) => ({ id: c.id, number: c.number, name: c.index, floor: c.floor, image: c.image }))} />
    </section>
  );
}
