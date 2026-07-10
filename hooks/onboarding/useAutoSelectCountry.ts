import { useEffect, useRef } from "react";

import type { Country } from "@/types/app/country";
import { getDeviceCountryCodeAsync } from "@/utils/device/getDeviceCountryCode";

/** Pre-fills country + currency from the user's location when none is chosen yet. */
export function useAutoSelectCountry(
  countries: Country[],
  ready: boolean,
  selectedCode: string | undefined,
  onSelect: (country: Country) => void,
) {
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!ready || appliedRef.current || selectedCode || countries.length === 0) return;

    let cancelled = false;

    void (async () => {
      const deviceCode = await getDeviceCountryCodeAsync();
      if (cancelled || appliedRef.current || !deviceCode) return;

      const match = countries.find(
        (country) => country.code.toUpperCase() === deviceCode.toUpperCase(),
      );
      if (!match) return;

      appliedRef.current = true;
      onSelect(match);
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, selectedCode, countries, onSelect]);
}
