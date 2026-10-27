// "Spend Afl. 500, get Afl. 25 back" (the owner's brief). The two programs, as the store states them (2026-10-27):
// regular members unlock a voucher worth Afl. 25 in store credit for every 500 points, and vouchers cannot be converted
// to cash; business members reach 5,000 points for 10% off for the rest of the year, until the next account
// anniversary, when points reset to 0. Exact terms are confirmed in store.
export const REWARD_STEP_AFL = 500;
export const REWARD_PER_STEP_AFL = 25;

export const POINTS_PER_VOUCHER = 500;
export const VOUCHER_AFL = 25;
export const BUSINESS_GOAL = 5000;
export const BUSINESS_DISCOUNT = 10;
/** How far the card on the page can be played with. */
export const POINTS_MAX = 5000;

const points = (n: number) => (Number.isFinite(n) && n > 0 ? Math.floor(n) : 0);

/** A regular member's vouchers, and how far they are into the next 500 points. */
export function regularCard(n: number) {
  const p = points(n);
  const vouchers = Math.floor(p / POINTS_PER_VOUCHER);
  const into = p % POINTS_PER_VOUCHER;
  return { vouchers, credit: vouchers * VOUCHER_AFL, fraction: into / POINTS_PER_VOUCHER, toNext: POINTS_PER_VOUCHER - into };
}

/** How far a business member is toward 10% off for the rest of the year. */
export function businessCard(n: number) {
  const p = points(n);
  return { reached: p >= BUSINESS_GOAL, fraction: Math.min(1, p / BUSINESS_GOAL), toGoal: Math.max(0, BUSINESS_GOAL - p) };
}

export const formatAfl = (n: number) => `Afl. ${Math.round(n).toLocaleString('en-US')}`;
export const formatPoints = (n: number) => `${Math.round(n).toLocaleString('en-US')} ${Math.round(n) === 1 ? 'point' : 'points'}`;
