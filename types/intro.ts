export type IntroSlideId =
  | "success"
  | "short-time"
  | "transformation"
  | "chance"
  | "after-onboard";

export type IntroSlideContent = {
  id: IntroSlideId;
  title: string;
  body: string;
};
