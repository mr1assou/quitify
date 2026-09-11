import type { PaywallPlanDisplay } from "@/constants/paywall/paywallPlans";
import {
  fetchPaywallOffering,
  fetchPaywallTrialEligibility,
  syncRevenueCatUser,
} from "@/services/purchases";
import { buildPaywallPlansFromOffering } from "@/utils/paywall/buildPaywallPlans";

type CacheEntry = {
  plans: PaywallPlanDisplay[];
  fetchedAt: number;
  userId: number;
};

const CACHE_TTL_MS = 60_000;
const RETRY_DELAYS_MS = [0, 400, 800, 1200, 2000, 3000];

let cache: CacheEntry | null = null;
let inflight: Promise<PaywallPlanDisplay[]> | null = null;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isFresh(entry: CacheEntry, userId: number): boolean {
  return entry.userId === userId && Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

export function getCachedPaywallPlans(userId: number): PaywallPlanDisplay[] | undefined {
  if (!cache || !isFresh(cache, userId) || cache.plans.length === 0) return undefined;
  return cache.plans;
}

export function clearPaywallPlansCache(): void {
  cache = null;
  inflight = null;
}

async function loadPaywallPlansFromStore(): Promise<PaywallPlanDisplay[]> {
  for (const delay of RETRY_DELAYS_MS) {
    if (delay > 0) await wait(delay);

    const offering = await fetchPaywallOffering();
    if (!offering) continue;

    const trialEligibility = await fetchPaywallTrialEligibility(offering);
    const plans = buildPaywallPlansFromOffering(offering, trialEligibility);
    if (plans.length > 0) return plans;
  }

  return [];
}

/** Prefetch (or reuse) first-paywall prices so they can show immediately. */
export function prefetchPaywallPlans(userId: number): Promise<PaywallPlanDisplay[]> {
  if (cache && isFresh(cache, userId) && cache.plans.length > 0) {
    return Promise.resolve(cache.plans);
  }
  if (inflight) return inflight;

  inflight = (async () => {
    await syncRevenueCatUser(userId);
    const plans = await loadPaywallPlansFromStore();
    if (plans.length > 0) {
      cache = { plans, fetchedAt: Date.now(), userId };
    }
    return plans;
  })()
    .catch(() => [] as PaywallPlanDisplay[])
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
