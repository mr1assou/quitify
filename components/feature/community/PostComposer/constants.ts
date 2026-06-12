import type { PostMediaFrame } from "@/types/community";

export const POST_TITLE_MAX = 300;

export const POST_IMAGE_FRAMES: { id: PostMediaFrame; label: string; hint: string }[] = [
  { id: "square", label: "Square", hint: "1:1" },
  { id: "portrait", label: "Portrait", hint: "4:6" },
  { id: "landscape", label: "Landscape", hint: "16:9" },
];
