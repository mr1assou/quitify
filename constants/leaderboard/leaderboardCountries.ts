const FLAG_CDN_WIDTH = 80;

export const LEADERBOARD_COUNTRY_CODES = [
  "us",
  "ca",
  "gb",
  "fr",
  "de",
  "au",
  "br",
  "in",
  "jp",
  "mx",
] as const;

const COUNTRY_LABELS: Record<string, string> = {
  us: "United States",
  ca: "Canada",
  gb: "United Kingdom",
  fr: "France",
  de: "Germany",
  au: "Australia",
  br: "Brazil",
  in: "India",
  jp: "Japan",
  mx: "Mexico",
  ma: "Morocco",
  pt: "Portugal",
  ie: "Ireland",
  eg: "Egypt",
  ar: "Argentina",
};

export function flagUrlForCode(code: string): string {
  const normalized = code.toLowerCase();
  return `https://flagcdn.com/w${FLAG_CDN_WIDTH}/${normalized}.png`;
}

/** Synthetic country flags cycled across global-rank players. */
export const LEADERBOARD_COUNTRY_FLAGS = LEADERBOARD_COUNTRY_CODES.map((code) =>
  flagUrlForCode(code),
);

export function countryCodeForRank(rank: number): (typeof LEADERBOARD_COUNTRY_CODES)[number] {
  const index = Math.abs(rank - 1) % LEADERBOARD_COUNTRY_CODES.length;
  return LEADERBOARD_COUNTRY_CODES[index];
}

export function countryLabelForRank(rank: number): string {
  return COUNTRY_LABELS[countryCodeForRank(rank)];
}

export function countryFlagForRank(rank: number): string {
  return flagUrlForCode(countryCodeForRank(rank));
}

export function countryMetaForRank(rank: number) {
  const code = countryCodeForRank(rank);
  return {
    code,
    label: COUNTRY_LABELS[code],
    flag: flagUrlForCode(code),
  };
}

export function countryLabelForCode(code?: string): string | undefined {
  if (!code || code.length !== 2) return undefined;
  return COUNTRY_LABELS[code.toLowerCase()];
}

export function resolveCountryLabel(code?: string, rank?: number): string {
  return (
    countryLabelForCode(code) ??
    (rank ? countryLabelForRank(rank) : undefined) ??
    "Global"
  );
}

export function resolveCountryFlagUrl(
  countryFlag?: string,
  countryCode?: string,
): string | undefined {
  if (countryCode?.length === 2) return flagUrlForCode(countryCode);
  if (countryFlag?.trim()) return countryFlag.trim();
  return undefined;
}
