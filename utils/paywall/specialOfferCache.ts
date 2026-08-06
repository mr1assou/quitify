import type { SpecialPaywallOfferDisplay } from "@/types/paywall/specialOffer";
import { fetchSpecialPaywallOffer } from "@/services/purchases/revenueCat";

type CacheEntry = {
  offer: SpecialPaywallOfferDisplay | null;
  fetchedAt: number;
};

let cache: CacheEntry | null = null;
let inflight: Promise<SpecialPaywallOfferDisplay | null> | null = null;

const CACHE_TTL_MS = 60_000;

function isFresh(entry: CacheEntry): boolean {
  return Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

export function getCachedSpecialPaywallOffer(): SpecialPaywallOfferDisplay | null | undefined {
  if (!cache) return undefined;
  if (!isFresh(cache)) return undefined;
  return cache.offer;
}

export function clearSpecialPaywallOfferCache(): void {
  cache = null;
  inflight = null;
}

/** Prefetch (or reuse) the special offer so dismiss can open the spin screen immediately. */
export function prefetchSpecialPaywallOffer(): Promise<SpecialPaywallOfferDisplay | null> {
  if (cache && isFresh(cache)) {
    return Promise.resolve(cache.offer);
  }
  if (inflight) return inflight;

  inflight = fetchSpecialPaywallOffer()
    .then((offer) => {
      cache = { offer, fetchedAt: Date.now() };
      return offer;
    })
    .catch(() => {
      cache = { offer: null, fetchedAt: Date.now() };
      return null;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
