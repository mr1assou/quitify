import type { RelaxSound } from "@/constants/craving/relaxSounds";

/** Relax sound available without VIP. */
export const FREE_RELAX_SOUND_SLUG = "surea";

export function isRelaxSoundUnlocked(
  _sounds: readonly RelaxSound[],
  soundId: string,
  isPremium: boolean,
): boolean {
  if (isPremium) return true;
  return soundId === FREE_RELAX_SOUND_SLUG;
}
