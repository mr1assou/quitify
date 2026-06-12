export type PostTagId =
  | "seeking-advice"
  | "discussion"
  | "helpful-tips"
  | "progress-update"
  | "spreading-positivity"
  | "success-story";

export type PostTag = {
  id: PostTagId;
  label: string;
  backgroundColor: string;
  textColor: string;
};

export const POST_TAGS: PostTag[] = [
  {
    id: "seeking-advice",
    label: "Seeking Advice",
    backgroundColor: "#A8D8F0",
    textColor: "#1A1A1A",
  },
  {
    id: "discussion",
    label: "Discussion",
    backgroundColor: "#D4D4D4",
    textColor: "#1A1A1A",
  },
  {
    id: "helpful-tips",
    label: "Sharing Helpful Tips",
    backgroundColor: "#FFE566",
    textColor: "#1A1A1A",
  },
  {
    id: "progress-update",
    label: "Progress Update",
    backgroundColor: "#D4622B",
    textColor: "#FFFFFF",
  },
  {
    id: "spreading-positivity",
    label: "Spreading Positivity",
    backgroundColor: "#D946A8",
    textColor: "#FFFFFF",
  },
  {
    id: "success-story",
    label: "Success Story",
    backgroundColor: "#5DD5E8",
    textColor: "#1A1A1A",
  },
];

export function getPostTag(id: PostTagId): PostTag {
  return POST_TAGS.find((tag) => tag.id === id) ?? POST_TAGS[0];
}
