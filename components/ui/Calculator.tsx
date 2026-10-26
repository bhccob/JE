'use client';

import { useId, useMemo, useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { CALC_LIMITS, estimateSolar, NATIONAL_RE_TARGET } from '@/lib/pricing';
import { clsx } from '@/lib/clsx';

const fmt = (n: number, digits = 0) => n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[0.9375rem] font-medium text-bone">
          {label}
        </label>
        <output htmlFor={id} className="num text-[1.25rem] text-bone">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={display}
        className="range mt-3"
        style={{ '--fill': `${((value - min) / (max - min)) * 100}%` } as CSSProperties}
      />
      <div className="num mt-1 flex justify-between text-[0.75rem] text-moss" aria-hidden="true">
        <span>{fmt(min)}</span>
        <span>{fmt(max)}</span>
      </div>
    </div>
  );
}

export function Calculator() {
  const t = useTranslations('impact');
  const [bill, setBill] = useState<number>(CALC_LIMITS.bill.initial);
  const [roof, setRoof] = useState<number>(CALC_LIMITS.roof.initial);
  const [backup, setBackup] = useState(false);
  const est = useMemo(() => estimateSolar({ monthlyBillAwg: bill, roofM2: roof, backup }), [bill, roof, backup]);
  const coveragePct = Math.round(est.coverage * 100);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <form className="surface flex flex-col gap-8 p-6 md:p-8 lg:col-span-5" onSubmit={(e) => e.preventDefault()} aria-label={t('headline')}>
        <Slider
          label={t('bill')}
          value={bill}
          display={`ƒ ${fmt(bill)} AWG`}
          min={CALC_LIMITS.bill.min}
          max={CALC_LIMITS.bill.max}
          step={CALC_LIMITS.bill.step}
          onChange={setBill}
        />
        <Slider
          label={t('roof')}
          value={roof}
          display={`${fmt(roof)} m²`}
          min={CALC_LIMITS.roof.min}
          max={CALC_LIMITS.roof.max}
          step={CALC_LIMITS.roof.step}
          onChange={setRoof}
        />
        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div>
            <p id="backup-label" className="text-[0.9375rem] font-medium text-bone">
              {t('backup')}
            </p>
            <p className="mt-0.5 text-[0.8125rem] text-mist">{t('backupHint')}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={backup}
            aria-labelledby="backup-label"
            onClick={() => setBackup((v) => !v)}
            className={clsx(
              'relative h-8 w-14 shrink-0 rounded-full border transition-colors duration-300 ease-[var(--ease-out-expo)]',
              backup ? 'border-leaf-400 bg-leaf-400' : 'border-white/20 bg-white/[0.06]',
            )}
          >
            <span
              className={clsx(
                'absolute top-1 size-[22px] rounded-full shadow transition-transform duration-300 ease-[var(--ease-out-expo)]',
                backup ? 'translate-x-[26px] bg-night-950' : 'translate-x-1 bg-bone',
              )}
            />
          </button>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7" aria-live="polite">
        <div
          className="relative overflow-hidden rounded-[20px] border border-leaf-400/25 p-6 sm:col-span-2 md:p-8"
          style={{ background: 'radial-gradient(120% 140% at 100% 0%, rgb(99 215 155 / 0.22), transparent 55%), linear-gradient(160deg, #10241a, #0a1711)' }}
        >
          <p className="text-[0.9375rem] text-leaf-200">{t('system')}</p>
          <p className="mt-2 flex items-baseline gap-3">
            <span className="num text-[clamp(3.25rem,7vw,5.25rem)] leading-none text-bone">{fmt(est.systemKwp, 1)}</span>
            <span className="text-[1.25rem] text-mist">kWp</span>
          </p>
          {est.roofLimited && <p className="mt-3 text-[0.8125rem] text-sun-300">{t('roofLimited')}</p>}
        </div>
        <Output label={t('payback')} value={fmt(est.paybackYears, 1)} unit={t('years')} />
        <Output
          label={t('savings')}
          value={`ƒ ${fmt(est.monthlySavingsAwg)}`}
          unit={`AWG ${t('perMonth')}`}
          sub={`≈ $${fmt(est.monthlySavingsUsd)} USD`}
        />
        <Output label={t('co2')} value={fmt(est.co2TonnesPerYear, 1)} unit={t('perYear')} className="sm:col-span-2" />

        <div className="surface p-6 sm:col-span-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <p className="text-[0.9375rem] font-medium text-bone">{t('targetLabel')}</p>
            <p className="num text-[0.9375rem] text-leaf-300">{t('contribution', { kwp: fmt(est.systemKwp, 1) })}</p>
          </div>
          <div className="relative mt-4 pt-6">
            <span
              aria-hidden="true"
              className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-[0.75rem] text-sun-300"
              style={{ left: `${NATIONAL_RE_TARGET * 100}%` }}
            >
              {t('targetMarker')}
            </span>
            <div
              role="meter"
              aria-label={t('coverage', { pct: coveragePct })}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={coveragePct}
              className="relative h-2.5 rounded-full bg-white/[0.08]"
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-leaf-600 to-leaf-300 transition-[width] duration-500 ease-[var(--ease-out-expo)]"
                style={{ width: `${coveragePct}%` }}
              />
              <div className="absolute -top-1.5 h-[22px] w-px bg-sun-300" style={{ left: `${NATIONAL_RE_TARGET * 100}%` }} aria-hidden="true" />
            </div>
          </div>
          <p className="mt-2 text-[0.8125rem] text-mist">{t('coverage', { pct: coveragePct })}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
          <p className="text-[0.8125rem] text-moss">{t('disclaimer')}</p>
          <Link href="/quote" className="btn btn-primary">
            {t('cta')}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Output({ label, value, unit, sub, className }: { label: string; value: string; unit: string; sub?: string; className?: string }) {
  return (
    <div className={clsx('surface p-6', className)}>
      <p className="text-[0.9375rem] text-mist">{label}</p>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
        <span className="num text-[2.25rem] leading-none text-bone">{value}</span>
        <span className="text-[0.9375rem] text-mist">{unit}</span>
      </p>
      {sub && <p className="num mt-2 text-[0.8125rem] text-moss">{sub}</p>}
    </div>
  );
}
