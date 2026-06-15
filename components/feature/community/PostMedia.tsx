import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, View } from "react-native";

import { CroppedPostImage } from "@/components/feature/community/CroppedPostImage";
import type { PostMedia as PostMediaType } from "@/types/community";
import { resolvePostMediaAspectRatio } from "@/utils/community/postMediaFrame";
import { resolvePostMediaSource } from "@/utils/community/postMediaSource";
import { shouldApplyPostMediaCrop } from "@/utils/community/postMediaDisplay";

type Props = {
  media: PostMediaType;
  fill?: boolean;
  overlayLabel?: string;
  className?: string;
  roundedClassName?: string;
};

function VideoPlayBadge() {
  return (
    <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-black/60">
        <Ionicons name="play" size={24} color="white" />
      </View>
    </View>
  );
}

function CountOverlay({ label }: { label: string }) {
  return (
    <View className="absolute inset-0 items-center justify-center bg-black/55" pointerEvents="none">
      <Text className="text-3xl font-bold text-white">{label}</Text>
    </View>
  );
}

function MediaImage({
  media,
  fill,
  aspectRatio,
  roundedClassName,
}: {
  media: PostMediaType;
  fill: boolean;
  aspectRatio: number;
  roundedClassName: string;
}) {
  const source = resolvePostMediaSource(media);
  const hasCrop = shouldApplyPostMediaCrop(media);

  if (hasCrop) {
    return (
      <CroppedPostImage
        source={source}
        aspectRatio={fill ? undefined : aspectRatio}
        crop={media.crop}
        fill={fill}
        className={
          fill
            ? "flex-1 bg-section dark:bg-d-surface"
            : `w-full overflow-hidden ${roundedClassName} bg-section dark:bg-d-surface`
        }
      />
    );
  }

  if (fill) {
    return (
      <View className="flex-1 overflow-hidden bg-section dark:bg-d-surface">
        <Image source={source} style={{ width: "100%", height: "100%" }} contentFit="cover" />
      </View>
    );
  }

  return (
    <View
      className={`w-full overflow-hidden ${roundedClassName} bg-section dark:bg-d-surface`}
      style={{ aspectRatio }}
    >
      <Image source={source} style={{ width: "100%", height: "100%" }} contentFit="cover" />
    </View>
  );
}

export function PostMedia({
  media,
  fill = false,
  overlayLabel,
  className,
  roundedClassName = "rounded-2xl",
}: Props) {
  const aspectRatio = resolvePostMediaAspectRatio(media);
  const isVideo = media.kind === "video";

  return (
    <View
      className={
        fill
          ? `relative flex-1 overflow-hidden ${className ?? ""}`
          : `relative w-full ${className ?? ""}`
      }
    >
      <MediaImage
        media={media}
        fill={fill}
        aspectRatio={aspectRatio}
        roundedClassName={roundedClassName}
      />

      {isVideo ? <VideoPlayBadge /> : null}

      {isVideo && media.durationLabel ? (
        <View className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5">
          <Text className="text-xs font-semibold text-white">{media.durationLabel}</Text>
        </View>
      ) : null}

      {overlayLabel ? <CountOverlay label={overlayLabel} /> : null}
    </View>
  );
}
