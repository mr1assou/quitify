import type { AppLocale } from "@/types/i18n/locale";
import type { QuitPlan } from "@/types";

import enPlan from "./quit-plan/en.json";

import frPlan from "./quit-plan/fr.json";
import dePlan from "./quit-plan/de.json";
import esPlan from "./quit-plan/es.json";
import ptPlan from "./quit-plan/pt.json";

const PLANS: Record<AppLocale, QuitPlan> = {
  en: enPlan as QuitPlan,
  fr: frPlan as QuitPlan,
  de: dePlan as QuitPlan,
  es: esPlan as QuitPlan,
  pt: ptPlan as QuitPlan,
};

export function getQuitPlanForLocale(locale: AppLocale): QuitPlan {
  return PLANS[locale] ?? PLANS.en;
}

export { enPlan as EN_QUIT_PLAN };
