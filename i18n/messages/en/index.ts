import {
  achievements,
  chat,
  community,
  goals,
  layout,
  legal,
  missions,
  notifications,
  premium,
  profile,
  stats,
} from "./rest";
import { auth } from "./auth";
import { common } from "./common";
import { craving } from "./craving";
import { home } from "./home";
import { intro } from "./intro";
import { language } from "./language";
import { onboarding } from "./onboarding";
import { paywall } from "./paywall";
import { settings } from "./settings";
import { tabs } from "./tabs";
import { theme } from "./theme";
import { welcome } from "./welcome";

export const en = {
  common,
  welcome,
  settings,
  theme,
  tabs,
  language,
  intro,
  onboarding,
  auth,
  paywall,
  home,
  craving,
  goals,
  missions,
  community,
  chat,
  stats,
  achievements,
  profile,
  notifications,
  layout,
  premium,
  legal,
} as const;

type MessageSection<T> = T extends string
  ? string
  : {
      [K in keyof T]: MessageSection<T[K]>;
    };

export type TranslationMessages = {
  [Section in keyof typeof en]: MessageSection<(typeof en)[Section]>;
};
