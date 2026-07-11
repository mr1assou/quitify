import { useMemo } from "react";

import { INTRO_SLIDES } from "@/constants/app/intro";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { TranslationKey } from "@/i18n/translate";
import type { IntroSlideContent, IntroSlideId } from "@/types/app/intro";

const INTRO_SLIDE_KEYS: Record<
  IntroSlideId,
  { title: TranslationKey; body: TranslationKey }
> = {
  success: { title: "intro.success.title", body: "intro.success.body" },
  "short-time": { title: "intro.shortTime.title", body: "intro.shortTime.body" },
  transformation: {
    title: "intro.transformation.title",
    body: "intro.transformation.body",
  },
  chance: { title: "intro.chance.title", body: "intro.chance.body" },
  "after-onboard": {
    title: "intro.afterOnboard.title",
    body: "intro.afterOnboard.body",
  },
};

export function useIntroSlides(): readonly IntroSlideContent[] {
  const { t } = useTranslation();

  return useMemo(
    () =>
      INTRO_SLIDES.map((slide) => {
        const keys = INTRO_SLIDE_KEYS[slide.id];
        return {
          ...slide,
          title: t(keys.title),
          body: t(keys.body),
        };
      }),
    [t],
  );
}
