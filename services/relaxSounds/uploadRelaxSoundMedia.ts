import { createMusicUploadUrl } from "@/services/relaxSounds/relaxSoundsApi";

export async function uploadRelaxSoundFile(input: {
  slug: string;
  fileName: string;
  contentType: string;
  uri: string;
}): Promise<{ publicUrl: string; sizeBytes: number }> {
  const { uploadUrl, imageUrl } = await createMusicUploadUrl({
    slug: input.slug,
    fileName: input.fileName,
    contentType: input.contentType,
  });

  const fileResponse = await fetch(input.uri);
  const blob = await fileResponse.blob();

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": input.contentType },
    body: blob,
  });

  if (!res.ok) {
    throw new Error(`Upload failed for ${input.fileName}`);
  }

  return { publicUrl: imageUrl, sizeBytes: blob.size };
}

export function mimeTypeForRelaxFileName(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".mp3")) return "audio/mpeg";
  if (lower.endsWith(".wav")) return "audio/wav";
  if (lower.endsWith(".m4a")) return "audio/mp4";
  if (lower.endsWith(".aac")) return "audio/aac";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  throw new Error(`Unsupported file type: ${fileName}`);
}
