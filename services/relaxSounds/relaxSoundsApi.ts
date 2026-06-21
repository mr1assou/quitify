import { API_URL } from "@/config/api";
import { authenticatedFetch } from "@/services/api/authenticatedFetch";

export type RelaxSoundApiRecord = {
  soundId: number;
  slug: string;
  label: string;
  description: string;
  audioUrl: string;
  audioMimeType: string;
  durationMs: number | null;
  sizeBytes: number | null;
  sortOrder: number;
};

export type MusicUploadUrlResponse = {
  uploadUrl: string;
  imageUrl: string;
  key: string;
  expiresIn: number;
};

export async function fetchRelaxSounds(): Promise<RelaxSoundApiRecord[]> {
  const res = await fetch(`${API_URL}/relax-sounds`, {
    headers: { "ngrok-skip-browser-warning": "1" },
  });

  if (!res.ok) {
    throw new Error("Could not load relax sounds");
  }

  return res.json() as Promise<RelaxSoundApiRecord[]>;
}

export async function createMusicUploadUrl(input: {
  slug: string;
  fileName: string;
  contentType: string;
}): Promise<MusicUploadUrlResponse> {
  const res = await authenticatedFetch("/relax-sounds/upload-url", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("Could not create music upload URL");
  }

  return res.json() as Promise<MusicUploadUrlResponse>;
}

export async function upsertRelaxSound(input: {
  slug: string;
  label: string;
  description: string;
  audioUrl: string;
  audioMimeType: string;
  durationMs?: number;
  sizeBytes?: number;
  sortOrder?: number;
}): Promise<RelaxSoundApiRecord> {
  const res = await authenticatedFetch("/relax-sounds/upsert", {
    method: "POST",
    body: JSON.stringify({
      slug: input.slug,
      label: input.label,
      description: input.description,
      audioUrl: input.audioUrl,
      audioMimeType: input.audioMimeType,
      durationMs: input.durationMs,
      sizeBytes: input.sizeBytes,
      sortOrder: input.sortOrder,
    }),
  });

  if (!res.ok) {
    throw new Error("Could not save relax sound");
  }

  return res.json() as Promise<RelaxSoundApiRecord>;
}
