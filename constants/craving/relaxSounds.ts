import type { AVPlaybackSource } from "expo-av";
import type { ImageSourcePropType } from "react-native";

import { relaxSoundCoverForSlug } from "@/constants/craving/relaxSoundCoverAssets";
import type { RelaxSoundApiRecord } from "@/services/relaxSounds/relaxSoundsApi";

export type RelaxSoundId = string;

export type RelaxSound = {
  id: RelaxSoundId;
  label: string;
  description: string;
  audioUrl: string;
  audioMimeType: string;
  sortOrder: number;
};

export function mapApiRelaxSound(record: RelaxSoundApiRecord): RelaxSound {
  return {
    id: record.slug,
    label: record.label,
    description: record.description,
    audioUrl: record.audioUrl,
    audioMimeType: record.audioMimeType,
    sortOrder: record.sortOrder,
  };
}

export function relaxSoundAudioSource(sound: RelaxSound): AVPlaybackSource {
  return { uri: sound.audioUrl };
}

export function relaxSoundCoverSource(sound: RelaxSound): ImageSourcePropType {
  return relaxSoundCoverForSlug(sound.id);
}

export function findRelaxSound(
  sounds: readonly RelaxSound[],
  id: string,
): RelaxSound | undefined {
  return sounds.find((sound) => sound.id === id);
}

export function getRelaxSound(
  sounds: readonly RelaxSound[],
  id: RelaxSoundId,
): RelaxSound {
  const sound = findRelaxSound(sounds, id);
  if (!sound) throw new Error(`Unknown relax sound: ${id}`);
  return sound;
}
