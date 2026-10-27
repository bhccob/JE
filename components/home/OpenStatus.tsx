'use client';

import { useEffect, useState, type HTMLAttributes } from 'react';
import { arubaNow, openState } from '@/lib/store';

/**
 * "Open now, until 7:00 PM", in Aruba time. Worked out after load, so the server and the visitor's clock never
 * disagree; until then it says what is always true.
 */
export function OpenStatus({ className = '', ...rest }: HTMLAttributes<HTMLSpanElement>) {
  const [state, setState] = useState<{ open: boolean; line: string } | null>(null);
  useEffect(() => {
    const { day, hour } = arubaNow();
    setState(openState(day, hour));
  }, []);
  return (
    <span className={`status ${className}`.trim()} data-open={state?.open} {...rest}>
      <i aria-hidden="true" />
      <span>{state?.line ?? 'Open every day'}</span>
    </span>
  );
}
