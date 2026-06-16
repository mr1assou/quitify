/** Normalized country row for onboarding / profile UI. */
export type Country = {
  /** ISO 3166-1 alpha-2 (e.g. `FR`). */
  code: string;
  name: string;
  flagPng: string;
  /** Primary ISO 4217 code from REST Countries (e.g. `EUR`). */
  currencyCode: string;
};

/** Partial REST Countries v3.1 payload (`?fields=name,flags,currencies,cca2`). */
export type RestCountryDto = {
  name: { common: string };
  flags: { png: string };
  cca2: string;
  currencies?: Record<string, { name: string; symbol?: string }>;
};
