import { createChatUploadUrl } from "@/services/chat/chatApi";
import {
  resolveChatMediaContentType,
  type ChatMediaContentType,
} from "@/utils/chat/resolveChatMediaContentType";

export async function uploadChatMediaToR2(input: {
  uri: string;
  kind: "image" | "video" | "audio";
  mimeType?: string | null;
}): Promise<{ publicUrl: string; contentType: ChatMediaContentType; sizeBytes: number }> {
  const contentType = resolveChatMediaContentType(input.kind, input.mimeType, input.uri);
  const { uploadUrl, imageUrl } = await createChatUploadUrl(contentType);

  const fileResponse = await fetch(input.uri);
  const blob = await fileResponse.blob();

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });

  if (!res.ok) {
    throw new Error("Media upload failed");
  }

  return {
    publicUrl: imageUrl,
    contentType,
    sizeBytes: blob.size,
  };
}
