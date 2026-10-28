'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { IdentificationCard, WarningCircle } from '@phosphor-icons/react/dist/ssr';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Words } from '@/components/ui/Split';
import {
  BUSINESS_DISCOUNT,
  POINTS_MAX,
  REWARD_PER_STEP_AFL,
  REWARD_STEP_AFL,
  VOUCHER_AFL,
  businessCard,
  formatAfl,
  formatPoints,
  regularCard,
} from '@/lib/loyalty';
import { BusinessFace, LoyaltyCard, RegularFace } from './LoyaltyCard';
import { MemberLogin } from './MemberLogin';

gsap.registerPlugin(ScrollTrigger);

type Tier = 'regular' | 'business';

/** Where the card rests: two vouchers earned and half way to the third. */
const START_POINTS = 1250;

/**
 * An explanation you can play with, not an account: the loyalty card itself, in 3D, with points up to 5,000. The
 * regular face fills ten sun stamps, one Afl. 25 voucher each; turned over, the business face closes a ring toward 10%
 * off. Membership is opened in store, where the card is collected; the member login is a placeholder until points are
 * connected. Below, the two programs as the store words them.
 */
export function Loyalty() {
  const id = useId();
  const section = useRef<HTMLElement>(null);
  const run = useRef<gsap.core.Tween | null>(null);
  const [points, setPoints] = useState(START_POINTS);
  const [tier, setTier] = useState<Tier>('regular');
  const r = regularCard(points);
  const b = businessCard(points);

  // The first time the section comes up, the card's points run from 0 to its resting value, so the stamps fill one
  // by one. Not with reduced motion, and not when the page opens already past it; touching the controls stops it.
  useEffect(() => {
    const el = section.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.65) return;
    setPoints(0);
    const level = { v: 0 };
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        run.current = gsap.to(level, {
          v: START_POINTS,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => setPoints(Math.round(level.v / 50) * 50),
        });
      },
    });
    return () => {
      trigger.kill();
      run.current?.kill();
    };
  }, []);

  const set = (v: number) => {
    run.current?.kill();
    setPoints(Math.min(POINTS_MAX, Math.max(0, Number.isFinite(v) ? Math.round(v) : 0)));
  };
  const readout =
    tier === 'regular'
      ? `${formatAfl(r.credit)} in vouchers. ${points >= POINTS_MAX ? 'Every stamp on this card is earned.' : `${formatPoints(r.toNext)} to the next ${formatAfl(VOUCHER_AFL)}.`}`
      : b.reached
        ? `${BUSINESS_DISCOUNT}% off for the rest of the year.`
        : `${formatPoints(b.toGoal)} to ${BUSINESS_DISCOUNT}% off for the rest of the year.`;

  return (
    <section ref={section} id="rewards" className="loyalty" aria-labelledby="rewards-title">
      <div className="container loyalty__grid">
        <div className="loyalty__head">
          <p className="label" data-reveal>
            Jontai Rewards
          </p>
          <h2 id="rewards-title" className="display rewards__title" data-words>
            <Words text="Spend" />{' '}
            <span className="keep">
              <Words text={`${formatAfl(REWARD_STEP_AFL)}.`} />
            </span>{' '}
            <em>
              <Words text="Get" />{' '}
              <span className="mark">
                <Words text={formatAfl(REWARD_PER_STEP_AFL)} />
                <svg className="underline" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                  <path pathLength={1} d="M3 14 C 50 6, 120 4, 197 9" data-draw="once" />
                </svg>
              </span>{' '}
              <Words text="back." />
            </em>
          </h2>
        </div>
        <div className="loyalty__text">
          <p className="lead" data-reveal style={{ ['--i' as string]: 1 }}>
            Your rewards keep accumulating, with an annual reset after one year of use.
          </p>
          <p className="note" data-reveal style={{ ['--i' as string]: 2 }}>
            Full terms and the exact reset date are confirmed with Jontai Energy in store.
          </p>
          <div className="membership" data-reveal style={{ ['--i' as string]: 3 }}>
            <p className="membership__line">
              <IdentificationCard size={24} weight="light" aria-hidden="true" />
              <span>Open your membership in store at Cumana 73 and collect your loyalty card. The code on the card is your member login.</span>
            </p>
            <div className="actions">
              <MemberLogin />
              <a href="#visit" className="btn btn--ghost">
                Visit the store
              </a>
            </div>
          </div>
        </div>

        <div className="loyalty__play" data-reveal>
          <LoyaltyCard flipped={tier === 'business'} front={<RegularFace points={points} />} back={<BusinessFace points={points} />} />

          <div className="lcontrols">
            <fieldset className="segment" data-tier={tier}>
              <legend className="visually-hidden">Customer type</legend>
              {(['regular', 'business'] as Tier[]).map((t) => (
                <label key={t} className="segment__option">
                  <input type="radio" name={`${id}-tier`} value={t} checked={tier === t} onChange={() => setTier(t)} />
                  <span>{t === 'regular' ? 'Regular customer' : 'Business customer'}</span>
                </label>
              ))}
            </fieldset>

            <div className="spend">
              <label htmlFor={`${id}-points`}>Points this year</label>
              <div className="spend__row">
                <input
                  id={`${id}-points`}
                  name="points"
                  className="spend__input"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={POINTS_MAX}
                  step={50}
                  value={points}
                  onChange={(e) => set(e.currentTarget.valueAsNumber)}
                />
                <span className="spend__suffix" aria-hidden="true">
                  points
                </span>
              </div>
            </div>
            <input
              className="card__range"
              type="range"
              min={0}
              max={POINTS_MAX}
              step={50}
              value={points}
              aria-label="Points this year"
              style={{ '--fill': points / POINTS_MAX } as CSSProperties}
              onChange={(e) => set(e.currentTarget.valueAsNumber)}
            />
            <p className="lcontrols__readout" aria-live="polite">
              {readout}
            </p>
          </div>
        </div>

        <div className="programs" data-reveal>
          <h3 className="h-title programs__title">Two loyalty programs</h3>
          <section className="program" aria-labelledby="program-regular">
            <h4 id="program-regular" className="program__name">
              Regular customer
            </h4>
            <p className="figure program__figure">{formatAfl(VOUCHER_AFL)}</p>
            <p>For every 500 points you earn, you unlock 1 voucher worth {formatAfl(VOUCHER_AFL)} in store credit.</p>
            <p className="program__note">
              <WarningCircle size={18} weight="bold" aria-hidden="true" />
              Vouchers cannot be converted to cash.
            </p>
          </section>
          <section className="program" aria-labelledby="program-business">
            <h4 id="program-business" className="program__name">
              Business customer
            </h4>
            <p className="figure program__figure">{BUSINESS_DISCOUNT}% off</p>
            <p>Reach 5,000 points and get 10% off for the rest of the year.</p>
            <p className="program__note program__note--quiet">Until your next account anniversary, when points reset to 0.</p>
          </section>
        </div>
      </div>
    </section>
  );
}
