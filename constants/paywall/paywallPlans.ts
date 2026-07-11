export type PaywallPlanId = "monthly" | "yearly";

/** Subscription list prices in USD (fallback when store prices are unavailable). */
export const PAYWALL_PLANS_USD = [
  {
    id: "monthly" as const,
    label: "Monthly plan",
    rightAmountUsd: 8.99,
    rightPeriod: "/mo",
    subAmountUsd: null,
    subPeriod: null,
    trial: null,
    recommended: false,
  },
  {
    id: "yearly" as const,
    label: "Yearly plan",
    rightAmountUsd: 4.17,
    rightPeriod: "/mo",
    subAmountUsd: 49.99,
    subPeriod: "/year",
    trial: "3 days free trial",
    recommended: true,
  },
] as const;

export type PaywallPlanDisplay = {
  id: PaywallPlanId;
  label: string;
  rightPrice: string;
  rightPeriod: string;
  subPrice: string | null;
  subPeriod: string | null;
  trial: string | null;
  recommended: boolean;
};
