import type { ImageSourcePropType } from "react-native";

/**
 * Cover art loaders — each `require` runs only when that cover is first requested
 * (visible list rows / detail), not when this module is imported.
 */
const RELAX_SOUND_COVER_LOADERS = {
  parallelUniverse: () =>
    require("../../assets/images/music/images/paralell_universe.webp") as ImageSourcePropType,
  surea: () =>
    require("../../assets/images/music/images/surea.webp") as ImageSourcePropType,
  forestRoad: () =>
    require("../../assets/images/music/images/road_forest.webp") as ImageSourcePropType,
  cyberpunk: () =>
    require("../../assets/images/music/images/cyberpunk.webp") as ImageSourcePropType,
  relax: () =>
    require("../../assets/images/music/images/relax_music.webp") as ImageSourcePropType,
  birds: () =>
    require("../../assets/images/music/images/birds.webp") as ImageSourcePropType,
  calmGame: () =>
    require("../../assets/images/music/images/game.webp") as ImageSourcePropType,
  chill: () =>
    require("../../assets/images/music/images/chill.webp") as ImageSourcePropType,
  deathSound: () =>
    require("../../assets/images/music/images/death.webp") as ImageSourcePropType,
  desertDunes: () =>
    require("../../assets/images/music/images/desert_atmosphere.webp") as ImageSourcePropType,
  filmScore: () =>
    require("../../assets/images/music/images/film_movie.webp") as ImageSourcePropType,
  listen: () =>
    require("../../assets/images/music/images/listen_wave.webp") as ImageSourcePropType,
  lostDiary: () =>
    require("../../assets/images/music/images/lost_diary.webp") as ImageSourcePropType,
  midi: () =>
    require("../../assets/images/music/images/midi_sound.webp") as ImageSourcePropType,
  surrealism: () =>
    require("../../assets/images/music/images/surialism.webp") as ImageSourcePropType,
  wandering: () =>
    require("../../assets/images/music/images/wandering.webp") as ImageSourcePropType,
} as const satisfies Record<string, () => ImageSourcePropType>;

export type RelaxSoundCoverSlug = keyof typeof RELAX_SOUND_COVER_LOADERS;

const coverCache = new Map<string, ImageSourcePropType>();

export function relaxSoundCoverForSlug(slug: string): ImageSourcePropType {
  const cached = coverCache.get(slug);
  if (cached) return cached;

  const loader = RELAX_SOUND_COVER_LOADERS[slug as RelaxSoundCoverSlug];
  if (!loader) {
    throw new Error(`Missing local cover for relax sound: ${slug}`);
  }

  const cover = loader();
  coverCache.set(slug, cover);
  return cover;
}
