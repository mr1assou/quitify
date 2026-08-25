/** Paywall entry points — kept as query `source` for funnel routing / future ads SDK. */
export const PAYWALL_SOURCE = {
  post_signup: "post_signup",
  day5: "day5",
  premium_gate: "premium_gate",
  profile: "profile",
  header: "header",
  unknown: "unknown",
} as const;

export type PaywallSource =
  (typeof PAYWALL_SOURCE)[keyof typeof PAYWALL_SOURCE];

export function parsePaywallSource(value: unknown): PaywallSource {
  if (
    typeof value === "string" &&
    (Object.values(PAYWALL_SOURCE) as string[]).includes(value)
  ) {
    return value as PaywallSource;
  }
  return PAYWALL_SOURCE.unknown;
}
