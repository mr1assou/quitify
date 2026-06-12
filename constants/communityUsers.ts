import type { CommunityUser } from "@/types/community";
import { countryLabelForCode, flagUrlForCode } from "@/constants/leaderboardCountries";
import { resolveBadgeIdForSmokeFreeDays } from "@/utils/badges";

/** Pseudo id used for the signed-in user across community + chat. */
export const CURRENT_USER_ID = "me";

const LOCATION_COUNTRY_CODES: Record<string, string> = {
  Home: "us",
  Casablanca: "ma",
  Lyon: "fr",
  Lisbon: "pt",
  Berlin: "de",
  Tokyo: "jp",
  Dublin: "ie",
  Cairo: "eg",
  Paris: "fr",
  "Buenos Aires": "ar",
};

function countryCodeForLocation(location?: string): string {
  return location ? (LOCATION_COUNTRY_CODES[location] ?? "us") : "us";
}

function countryFlagForLocation(location?: string): string {
  return flagUrlForCode(countryCodeForLocation(location));
}

export function countryLabelForLocation(location?: string): string {
  return countryLabelForCode(countryCodeForLocation(location)) ?? "Global";
}

function buildUser(
  partial: Omit<CommunityUser, "badgeId" | "countryFlag" | "avatarRank" | "leaderboardRank"> & {
    badgeId?: string;
  },
  avatarRank: number,
  leaderboardRank: number,
): CommunityUser {
  return {
    ...partial,
    avatarRank,
    leaderboardRank,
    countryFlag: countryFlagForLocation(partial.location),
    badgeId: partial.badgeId ?? resolveBadgeIdForSmokeFreeDays(partial.smokeFreeDays, true),
  };
}

export const COMMUNITY_USERS: CommunityUser[] = [
  buildUser(
    {
      id: CURRENT_USER_ID,
      name: "You",
      handle: "you",
      bio: "Quitting smoking, one day at a time.",
      smokeFreeDays: 95,
      isCurrentUser: true,
      location: "Home",
    },
    1,
    0,
  ),
  buildUser(
    {
      id: "user-amina",
      name: "Amina",
      handle: "aminaq",
      bio: "Mom of two. Quit for my kids. Day by day.",
      smokeFreeDays: 187,
      location: "Casablanca",
    },
    2,
    5,
  ),
  buildUser(
    {
      id: "user-lucas",
      name: "Lucas",
      handle: "lucasr",
      bio: "Runner. Replaced cigarettes with 5k runs.",
      smokeFreeDays: 372,
      location: "Lyon",
    },
    3,
    3,
  ),
  buildUser(
    {
      id: "user-sofia",
      name: "Sofia",
      handle: "sofs",
      bio: "Two attempts before. Third one is sticking.",
      smokeFreeDays: 62,
      location: "Lisbon",
    },
    4,
    7,
  ),
  buildUser(
    {
      id: "user-noah",
      name: "Noah",
      handle: "noahb",
      bio: "Coffee + walks instead of smoke breaks.",
      smokeFreeDays: 18,
      location: "Berlin",
    },
    5,
    9,
  ),
  buildUser(
    {
      id: "user-yuki",
      name: "Yuki",
      handle: "yuki",
      bio: "Lungs love me again.",
      smokeFreeDays: 540,
      location: "Tokyo",
    },
    6,
    1,
  ),
  buildUser(
    {
      id: "user-emma",
      name: "Emma",
      handle: "emmaw",
      bio: "Quit twice. Sober and smoke-free.",
      smokeFreeDays: 240,
      location: "Dublin",
    },
    7,
    4,
  ),
  buildUser(
    {
      id: "user-omar",
      name: "Omar",
      handle: "omarz",
      bio: "Saving money for a guitar.",
      smokeFreeDays: 41,
      location: "Cairo",
    },
    8,
    8,
  ),
  buildUser(
    {
      id: "user-chloe",
      name: "Chloé",
      handle: "chlo",
      bio: "Pregnant. Quit cold turkey.",
      smokeFreeDays: 110,
      location: "Paris",
    },
    9,
    6,
  ),
  buildUser(
    {
      id: "user-leo",
      name: "Leo",
      handle: "leom",
      bio: "Smoked for 22 years. Free for one.",
      smokeFreeDays: 410,
      location: "Buenos Aires",
    },
    10,
    2,
  ),
];

export function getCommunityUser(id: string): CommunityUser | undefined {
  return COMMUNITY_USERS.find((u) => u.id === id);
}
