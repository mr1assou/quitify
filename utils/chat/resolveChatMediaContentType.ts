export const CHAT_ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "audio/mpeg",
  "audio/mp4",
  "audio/aac",
  "audio/wav",
] as const;

export type ChatMediaContentType = (typeof CHAT_ALLOWED_CONTENT_TYPES)[number];

const EXT_TO_TYPE: Record<string, ChatMediaContentType> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  mov: "video/quicktime",
  m4a: "audio/mp4",
  mp3: "audio/mpeg",
  aac: "audio/aac",
  wav: "audio/wav",
};

const DEFAULT_BY_KIND: Record<"image" | "video" | "audio", ChatMediaContentType> = {
  image: "image/jpeg",
  video: "video/mp4",
  audio: "audio/mp4",
};

function extensionFromUri(uri: string): string | null {
  const clean = uri.split("?")[0]?.split("#")[0] ?? uri;
  const last = clean.split(".").pop()?.toLowerCase();
  return last && last.length <= 5 ? last : null;
}

export function resolveChatMediaContentType(
  kind: "image" | "video" | "audio",
  mimeType?: string | null,
  uri?: string,
): ChatMediaContentType {
  const normalized = mimeType?.toLowerCase().split(";")[0]?.trim();
  if (
    normalized &&
    CHAT_ALLOWED_CONTENT_TYPES.includes(normalized as ChatMediaContentType)
  ) {
    return normalized as ChatMediaContentType;
  }

  if (uri) {
    const ext = extensionFromUri(uri);
    if (ext && EXT_TO_TYPE[ext]) return EXT_TO_TYPE[ext];
  }

  return DEFAULT_BY_KIND[kind];
}
