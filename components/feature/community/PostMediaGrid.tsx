import type { ReactNode } from "react";
import { View } from "react-native";

import type { PostMedia } from "@/types/community";
import {
  FEED_GRID_GAP,
  FEED_GRID_HEIGHT,
  feedOverflowLabel,
} from "@/utils/community/postMediaDisplay";

import { PostMedia as PostMediaItem } from "./PostMedia";

type Props = {
  media: PostMedia[];
};

function GridShell({ children, row = false }: { children: ReactNode; row?: boolean }) {
  return (
    <View
      style={{
        height: FEED_GRID_HEIGHT,
        flexDirection: row ? "row" : undefined,
        gap: row ? FEED_GRID_GAP : undefined,
      }}
      className="overflow-hidden rounded-2xl"
    >
      {children}
    </View>
  );
}

function GridTile({ media, overlayLabel }: { media: PostMedia; overlayLabel?: string }) {
  return (
    <View style={{ flex: 1 }}>
      <PostMediaItem media={media} fill overlayLabel={overlayLabel} />
    </View>
  );
}

/**
 * Feed collage rules:
 * - 2 images → side by side
 * - 3+ images → first image only, with "+N" for the rest
 */
export function PostMediaGrid({ media }: Props) {
  if (media.length === 2) {
    return (
      <GridShell row>
        <GridTile media={media[0]} />
        <GridTile media={media[1]} />
      </GridShell>
    );
  }

  return (
    <GridShell>
      <GridTile media={media[0]} overlayLabel={feedOverflowLabel(media.length)} />
    </GridShell>
  );
}
