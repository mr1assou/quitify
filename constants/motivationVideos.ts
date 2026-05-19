import type { ImageSourcePropType } from "react-native";

import { DEFAULT_POST_IMAGE } from "@/constants/postImages";

export type MotivationVideo = {
  id: string;
  title: string;
  author: string;
  /** Display duration like "3:42". */
  duration: string;
  thumbnail: ImageSourcePropType;
};

/** Mock list of motivational videos. Thumbnails fall back to the shared post image. */
export const MOTIVATION_VIDEOS: readonly MotivationVideo[] = [
  {
    id: "why-you-can",
    title: "Why you can quit — even today",
    author: "Quitify",
    duration: "3:12",
    thumbnail: DEFAULT_POST_IMAGE,
  },
  {
    id: "first-week",
    title: "Surviving the first 7 days",
    author: "Dr. Lena Hart",
    duration: "5:47",
    thumbnail: DEFAULT_POST_IMAGE,
  },
  {
    id: "cravings-pass",
    title: "Cravings always pass — here's the proof",
    author: "Mind Coach Daily",
    duration: "4:25",
    thumbnail: DEFAULT_POST_IMAGE,
  },
  {
    id: "what-changes",
    title: "What changes in your body after 24h",
    author: "Health in 60",
    duration: "2:08",
    thumbnail: DEFAULT_POST_IMAGE,
  },
  {
    id: "stay-strong",
    title: "Stay strong: 3 mindset shifts",
    author: "Quitify",
    duration: "6:03",
    thumbnail: DEFAULT_POST_IMAGE,
  },
  {
    id: "you-vs-urge",
    title: "You vs. the urge — winning every round",
    author: "Coach Maria",
    duration: "4:50",
    thumbnail: DEFAULT_POST_IMAGE,
  },
] as const;
