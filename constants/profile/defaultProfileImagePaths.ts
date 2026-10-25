/** Stored in `users.image_url` for bundled default avatars, independent of sex. */
export const DEFAULT_PROFILE_IMAGE_PATHS = [
  "profile24.webp",
  "profile14.webp",
  "profile15.webp",
  "profile16.webp",
  "profile17.webp",
  "profile18.webp",
  "profile19.webp",
  "profile20.webp",
  "profile21.webp",
  "profile22.webp",
  "profile23.webp",
  "profile4.webp",
  "profile5.webp",
] as const;

export type DefaultProfileImagePath = (typeof DEFAULT_PROFILE_IMAGE_PATHS)[number];
