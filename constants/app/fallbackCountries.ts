import type { Country } from "@/types/app/country";

/** Used when restcountries.com is blocked, rate-limited, or returns an invalid payload. */
export const FALLBACK_COUNTRIES: Country[] = [
  { code: "US", name: "United States", flagPng: "https://flagcdn.com/w320/us.png", currencyCode: "USD" },
  { code: "GB", name: "United Kingdom", flagPng: "https://flagcdn.com/w320/gb.png", currencyCode: "GBP" },
  { code: "FR", name: "France", flagPng: "https://flagcdn.com/w320/fr.png", currencyCode: "EUR" },
  { code: "DE", name: "Germany", flagPng: "https://flagcdn.com/w320/de.png", currencyCode: "EUR" },
  { code: "ES", name: "Spain", flagPng: "https://flagcdn.com/w320/es.png", currencyCode: "EUR" },
  { code: "IT", name: "Italy", flagPng: "https://flagcdn.com/w320/it.png", currencyCode: "EUR" },
  { code: "CA", name: "Canada", flagPng: "https://flagcdn.com/w320/ca.png", currencyCode: "CAD" },
  { code: "AU", name: "Australia", flagPng: "https://flagcdn.com/w320/au.png", currencyCode: "AUD" },
  { code: "MA", name: "Morocco", flagPng: "https://flagcdn.com/w320/ma.png", currencyCode: "MAD" },
  { code: "IN", name: "India", flagPng: "https://flagcdn.com/w320/in.png", currencyCode: "INR" },
  { code: "BR", name: "Brazil", flagPng: "https://flagcdn.com/w320/br.png", currencyCode: "BRL" },
  { code: "MX", name: "Mexico", flagPng: "https://flagcdn.com/w320/mx.png", currencyCode: "MXN" },
  { code: "NL", name: "Netherlands", flagPng: "https://flagcdn.com/w320/nl.png", currencyCode: "EUR" },
  { code: "BE", name: "Belgium", flagPng: "https://flagcdn.com/w320/be.png", currencyCode: "EUR" },
  { code: "CH", name: "Switzerland", flagPng: "https://flagcdn.com/w320/ch.png", currencyCode: "CHF" },
  { code: "PT", name: "Portugal", flagPng: "https://flagcdn.com/w320/pt.png", currencyCode: "EUR" },
  { code: "PL", name: "Poland", flagPng: "https://flagcdn.com/w320/pl.png", currencyCode: "PLN" },
  { code: "SE", name: "Sweden", flagPng: "https://flagcdn.com/w320/se.png", currencyCode: "SEK" },
  { code: "AE", name: "United Arab Emirates", flagPng: "https://flagcdn.com/w320/ae.png", currencyCode: "AED" },
  { code: "SA", name: "Saudi Arabia", flagPng: "https://flagcdn.com/w320/sa.png", currencyCode: "SAR" },
  { code: "EG", name: "Egypt", flagPng: "https://flagcdn.com/w320/eg.png", currencyCode: "EGP" },
  { code: "TN", name: "Tunisia", flagPng: "https://flagcdn.com/w320/tn.png", currencyCode: "TND" },
  { code: "DZ", name: "Algeria", flagPng: "https://flagcdn.com/w320/dz.png", currencyCode: "DZD" },
];
