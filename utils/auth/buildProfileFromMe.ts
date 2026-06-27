import { DEFAULT_CIGARETTES_PER_PACK } from "@/constants/onboarding/onboardingNicotineBands";
import type { AuthMeResponse } from "@/services/auth/meApi";
import type { UserProfile } from "@/types";
import { mapSexFromApi } from "@/utils/profile/mapSexFromApi";
import { resolveProfileImageUrl } from "@/utils/profile/resolveProfileImageUrl";

import { parsePackPrice } from "./parsePackPrice";

function parseUtcMs(iso?: string): number | null {
  if (!iso) return null;
  const parsed = Date.parse(iso);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildProfileFromMe(me: AuthMeResponse): UserProfile {
  const quitDate = parseUtcMs(me.quitDate) ?? Date.now();
  const streakStart = parseUtcMs(me.streakStart) ?? quitDate;

  const sex = mapSexFromApi(me.sex);

  return {
    name: me.name,
    sex,
    quitDate,
    streakStart,
    currentAttemptNumber: me.currentAttemptNumber ?? 1,
    slipCigarettesTotal: me.slipCigarettesTotal ?? 0,
    cigarettesPerDay: me.cigarettesPerDay ?? 0,
    cigarettesPerPack: me.cigarettesPerPack ?? DEFAULT_CIGARETTES_PER_PACK,
    packCost: parsePackPrice(me.packPrice),
    countryFlag: me.countryFlag,
    imageUrl: resolveProfileImageUrl(me.imageUrl, sex),
    currency: me.currency ?? "USD",
    economicsSegments: me.economicsSegments,
  };
}
