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
    title: "Track Every Streak",
    body: "We save every detail of your quit journey, showing how far you've come.",
  },
  {
    id: "transformation",
    title: "Turn every smoke-free day into a win",
    body: "Earn Freedom Points, badges, and ranks that keep you going when motivation drops.",
  },
  {
    id: "chance",
    title: "Quit with a goal you can see",
    body: "Save money, reach new milestones, and win your life back while watching your progress every day.",
  },
  {
    id: "short-time",
    title: "Beat every craving",
    body: "Cravings feel huge, then they pass. Every one you beat is a win you keep.",
  },
  {
    id: "after-onboard",
    title: "Quitting is easier together",
    body: "Join a community of people quitting like you and get support whenever you need it.",
  },
] as const;
