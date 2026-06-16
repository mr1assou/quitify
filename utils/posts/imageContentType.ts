import type { AllowedImageContentType } from "@/types/community/postsApi";

const ALLOWED: AllowedImageContentType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

function isAllowedImageContentType(value: string): value is AllowedImageContentType {
  return (ALLOWED as string[]).includes(value);
}

export function resolveImageContentType(
  uri: string,
  mimeType?: string | null,
): AllowedImageContentType {
  if (mimeType && isAllowedImageContentType(mimeType)) {
    return mimeType;
  }

  const lower = uri.split("?")[0]?.toLowerCase() ?? "";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}
