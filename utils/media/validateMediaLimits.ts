import {
  POST_IMAGE_MAX_BYTES,
  POST_VIDEO_MAX_BYTES,
  POST_VIDEO_MAX_DURATION_MS,
  PROFILE_IMAGE_MAX_BYTES,
} from "@/constants/media/uploadLimits";

export type MediaLimitCode =
  | "profile_image_too_large"
  | "post_image_too_large"
  | "post_video_too_large"
  | "post_video_too_long"
  | "source_image_too_large";

export type MediaLimitViolation = {
  code: MediaLimitCode;
  /** Fallback English copy when i18n is unavailable. */
  title: string;
  message: string;
};

export function profileImageTooLarge(sizeBytes: number): MediaLimitViolation | null {
  if (sizeBytes <= PROFILE_IMAGE_MAX_BYTES) return null;
  return {
    code: "profile_image_too_large",
    title: "Photo too large",
    message:
      "Profile photos must be 2 MB or smaller. Choose a smaller image.",
  };
}

export function postImageTooLarge(sizeBytes: number): MediaLimitViolation | null {
  if (sizeBytes <= POST_IMAGE_MAX_BYTES) return null;
  return {
    code: "post_image_too_large",
    title: "Image too large",
    message: "Post images must be 5 MB or smaller. Choose a smaller photo.",
  };
}

export function postVideoTooLarge(sizeBytes: number): MediaLimitViolation | null {
  if (sizeBytes <= POST_VIDEO_MAX_BYTES) return null;
  return {
    code: "post_video_too_large",
    title: "Video too large",
    message:
      "Videos must be 100 MB or smaller. Trim or compress your video and try again.",
  };
}

/** `durationMs` from the picker (milliseconds). */
export function postVideoTooLong(
  durationMs: number | null | undefined,
): MediaLimitViolation | null {
  if (durationMs == null || !Number.isFinite(durationMs) || durationMs <= 0) {
    return null;
  }
  // Some Android builds report seconds; normalize obvious second-scale values.
  const ms = durationMs > 0 && durationMs <= 180 ? durationMs * 1000 : durationMs;
  if (ms <= POST_VIDEO_MAX_DURATION_MS) return null;
  return {
    code: "post_video_too_long",
    title: "Video too long",
    message: "Videos must be 60 seconds or shorter. Trim your video and try again.",
  };
}

export function sourceImageTooLarge(sizeBytes: number, ceilingBytes: number): MediaLimitViolation | null {
  if (sizeBytes <= ceilingBytes) return null;
  return {
    code: "source_image_too_large",
    title: "Image too large",
    message: "This photo is too large to process. Choose a smaller image.",
  };
}

export function assertNoViolation(violation: MediaLimitViolation | null): void {
  if (violation) {
    throw new Error(violation.message);
  }
}

export function mediaLimitI18nKeys(code: MediaLimitCode): {
  titleKey: "community.mediaTooLargeTitle" | "community.mediaTooLongTitle";
  messageKey:
    | "community.profilePhotoTooLarge"
    | "community.postImageTooLarge"
    | "community.postVideoTooLarge"
    | "community.postVideoTooLong"
    | "community.sourceImageTooLarge";
} {
  switch (code) {
    case "post_video_too_long":
      return {
        titleKey: "community.mediaTooLongTitle",
        messageKey: "community.postVideoTooLong",
      };
    case "profile_image_too_large":
      return {
        titleKey: "community.mediaTooLargeTitle",
        messageKey: "community.profilePhotoTooLarge",
      };
    case "post_image_too_large":
      return {
        titleKey: "community.mediaTooLargeTitle",
        messageKey: "community.postImageTooLarge",
      };
    case "post_video_too_large":
      return {
        titleKey: "community.mediaTooLargeTitle",
        messageKey: "community.postVideoTooLarge",
      };
    case "source_image_too_large":
      return {
        titleKey: "community.mediaTooLargeTitle",
        messageKey: "community.sourceImageTooLarge",
      };
  }
}
