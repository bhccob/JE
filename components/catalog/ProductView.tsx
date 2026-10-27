'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { productById, type Product, type ProductPanel } from '@/lib/products';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * One product told in full, inside the product panel: its picture beside what it does and a few figures, then the
 * points that matter, then the manufacturer's full table behind a disclosure. Figures come only from supplied documents.
 */
export function ProductView({ panel, reduced }: { panel: ProductPanel; reduced: boolean }) {
  const spec = panel.specs ? productById(panel.specs) : null;
  const List = panel.steps ? 'ol' : 'ul';
  const rise = (i: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: EASE, delay: 0.16 + i * 0.08 } };

  return (
    <div className="drawer__body pv">
      <motion.div className="pv__top" {...rise(0)}>
        <div className="pv__media">
          <Image src={panel.image} alt={panel.alt} width={800} height={800} sizes="(max-width: 40rem) 100vw, 300px" />
        </div>
        <div className="pv__intro">
          <p className="pv__lead">{panel.intro}</p>
          {panel.highlight && <p className="pv__highlight">{panel.highlight}</p>}
          {panel.figures && (
            <dl className="pv__figures">
              {panel.figures.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd className="figure">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </motion.div>

      <motion.div {...rise(1)}>
        <List className="pv__points" data-steps={panel.steps || undefined}>
          {panel.points.map((p) => (
            <li key={p.title}>
              <h3 className="pv__point">{p.title}</h3>
              <p>{p.line}</p>
            </li>
          ))}
        </List>
      </motion.div>

      {spec && (
        <motion.details className="pv__specs" {...rise(2)}>
          <summary>Full specifications</summary>
          <SpecTables product={spec} />
        </motion.details>
      )}
      {panel.note && <p className="note pv__note">{panel.note}</p>}
    </div>
  );
}

/** The manufacturer's table: datasheet groups when there is a datasheet, otherwise the key specs and the model list. */
function SpecTables({ product }: { product: Product }) {
  const sheet = product.datasheet;
  if (sheet) {
    return (
      <div className="specs">
        {sheet.groups.map((g) => (
          <table key={g.title} className="specs__table">
            <caption>{g.title}</caption>
            {/* Model names head a group only when its values differ by model. */}
            {sheet.columns && g.rows.some((r) => r.values) && (
              <thead>
                <tr>
                  <td />
                  {sheet.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {g.rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  {r.values ? r.values.map((v, i) => <td key={i}>{v}</td>) : <td colSpan={sheet.columns?.length ?? 1}>{r.value}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    );
  }
  return (
    <div className="specs">
      {product.specs.length > 0 && (
        <table className="specs__table">
          <caption>At a glance</caption>
          <tbody>
            {product.specs.map((s) => (
              <tr key={s.label}>
                <th scope="row">{s.label}</th>
                <td>{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {product.models && (
        <table className="specs__table">
          <caption>{product.models.caption}</caption>
          <thead>
            <tr>
              {product.models.columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {product.models.rows.map(([model, ...rest]) => (
              <tr key={model}>
                <th scope="row">{model}</th>
                {rest.map((v, i) => (
                  <td key={i}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
