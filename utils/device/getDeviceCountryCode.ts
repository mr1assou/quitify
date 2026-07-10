import * as Cellular from "expo-cellular";
import { getLocales } from "expo-localization";
import { Platform } from "react-native";

function normalizeCountryCode(code: string | null | undefined): string | null {
  if (!code) return null;
  const upper = code.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(upper) ? upper : null;
}

function regionFromLocale(locale: string): string | null {
  const segments = locale.replace(/_/g, "-").split("-");
  for (let i = segments.length - 1; i >= 0; i -= 1) {
    const part = segments[i].toUpperCase();
    if (/^[A-Z]{2}$/.test(part)) return part;
  }
  return null;
}

/** Best-effort ISO 3166-1 alpha-2 country code — no location permission required. */
export async function getDeviceCountryCodeAsync(): Promise<string | null> {
  if (Platform.OS !== "web") {
    try {
      const cellular = normalizeCountryCode(await Cellular.getIsoCountryCodeAsync());
      if (cellular) return cellular;
    } catch {
      // ignore
    }
  }

  try {
    for (const locale of getLocales()) {
      const code = normalizeCountryCode(locale.regionCode);
      if (code) return code;
    }
  } catch {
    // ignore
  }

  try {
    const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (intlLocale) {
      const code = regionFromLocale(intlLocale);
      if (code) return code;
    }
  } catch {
    // ignore
  }

  return null;
}
