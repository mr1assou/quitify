import type { ImageSourcePropType } from "react-native";

/** Fallback artwork for badges without their own image yet. */
export const DEFAULT_BADGE_IMAGE = require("../assets/images/badges/first_step.png");

const BADGE_IMAGES: Partial<Record<string, ImageSourcePropType>> = {
  "first-step": DEFAULT_BADGE_IMAGE,
  "rising-quitter": require("../assets/images/badges/rising_quitter.png"),
  "craving-crusher": require("../assets/images/badges/craving_crusher.png"),
  "two-weeks-free": require("../assets/images/badges/two_weeks.png"),
  "top-rated": require("../assets/images/badges/top_rated_quitter.png"),
  "top-rated-plus": require("../assets/images/badges/top_rated_plus.png"),
  champion: require("../assets/images/badges/champion.png"),
  "half-year-hero": require("../assets/images/badges/half_year.png"),
  "year-free": require("../assets/images/badges/year.png"),
  unstoppable: require("../assets/images/badges/unstoppable.png"),
  "two-year-free": require("../assets/images/badges/two_years.png"),
  "thousand-day-legend": require("../assets/images/badges/thousand_day.png"),
};

export function getBadgeImage(badgeId: string): ImageSourcePropType {
  return BADGE_IMAGES[badgeId] ?? DEFAULT_BADGE_IMAGE;
}
