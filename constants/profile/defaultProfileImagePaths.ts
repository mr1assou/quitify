/** Stored in `users.image_url` for bundled default avatars, independent of sex. */
export const DEFAULT_PROFILE_IMAGE_PATHS = [
  "profile8.webp",
  "profile9.webp",
  "profile10.webp",
  "profile11.webp",
  "profile12.webp",
  "profile13.webp",
  "profile1.webp",
  "profile3.webp",
  "profile4.webp",
  "profile5.webp",
  "profile6.webp",
  "profile7.webp",
] as const;

export type DefaultProfileImagePath = (typeof DEFAULT_PROFILE_IMAGE_PATHS)[number];
