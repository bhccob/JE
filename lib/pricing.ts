// Aruba utility rates and solar constants. Edit here; the calculator reads nothing else.
export const HOUSEHOLD_RATE_AWG_PER_KWH = 0.376; // ≈ $0.211 USD
export const BUSINESS_RATE_AWG_PER_KWH = 0.56; // ≈ $0.314 USD
export const USD_PER_AWG = 0.559;
export const SUN_HOURS_PER_DAY = 5.5;
export const CO2_KG_PER_KWH = 0.55;

// Assumptions behind the estimate. Tune with real install data.
export const PERFORMANCE_RATIO = 0.8; // inverter, heat and soiling losses
export const ROOF_KWP_PER_M2 = 0.18; // one ~2 m² 400 W panel plus spacing
export const INSTALLED_COST_AWG_PER_KWP = 2700;
export const BATTERY_COST_AWG = 9500; // one 10 kWh modular stack, installed
export const DAYS_PER_MONTH = 30.42;
export const NATIONAL_RE_TARGET = 0.5; // 50% renewable by 2030

export const CALC_LIMITS = {
  bill: { min: 100, max: 3000, step: 25, initial: 650 },
  roof: { min: 20, max: 300, step: 5, initial: 90 },
} as const;

export interface SolarEstimate {
  systemKwp: number;
  paybackYears: number;
  monthlySavingsAwg: number;
  monthlySavingsUsd: number;
  co2TonnesPerYear: number;
  coverage: number;
  roofLimited: boolean;
}

export function estimateSolar({
  monthlyBillAwg,
  roofM2,
  backup,
  rate = HOUSEHOLD_RATE_AWG_PER_KWH,
}: {
  monthlyBillAwg: number;
  roofM2: number;
  backup: boolean;
  rate?: number;
}): SolarEstimate {
  const monthlyKwh = monthlyBillAwg / rate;
  const kwhPerKwpPerMonth = SUN_HOURS_PER_DAY * PERFORMANCE_RATIO * DAYS_PER_MONTH;
  const neededKwp = monthlyKwh / kwhPerKwpPerMonth;
  const roofMaxKwp = roofM2 * ROOF_KWP_PER_M2;
  const systemKwp = Math.max(0.5, Math.min(neededKwp, roofMaxKwp));

  const monthlyProductionKwh = systemKwp * kwhPerKwpPerMonth;
  const offsetKwh = Math.min(monthlyProductionKwh, monthlyKwh);
  const monthlySavingsAwg = offsetKwh * rate;
  const systemCost = systemKwp * INSTALLED_COST_AWG_PER_KWP + (backup ? BATTERY_COST_AWG : 0);
  const paybackYears = monthlySavingsAwg > 0 ? systemCost / (monthlySavingsAwg * 12) : 0;

  return {
    systemKwp: Math.round(systemKwp * 10) / 10,
    paybackYears: Math.round(paybackYears * 10) / 10,
    monthlySavingsAwg: Math.round(monthlySavingsAwg),
    monthlySavingsUsd: Math.round(monthlySavingsAwg * USD_PER_AWG),
    co2TonnesPerYear: Math.round(((monthlyProductionKwh * 12 * CO2_KG_PER_KWH) / 1000) * 10) / 10,
    coverage: Math.min(1, monthlyProductionKwh / monthlyKwh),
    roofLimited: neededKwp > roofMaxKwp,
  };
}
