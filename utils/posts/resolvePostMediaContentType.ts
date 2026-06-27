export const POST_ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
] as const;

export type PostMediaContentType = (typeof POST_ALLOWED_CONTENT_TYPES)[number];

const EXT_TO_TYPE: Record<string, PostMediaContentType> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  mov: "video/quicktime",
};

const DEFAULT_BY_KIND: Record<"image" | "video", PostMediaContentType> = {
  image: "image/jpeg",
  video: "video/mp4",
};

function extensionFromUri(uri: string): string | null {
  const clean = uri.split("?")[0]?.split("#")[0] ?? uri;
  const last = clean.split(".").pop()?.toLowerCase();
  return last && last.length <= 5 ? last : null;
}

export function resolvePostMediaContentType(
  kind: "image" | "video",
  mimeType?: string | null,
  uri?: string,
): PostMediaContentType {
  const normalized = mimeType?.toLowerCase().split(";")[0]?.trim();
  if (
    normalized &&
    POST_ALLOWED_CONTENT_TYPES.includes(normalized as PostMediaContentType)
  ) {
    return normalized as PostMediaContentType;
  }

  if (uri) {
    const ext = extensionFromUri(uri);
    if (ext && EXT_TO_TYPE[ext]) return EXT_TO_TYPE[ext];
  }

  return DEFAULT_BY_KIND[kind];
}

export function isVideoContentType(contentType: PostMediaContentType): boolean {
  return contentType.startsWith("video/");
}
