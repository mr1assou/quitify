import type { ImageSourcePropType } from "react-native";

/** Bundled relax-sound cover art under assets/images/music/images/. */
export type RelaxSoundCoverSlug = keyof typeof RELAX_SOUND_COVERS;

export const RELAX_SOUND_COVERS = {
  parallelUniverse: require("../../assets/images/music/images/paralell_universe.webp"),
  surea: require("../../assets/images/music/images/surea.webp"),
  forestRoad: require("../../assets/images/music/images/road_forest.webp"),
  cyberpunk: require("../../assets/images/music/images/cyberpunk.webp"),
  relax: require("../../assets/images/music/images/relax_music.webp"),
  birds: require("../../assets/images/music/images/birds.webp"),
  calmGame: require("../../assets/images/music/images/game.webp"),
  chill: require("../../assets/images/music/images/chill.webp"),
  deathSound: require("../../assets/images/music/images/death.webp"),
  desertDunes: require("../../assets/images/music/images/desert_atmosphere.webp"),
  filmScore: require("../../assets/images/music/images/film_movie.webp"),
  listen: require("../../assets/images/music/images/listen_wave.webp"),
  lostDiary: require("../../assets/images/music/images/lost_diary.webp"),
  midi: require("../../assets/images/music/images/midi_sound.webp"),
  surrealism: require("../../assets/images/music/images/surialism.webp"),
  wandering: require("../../assets/images/music/images/wandering.webp"),
} as const satisfies Record<string, ImageSourcePropType>;

export function relaxSoundCoverForSlug(slug: string): ImageSourcePropType {
  const cover = RELAX_SOUND_COVERS[slug as RelaxSoundCoverSlug];
  if (!cover) {
    throw new Error(`Missing local cover for relax sound: ${slug}`);
  }
  return cover;
}
