export type PaywallPlanId = "monthly" | "yearly";

/** Plan metadata only — prices always come from RevenueCat / the store. */
export const PAYWALL_PLAN_META = [
  {
    id: "monthly" as const,
    label: "Monthly plan",
    rightPeriod: "/mo",
    subPeriod: null,
    trial: "3 days free trial",
    recommended: false,
  },
  {
    id: "yearly" as const,
    label: "Yearly plan",
    rightPeriod: "/mo",
    subPeriod: "/year",
    trial: "7 days free trial",
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
  /** Optional strikethrough list price (win-back / special offer). */
  originalRightPrice?: string | null;
  originalSubPrice?: string | null;
};
