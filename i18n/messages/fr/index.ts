import { en, type TranslationMessages } from "../en";
import { achievements } from "./achievements";
import { auth } from "./auth";
import { chat } from "./chat";
import { common } from "./common";
import { community } from "./community";
import { craving } from "./craving";
import { goals } from "./goals";
import { home } from "./home";
import { intro } from "./intro";
import { language } from "./language";
import { layout } from "./layout";
import { legal } from "./legal";
import { missions } from "./missions";
import { notifications } from "./notifications";
import { onboarding } from "./onboarding";
import { paywall } from "./paywall";
import { premium } from "./premium";
import { profile } from "./profile";
import { settings } from "./settings";
import { stats } from "./stats";
import { tabs } from "./tabs";
import { theme } from "./theme";
import { welcome } from "./welcome";

export const fr: TranslationMessages = {
  ...en,
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
};
