'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { CaretDown, Check } from '@phosphor-icons/react/dist/ssr';
import { QUOTE_TOPICS, type QuoteTopic } from '@/lib/quote';

/** "Hybrid inverter", "Hybrid inverter, Generator", "Hybrid inverter, Generator and 2 more". */
function summary(topics: QuoteTopic[]) {
  const labels = QUOTE_TOPICS.filter((t) => topics.includes(t.id)).map((t) => t.label);
  if (labels.length <= 2) return labels.join(', ');
  return `${labels.slice(0, 2).join(', ')} and ${labels.length - 2} more`;
}

/**
 * A dropdown of what the quote is for, one or more. The menu holds real checkboxes, so it works with a keyboard and a
 * screen reader as a group of checkboxes; arrows move between them, Escape or Enter closes it.
 */
export function ProductPicker({
  labelId,
  value,
  onChange,
  error,
  describedBy,
}: {
  /** The visible field label, which names both the button and the menu. */
  labelId: string;
  value: QuoteTopic[];
  onChange: (next: QuoteTopic[]) => void;
  error?: string;
  describedBy?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const text = summary(value);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  const options = () => Array.from(root.current?.querySelectorAll<HTMLInputElement>('.picker__option input') ?? []);
  const close = () => {
    setOpen(false);
    button.current?.focus();
  };

  const onButtonKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => options()[0]?.focus());
    }
  };
  const onMenuKey = (e: KeyboardEvent) => {
    const list = options();
    const i = list.indexOf(document.activeElement as HTMLInputElement);
    if (e.key === 'Escape' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      list[(i + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length]?.focus();
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      list[e.key === 'Home' ? 0 : list.length - 1]?.focus();
    }
  };

  return (
    <div
      ref={root}
      className="picker"
      data-open={open}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        id={`${id}-button`}
        className="field__input picker__button"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-labelledby={`${labelId} ${id}-button`}
        aria-describedby={describedBy}
        data-invalid={Boolean(error) || undefined}
        data-field="topics"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKey}
      >
        <span className="picker__value" data-empty={!text}>
          {text || 'Choose products'}
        </span>
        <CaretDown size={16} weight="bold" className="picker__caret" aria-hidden="true" />
      </button>
      <div id={`${id}-menu`} className="picker__menu glass" role="group" aria-labelledby={labelId} hidden={!open} onKeyDown={onMenuKey}>
        {QUOTE_TOPICS.map((t) => (
          <label key={t.id} className="picker__option">
            <input
              type="checkbox"
              name="topics"
              value={t.id}
              checked={value.includes(t.id)}
              onChange={() => onChange(value.includes(t.id) ? value.filter((x) => x !== t.id) : [...value, t.id])}
            />
            <span className="picker__check" aria-hidden="true">
              <Check size={12} weight="bold" />
            </span>
            {t.label}
          </label>
        ))}
      </div>
    </div>
  );
}
