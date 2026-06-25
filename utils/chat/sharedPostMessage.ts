const POST_SHARE_MARKER = /\[\[post:(\d+)\]\]\s*$/;

export function buildSharedPostChatMessage(
  postId: string,
  title?: string,
  body?: string,
): string {
  const lines: string[] = ["Shared a community post:"];
  const safeTitle = title?.trim();
  const safeBody = body?.trim();

  if (safeTitle) lines.push(safeTitle);
  if (safeBody) {
    const preview = safeBody.length > 180 ? `${safeBody.slice(0, 180)}...` : safeBody;
    lines.push(preview);
  }

  lines.push(`[[post:${postId}]]`);
  return lines.join("\n\n");
}

export function parseSharedPostChatMessage(
  text: string,
): { postId: string; previewText: string } | null {
  const match = text.match(POST_SHARE_MARKER);
  if (!match) return null;

  return {
    postId: match[1],
    previewText: text.replace(POST_SHARE_MARKER, "").trim(),
  };
}
