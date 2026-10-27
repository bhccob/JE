'use client';

import { useRef } from 'react';
import { useLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { HomeChapter } from '@/lib/products';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Wide screens: one product stage holds still beside the chapters. As each chapter takes the middle of the screen its
 * product rises in and the last one drops away, in the direction you are scrolling; the number and the floor roll to
 * match, and the bars along the bottom fill with each chapter and jump to it. Phones never show it: each chapter has
 * its own picture there. The pictures here are decorative; each chapter's own picture carries its description.
 */
export function StageSwitcher({ chapters }: { chapters: HomeChapter[] }) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const stage = root.current;
      if (!stage) return;
      const mm = gsap.matchMedia();
      mm.add({ wide: '(min-width: 961px)', motion: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
        const { wide, motion } = ctx.conditions as Record<string, boolean>;
        if (!wide) return;
        const items = gsap.utils.toArray<HTMLElement>('.stage__item', stage);
        const fills = gsap.utils.toArray<HTMLElement>('.stage__ticks i', stage);
        const num = stage.querySelector<HTMLElement>('[data-stage-num]');
        const floor = stage.querySelector<HTMLElement>('[data-stage-floor]');
        let active = 0;

        const roll = (el: HTMLElement | null, text: string, dir: number) => {
          if (!el || el.dataset.to === text) return;
          el.dataset.to = text;
          if (!motion) {
            el.textContent = text;
            return;
          }
          gsap.to(el, {
            yPercent: -100 * dir,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: true,
            onComplete: () => {
              el.textContent = text;
              gsap.fromTo(el, { yPercent: 100 * dir }, { yPercent: 0, opacity: 1, duration: 0.55, ease: 'expo.out' });
            },
          });
        };

        const show = (i: number, dir: number) => {
          if (i === active) return;
          const prev = items[active];
          const next = items[i];
          stage.dataset.active = String(i);
          if (motion) {
            gsap.to(prev, { opacity: 0, yPercent: -9 * dir, scale: 0.94, duration: 0.6, ease: 'expo.out', overwrite: true });
            gsap.fromTo(next, { opacity: 0, yPercent: 12 * dir, scale: 1.05 }, { opacity: 1, yPercent: 0, scale: 1, duration: 1.1, ease: 'expo.out', overwrite: true });
          } else {
            gsap.set(prev, { opacity: 0 });
            gsap.set(next, { opacity: 1 });
          }
          roll(num, chapters[i].number, dir);
          roll(floor, chapters[i].floor, dir);
          active = i;
        };

        chapters.forEach((c, i) => {
          const chapter = document.getElementById(c.id);
          if (!chapter) return;
          ScrollTrigger.create({ trigger: chapter, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && show(i, self.direction) });
          gsap.fromTo(fills[i], { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top 55%', end: 'bottom 55%', scrub: true } });
          if (motion) {
            gsap.fromTo(
              items[i].querySelector('img'),
              { yPercent: 5, rotation: -1.2 },
              { yPercent: -5, rotation: 1.2, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: true } },
            );
          }
        });
      });
    },
    { scope: root, dependencies: [chapters] },
  );

  const jump = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView();
  };

  return (
    <div ref={root} className="stage" data-active="0">
      <div className="stage__sticky">
        <div className="stage__items" aria-hidden="true">
          {chapters.map((c) => (
            <div key={c.id} className="stage__item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="feather" src={c.image} alt="" width={800} height={800} decoding="async" />
            </div>
          ))}
        </div>
        <i className="stage__glow" data-glow aria-hidden="true" />
        <div className="stage__top label" aria-hidden="true">
          <span className="swap">
            <span data-stage-floor>{chapters[0].floor}</span>
          </span>
          <span className="stage__count">
            <span className="swap">
              <span data-stage-num>{chapters[0].number}</span>
            </span>{' '}
            / {String(chapters.length).padStart(2, '0')}
          </span>
        </div>
        <div className="stage__foot">
          <div className="stage__ticks" role="group" aria-label="Jump to a product">
            {chapters.map((c) => (
              <button key={c.id} type="button" aria-label={`${c.number} ${c.index}`} onClick={() => jump(c.id)}>
                <i />
              </button>
            ))}
          </div>
          <span className="stage__caption">Illustrations, not specific stock</span>
        </div>
      </div>
    </div>
  );
}
