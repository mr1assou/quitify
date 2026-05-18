import type { CommunityUser } from "@/types/community";
import { resolveBadgeIdForSmokeFreeDays } from "@/utils/badges";

/** Pseudo id used for the signed-in user across community + chat. */
export const CURRENT_USER_ID = "me";

function buildUser(
  partial: Omit<CommunityUser, "badgeId"> & { badgeId?: string },
): CommunityUser {
  return {
    ...partial,
    badgeId: partial.badgeId ?? resolveBadgeIdForSmokeFreeDays(partial.smokeFreeDays, true),
  };
}

export const COMMUNITY_USERS: CommunityUser[] = [
  buildUser({
    id: CURRENT_USER_ID,
    name: "You",
    handle: "you",
    bio: "Quitting smoking, one day at a time.",
    smokeFreeDays: 95,
    isCurrentUser: true,
    location: "Home",
  }),
  buildUser({
    id: "user-amina",
    name: "Amina",
    handle: "aminaq",
    bio: "Mom of two. Quit for my kids. Day by day.",
    smokeFreeDays: 187,
    location: "Casablanca",
  }),
  buildUser({
    id: "user-lucas",
    name: "Lucas",
    handle: "lucasr",
    bio: "Runner. Replaced cigarettes with 5k runs.",
    smokeFreeDays: 372,
    location: "Lyon",
  }),
  buildUser({
    id: "user-sofia",
    name: "Sofia",
    handle: "sofs",
    bio: "Two attempts before. Third one is sticking.",
    smokeFreeDays: 62,
    location: "Lisbon",
  }),
  buildUser({
    id: "user-noah",
    name: "Noah",
    handle: "noahb",
    bio: "Coffee + walks instead of smoke breaks.",
    smokeFreeDays: 18,
    location: "Berlin",
  }),
  buildUser({
    id: "user-yuki",
    name: "Yuki",
    handle: "yuki",
    bio: "Lungs love me again.",
    smokeFreeDays: 540,
    location: "Tokyo",
  }),
  buildUser({
    id: "user-emma",
    name: "Emma",
    handle: "emmaw",
    bio: "Quit twice. Sober and smoke-free.",
    smokeFreeDays: 240,
    location: "Dublin",
  }),
  buildUser({
    id: "user-omar",
    name: "Omar",
    handle: "omarz",
    bio: "Saving money for a guitar.",
    smokeFreeDays: 41,
    location: "Cairo",
  }),
  buildUser({
    id: "user-chloe",
    name: "Chloé",
    handle: "chlo",
    bio: "Pregnant. Quit cold turkey.",
    smokeFreeDays: 110,
    location: "Paris",
  }),
  buildUser({
    id: "user-leo",
    name: "Leo",
    handle: "leom",
    bio: "Smoked for 22 years. Free for one.",
    smokeFreeDays: 410,
    location: "Buenos Aires",
  }),
];

export function getCommunityUser(id: string): CommunityUser | undefined {
  return COMMUNITY_USERS.find((u) => u.id === id);
}
