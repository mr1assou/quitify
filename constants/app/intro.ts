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
    title: "Track every attempt",
    body: "Quitify saves each try, so you can see how far you went and begin the next one with a clearer plan.",
  },
  {
    id: "short-time",
    title: "Set a goal you can see",
    body: "Create a goal for the money you want to save, the days you want to reach, or the life you want back. The app shows how close you are every day.",
  },
  {
    id: "transformation",
    title: "Stay motivated when it feels hard",
    body: "Freedom points, badges, and your rank turn each smoke free day into a win you can see. Small rewards keep you moving when motivation drops.",
  },
  {
    id: "chance",
    title: "You can beat this craving",
    body: "It feels huge, then it passes. Stay with it and feel how strong you already are. Every craving you outlast is a win you get to keep.",
  },
  {
    id: "after-onboard",
    title: "You quit with support, not alone",
    body: "Track your streak, your goals, and your attempts in one place. The community is there when you need a reminder that other people are doing this too.",
  },
] as const;
