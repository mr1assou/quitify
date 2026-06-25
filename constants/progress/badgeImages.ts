import type { ImageSourcePropType } from "react-native";

/** Fallback artwork for badges without their own image yet. */
export const DEFAULT_BADGE_IMAGE = require("../../assets/images/badges/first_step.webp");

const BADGE_IMAGES: Partial<Record<string, ImageSourcePropType>> = {
  "first-step": DEFAULT_BADGE_IMAGE,
  "rising-quitter": require("../../assets/images/badges/rising_quitter.webp"),
  "craving-crusher": require("../../assets/images/badges/craving_crusher.webp"),
  "two-weeks-free": require("../../assets/images/badges/two_weeks.webp"),
  "top-rated": require("../../assets/images/badges/top_rated_quitter.webp"),
  "top-rated-plus": require("../../assets/images/badges/top_rated_plus.webp"),
  champion: require("../../assets/images/badges/champion.webp"),
  "half-year-hero": require("../../assets/images/badges/half_year.webp"),
  "year-free": require("../../assets/images/badges/year.webp"),
  unstoppable: require("../../assets/images/badges/unstoppable.webp"),
  "two-year-free": require("../../assets/images/badges/two_years.webp"),
  "thousand-day-legend": require("../../assets/images/badges/thousand_day.webp"),
};

export function getBadgeImage(badgeId: string): ImageSourcePropType {
  return BADGE_IMAGES[badgeId] ?? DEFAULT_BADGE_IMAGE;
}
