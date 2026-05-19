import type { Country, RestCountryDto } from "@/types/country";

/**
 * Common countries listed first in the picker (ISO alpha-2).
 * Remaining countries follow A–Z so Afghanistan is not at the top.
 */
const PICKER_PRIORITY_CODES: readonly string[] = [
  "US",
  "GB",
  "FR",
  "DE",
  "ES",
  "IT",
  "CA",
  "AU",
  "MA",
  "IN",
  "BR",
  "MX",
  "NL",
  "BE",
  "CH",
  "PT",
  "PL",
  "SE",
  "AE",
  "SA",
  "EG",
  "TN",
  "DZ",
];

/** Maps API rows to app countries; drops entries without a currency. */
export function mapRestCountriesToCountries(dtos: RestCountryDto[]): Country[] {
  const out: Country[] = [];
  for (const dto of dtos) {
    const mapped = mapRestCountryDto(dto);
    if (mapped) out.push(mapped);
  }
  return sortCountriesForPicker(out);
}

function mapRestCountryDto(dto: RestCountryDto): Country | null {
  const code = dto.cca2?.trim().toUpperCase();
  const name = dto.name?.common?.trim();
  const flagPng = dto.flags?.png;
  const currencyCode = primaryCurrencyCode(dto.currencies);

  if (!code || !name || !flagPng || !currencyCode) return null;

  return { code, name, flagPng, currencyCode };
}

function primaryCurrencyCode(
  currencies: RestCountryDto["currencies"],
): string | undefined {
  const keys = Object.keys(currencies ?? {});
  if (keys.length === 0) return undefined;
  return keys[0];
}

export function sortCountriesByName(countries: Country[]): Country[] {
  return countries.slice().sort((a, b) => a.name.localeCompare(b.name));
}

/** Priority countries first, then the rest alphabetically by name. */
export function sortCountriesForPicker(countries: Country[]): Country[] {
  const byCode = new Map(countries.map((c) => [c.code, c]));
  const priority: Country[] = [];

  for (const code of PICKER_PRIORITY_CODES) {
    const country = byCode.get(code);
    if (country) {
      priority.push(country);
      byCode.delete(code);
    }
  }

  const rest = sortCountriesByName([...byCode.values()]);
  return [...priority, ...rest];
}

export function findCountryByCode(
  countries: readonly Country[],
  code: string | undefined,
): Country | undefined {
  if (!code) return undefined;
  const upper = code.toUpperCase();
  return countries.find((c) => c.code === upper);
}
