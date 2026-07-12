import type { AppLocale } from "@/types/i18n/locale";
import type { QuitPlan } from "@/types";

import enPlan from "./quit-plan/en.json";

export function getQuitPlanForLocale(_locale: AppLocale = "en"): QuitPlan {
  return enPlan as QuitPlan;
}

export { enPlan as EN_QUIT_PLAN };
