import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { useCallback, useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CroppedPostImage } from "@/components/feature/community/CroppedPostImage";
import type { PostMedia as PostMediaType } from "@/types/community/community";
import { resolvePostMediaAspectRatio } from "@/utils/community/postMediaFrame";
import { resolvePostMediaSource, resolvePostMediaUri } from "@/utils/community/postMediaSource";
import { shouldApplyPostMediaCrop } from "@/utils/community/postMediaDisplay";

type Props = {
  media: PostMediaType;
  fill?: boolean;
  overlayLabel?: string;
  className?: string;
  roundedClassName?: string;
};

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

function PostVideoPlayer({
  uri,
  durationLabel,
  fill,
  aspectRatio,
  roundedClassName,
}: {
  uri: string;
  durationLabel?: string;
  fill: boolean;
  aspectRatio: number;
  roundedClassName: string;
}) {
  const [open, setOpen] = useState(false);
  const playerRef = useRef<Video>(null);

  const close = useCallback(async () => {
    try {
      await playerRef.current?.pauseAsync();
    } catch {
      // ignore
    }
    setOpen(false);
  }, []);

  const preview = (
    <Pressable
      onPress={() => setOpen(true)}
      accessibilityLabel="Play video"
      className={fill ? "flex-1" : "w-full"}
    >
      <View
        className={`overflow-hidden bg-section dark:bg-d-surface ${fill ? "flex-1" : roundedClassName}`}
        style={fill ? undefined : { aspectRatio }}
      >
        <Video
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
          isMuted
          isLooping={false}
          pointerEvents="none"
        />
        <View className="absolute inset-0 items-center justify-center bg-black/25">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-black/60">
            <Ionicons name="play" size={24} color="white" />
          </View>
        </View>
        {durationLabel ? (
          <View className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5">
            <Text className="text-xs font-semibold text-white">{durationLabel}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );

  return (
    <>
      {preview}
      <Modal visible={open} animationType="fade" onRequestClose={() => void close()}>
        <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
          <View className="relative flex-1">
            <Pressable
              onPress={() => void close()}
              className="absolute right-4 top-2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/20"
              accessibilityLabel="Close video"
            >
              <Ionicons name="close" size={24} color="white" />
            </Pressable>
            <Video
              ref={playerRef}
              source={{ uri }}
              style={{ flex: 1 }}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              shouldPlay
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
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
  const videoUri = media.kind === "video" ? resolvePostMediaUri(media) : null;

  if (media.kind === "video" && videoUri) {
    return (
      <View
        className={
          fill
            ? `relative flex-1 overflow-hidden ${className ?? ""}`
            : `relative w-full ${className ?? ""}`
        }
      >
        <PostVideoPlayer
          uri={videoUri}
          durationLabel={media.durationLabel}
          fill={fill}
          aspectRatio={aspectRatio}
          roundedClassName={roundedClassName}
        />
        {overlayLabel ? <CountOverlay label={overlayLabel} /> : null}
      </View>
    );
  }

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
      {overlayLabel ? <CountOverlay label={overlayLabel} /> : null}
    </View>
  );
}
