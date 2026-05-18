import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SystemUI from "expo-system-ui";
import { useColorScheme as useNwColorScheme } from "nativewind";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getThemeColors } from "@/constants/theme";
import type { ThemeColors, ThemePreference, ThemeResolved } from "@/types";

export type { ThemePreference } from "@/types";

const STORAGE_KEY = "@quit_smoking/theme_preference";

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  resolved: ThemeResolved;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemePreference(v: unknown): v is ThemePreference {
  return v === "light" || v === "dark" || v === "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // NativeWind owns the source of truth for the `dark:` Tailwind variant.
  // We mirror our `preference` into it so `dark:` classes actually flip.
  const { colorScheme, setColorScheme } = useNwColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (isThemePreference(raw)) {
          setPreferenceState(raw);
          setColorScheme(raw);
        }
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, [setColorScheme]);

  const setPreference = useCallback(
    (p: ThemePreference) => {
      setPreferenceState(p);
      setColorScheme(p);
      AsyncStorage.setItem(STORAGE_KEY, p).catch(() => {});
    },
    [setColorScheme],
  );

  const resolved: ThemeResolved = useMemo(
    () => (colorScheme === "dark" ? "dark" : "light"),
    [colorScheme],
  );

  const colors = useMemo(() => getThemeColors(resolved), [resolved]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, setPreference, resolved, colors }),
    [preference, setPreference, resolved, colors],
  );

  // Avoid one-frame flash with the wrong palette before AsyncStorage resolves.
  if (!hydrated) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
