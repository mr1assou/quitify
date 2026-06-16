import type { IntroSlideContent, IntroSlideId } from "@/types/app/intro";

export type { IntroSlideContent, IntroSlideId } from "@/types/app/intro";

const UNIFIED_GRADIENT_SLIDE_IDS = new Set<IntroSlideId>(["after-onboard"]);

export function introUsesUnifiedGradient(id: IntroSlideId): boolean {
  return UNIFIED_GRADIENT_SLIDE_IDS.has(id);
}

const INTRO_HERO_IMAGE_WIN_HEIGHT_RATIO = 0.5;
const INTRO_HERO_IMAGE_MAX_HEIGHT_PX = 470;

/** Hero image height on the final intro slide (`after-onboard`). */
export function introHeroImageHeight(windowHeight: number): number {
  return Math.min(
    Math.round(windowHeight * INTRO_HERO_IMAGE_WIN_HEIGHT_RATIO),
    INTRO_HERO_IMAGE_MAX_HEIGHT_PX,
  );
}

export const INTRO_SLIDES: readonly IntroSlideContent[] = [
  {
    id: "success",
    title: "Success isn’t luck",
    body: "Most people struggle alone. Quitify supports you when it matters most.",
  },
  {
    id: "short-time",
    title: "The hardest part is temporary",
    body: "Quitify helps you get through it—and beyond that, it gets easier.",
  },
  {
    id: "transformation",
    title: "Your transformation starts now",
    body: "As you move toward a smoke-free life, you’ll grow stronger, more in control, and healthier every day.",
  },
  {
    id: "chance",
    title: "Your moment is now",
    body: "Start today and take back control of your life—one step at a time.",
  },
  {
    id: "after-onboard",
    title: "Join those who chose to quit",
    body: "Join people who have successfully broken the habit with Quitify—real progress, real support, and a path that actually works.",
  },
] as const;
