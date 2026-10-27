// Figures that count up the first time they are seen ("8,000 W" runs from "0 W"). Only figures of ten or more move;
// single digits ("2 × 5,500 W", "4 AC outlets") stay as written, so short counts never flicker.

const FIGURE = /\d[\d,]*/g;
const valueOf = (token: string) => Number(token.replace(/,/g, ''));

/** Whether `text` holds a figure worth counting up (ten or more). */
export function hasCount(text: string): boolean {
  return (text.match(FIGURE) ?? []).some((t) => valueOf(t) >= 10);
}

/** `text` with every figure of ten or more scaled by `progress` (clamped to 0..1; not a number shows the final text). */
export function countUpText(text: string, progress: number): string {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 1;
  return text.replace(FIGURE, (token) => {
    const value = valueOf(token);
    if (value < 10) return token;
    const shown = Math.round(value * p);
    return token.includes(',') ? shown.toLocaleString('en-US') : String(shown);
  });
}
