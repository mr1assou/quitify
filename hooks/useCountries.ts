import { useCallback, useEffect, useState } from "react";

import { fetchRestCountries } from "@/services/restCountries";
import type { Country } from "@/types/country";
import { mapRestCountriesToCountries } from "@/utils/countries";

type Status = "idle" | "loading" | "ready" | "error";

let cachedCountries: Country[] | null = null;

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
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const dtos = await fetchRestCountries();
      const mapped = mapRestCountriesToCountries(dtos);
      cachedCountries = mapped;
      setCountries(mapped);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not load countries");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { countries, status, error, retry: load };
}
