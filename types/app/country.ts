import type { ImageSourcePropType } from "react-native";

/** Normalized country row for onboarding / profile UI. */
export type Country = {
  /** ISO 3166-1 alpha-2 (e.g. `FR`). */
  code: string;
  name: string;
  /** Existing URL representation retained for the profile API and other app surfaces. */
  flagPng: string;
  /** Bundled flag image used by the onboarding country picker. */
  flagAsset: ImageSourcePropType;
  /** ISO 4217 currency code used for this country (e.g. `EUR`). */
  currencyCode: string;
};
