import type { AppLocale } from "@/types/i18n/locale";
import type { QuitPlan } from "@/types";

import enPlan from "./quit-plan/en.json";
import frPlan from "./quit-plan/fr.json";

const PLANS: Record<AppLocale, QuitPlan> = {
  en: enPlan as QuitPlan,
  fr: frPlan as QuitPlan,
};

export function getQuitPlanForLocale(locale: AppLocale = "en"): QuitPlan {
  return PLANS[locale] ?? PLANS.en;
}

export { enPlan as EN_QUIT_PLAN };
