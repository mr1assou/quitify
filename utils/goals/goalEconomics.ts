export type GoalEconomics = {
  cigarettesPerDay: number;
  cigarettesPerPack: number;
  packPrice: number;
};

export function dailyCigaretteSavings(economics: GoalEconomics): number {
  const perPack = Math.max(1, economics.cigarettesPerPack);
  return (Math.max(0, economics.cigarettesPerDay) / perPack) * economics.packPrice;
}

export function cigarettesAvoidedAtSmokeFreeDays(
  days: number,
  economics: GoalEconomics,
): number {
  return Math.max(0, days) * Math.max(0, economics.cigarettesPerDay);
}

export function moneySavedAtSmokeFreeDays(
  days: number,
  economics: GoalEconomics,
): number {
  return Math.max(0, days) * dailyCigaretteSavings(economics);
}
