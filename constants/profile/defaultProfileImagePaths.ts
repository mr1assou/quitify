/** Stored in `users.image_url` for bundled default avatars. */
export const DEFAULT_PROFILE_IMAGE_MALE_PATHS = [
  "profile1.webp",
  "profile4.webp",
  "profile5.webp",
] as const;

export const DEFAULT_PROFILE_IMAGE_FEMALE_PATHS = [
  "profile2.webp",
  "profile3.webp",
  "profile6.webp",
  "profile7.webp",
] as const;

export const DEFAULT_PROFILE_IMAGE_PATHS = [
  ...DEFAULT_PROFILE_IMAGE_MALE_PATHS,
  ...DEFAULT_PROFILE_IMAGE_FEMALE_PATHS,
] as const;

export type DefaultProfileImagePath = (typeof DEFAULT_PROFILE_IMAGE_PATHS)[number];
