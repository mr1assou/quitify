import { useCallback, useEffect, useState } from "react";

import { FALLBACK_COUNTRIES } from "@/constants/app/fallbackCountries";
import { fetchRestCountries } from "@/services/restCountries";
import type { Country } from "@/types/app/country";
import { mapRestCountriesToCountries } from "@/utils/shared/countries";

type Status = "idle" | "loading" | "ready" | "error";

let cachedCountries: Country[] | null = null;

function applyFallbackCountries(): Country[] {
  cachedCountries = FALLBACK_COUNTRIES;
  return FALLBACK_COUNTRIES;
}

/** Loads and caches the REST Countries list for onboarding. */
export function useCountries() {
  const [countries, setCountries] = useState<Country[]>(cachedCountries ?? []);
  const [status, setStatus] = useState<Status>(
    cachedCountries ? "ready" : "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (cachedCountries) {
      setCountries(cachedCountries);
      setStatus("ready");
      setError(null);
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const dtos = await fetchRestCountries();
      const mapped = mapRestCountriesToCountries(dtos);
      if (mapped.length === 0) {
        throw new Error("No countries available");
      }
      cachedCountries = mapped;
      setCountries(mapped);
      setStatus("ready");
    } catch (e) {
      const fallback = applyFallbackCountries();
      setCountries(fallback);
      setStatus("ready");
      setError(null);
      if (__DEV__) {
        console.warn(
          "[useCountries] Using bundled fallback list:",
          e instanceof Error ? e.message : e,
        );
      }
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { countries, status, error, retry: load };
}
