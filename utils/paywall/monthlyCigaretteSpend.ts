const DAYS_PER_MONTH = 30;

type HabitInput = {
  cigarettesPerDay: number;
  cigarettesPerPack: number;
  packCost: number;
};

/** Estimated monthly cigarette spend from onboarding / habit settings. */
export function computeMonthlyCigaretteSpend({
  cigarettesPerDay,
  cigarettesPerPack,
  packCost,
}: HabitInput): number {
  const perDay = Math.max(0, cigarettesPerDay);
  const perPack = Math.max(1, cigarettesPerPack);
  const price = Math.max(0, packCost);
  const packsPerMonth = (perDay * DAYS_PER_MONTH) / perPack;

  return Math.round(packsPerMonth * price * 100) / 100;
}
