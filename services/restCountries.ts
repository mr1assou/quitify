import type { RestCountryDto } from "@/types/app/country";

const REST_COUNTRIES_FIELDS = "name,flags,currencies,cca2";
const REST_COUNTRIES_URL = `https://restcountries.com/v3.1/all?fields=${REST_COUNTRIES_FIELDS}`;
const REQUEST_TIMEOUT_MS = 15_000;

function parseCountriesPayload(data: unknown): RestCountryDto[] {
  if (Array.isArray(data)) {
    return data as RestCountryDto[];
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const nested = record.data;
    if (Array.isArray(nested)) {
      return nested as RestCountryDto[];
    }
    if (typeof record.message === "string" && record.message.trim()) {
      throw new Error(record.message.trim());
    }
  }

  throw new Error("Unexpected countries response");
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Fetches the slim country list used for onboarding country + currency. */
export async function fetchRestCountries(): Promise<RestCountryDto[]> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const res = await fetchWithTimeout(REST_COUNTRIES_URL);
      if (!res.ok) {
        throw new Error(`Countries request failed (${res.status})`);
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("Countries service returned a non-JSON response");
      }

      const data: unknown = await res.json();
      return parseCountriesPayload(data);
    } catch (error) {
      lastError =
        error instanceof Error
          ? error.name === "AbortError"
            ? new Error("Countries request timed out")
            : error
          : new Error("Could not load countries");

      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
  }

  throw lastError ?? new Error("Could not load countries");
}
