import type { ImageSourcePropType } from "react-native";

/** Bundled relax-sound cover art under assets/images/music/images/. */
export type RelaxSoundCoverSlug = keyof typeof RELAX_SOUND_COVERS;

export const RELAX_SOUND_COVERS = {
  parallelUniverse: require("../../assets/images/music/images/paralell_universe.png"),
  surea: require("../../assets/images/music/images/surea.png"),
  forestRoad: require("../../assets/images/music/images/road_forest.png"),
  cyberpunk: require("../../assets/images/music/images/cyberpunk.png"),
  relax: require("../../assets/images/music/images/relax_music.png"),
  birds: require("../../assets/images/music/images/birds.png"),
  calmGame: require("../../assets/images/music/images/game.png"),
  chill: require("../../assets/images/music/images/chill.png"),
  deathSound: require("../../assets/images/music/images/death.png"),
  desertDunes: require("../../assets/images/music/images/desert_atmosphere.png"),
  filmScore: require("../../assets/images/music/images/film_movie.png"),
  listen: require("../../assets/images/music/images/listen_wave.png"),
  lostDiary: require("../../assets/images/music/images/lost_diary.png"),
  midi: require("../../assets/images/music/images/midi_sound.png"),
  surrealism: require("../../assets/images/music/images/surialism.png"),
  wandering: require("../../assets/images/music/images/wandering.png"),
} as const satisfies Record<string, ImageSourcePropType>;

export function relaxSoundCoverForSlug(slug: string): ImageSourcePropType {
  const cover = RELAX_SOUND_COVERS[slug as RelaxSoundCoverSlug];
  if (!cover) {
    throw new Error(`Missing local cover for relax sound: ${slug}`);
  }
  return cover;
}
