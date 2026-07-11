import type { TranslateFn } from "@/utils/i18n/localizeCatalog";

type LockedDayCopy = {
  title: string;
  message: string;
};

/** Copy shown when the user taps a locked plan day on the map. */
export function getPlanDayLockedCopy(day: number, t: TranslateFn): LockedDayCopy {
  if (day <= 1) {
    return {
      title: t("common.notAvailableYet"),
      message: t("common.planOpensOnQuitDay"),
    };
  }

  const previousDay = day - 1;

  return {
    title: t("missions.lockedTitle", { day }),
    message: t("missions.lockedMessage", { previousDay }),
  };
}
