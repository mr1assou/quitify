import type { ProfileActivityTab } from "@/types/profileActivity";

export const PROFILE_ACTIVITY_TABS: { id: ProfileActivityTab; label: string }[] = [
  { id: "posts", label: "Posts" },
  { id: "comments", label: "Comments" },
  { id: "upvoted", label: "Upvoted" },
];
