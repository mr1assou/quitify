import { DEFAULT_CIGARETTES_PER_PACK } from "@/constants/onboardingNicotineBands";
import type { AuthMeResponse } from "@/services/auth/meApi";
import type { UserProfile } from "@/types";

import { parsePackPrice } from "./parsePackPrice";

function parseUtcMs(iso?: string): number | null {
  if (!iso) return null;
  const parsed = Date.parse(iso);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildProfileFromMe(me: AuthMeResponse): UserProfile {
  const quitDate = parseUtcMs(me.quitDate) ?? Date.now();
  const streakStart = parseUtcMs(me.streakStart) ?? quitDate;

  return {
    name: me.name,
    quitDate,
    streakStart,
    currentAttemptNumber: me.currentAttemptNumber ?? 1,
    slipCigarettesTotal: me.slipCigarettesTotal ?? 0,
    cigarettesPerDay: me.cigarettesPerDay ?? 0,
    cigarettesPerPack: me.cigarettesPerPack ?? DEFAULT_CIGARETTES_PER_PACK,
    packCost: parsePackPrice(me.packPrice),
    countryFlag: me.countryFlag,
    currency: me.currency ?? "USD",
  };
}
