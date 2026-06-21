import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { CravingToolScreen } from "@/components/feature/craving/CravingToolScreen";
import { SeekBar } from "@/components/feature/craving/relax-sound/SeekBar";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import {
  findRelaxSound,
  getRelaxSound,
  relaxSoundCoverSource,
} from "@/constants/craving/relaxSounds";
import { useRelaxSoundsCatalogContext } from "@/context/RelaxSoundsCatalogContext";
import { useRelaxSoundPlayerContext } from "@/context/RelaxSoundPlayerContext";
import { formatPlaybackTime } from "@/utils/craving/formatPlaybackTime";

type Props = {
  soundId: string;
};

export function RelaxSoundDetailScreen({ soundId }: Props) {
  const { sounds } = useRelaxSoundsCatalogContext();
  const sound = getRelaxSound(sounds, soundId);
  const { width } = useWindowDimensions();
  const heroHeight = Math.min(width * 0.92, 360);

  const {
    activeId,
    loadingId,
    isPlaying,
    progress,
    loadAndPlay,
    togglePlayPause,
    seekTo,
  } = useRelaxSoundPlayerContext();

  const isCurrent = activeId === sound.id;
  const isLoading = loadingId === sound.id;
  const durationMs = progress.durationMs;
  const audioUrl = sound.audioUrl;
  const coverSource = relaxSoundCoverSource(sound);

  useEffect(() => {
    void loadAndPlay(sound.id, { uri: audioUrl });
  }, [audioUrl, loadAndPlay, sound.id]);

  const handleSeek = useCallback(
    (positionMs: number) => {
      void seekTo(positionMs);
    },
    [seekTo],
  );

  return (
    <CravingToolScreen toolId="relax-sound" title={sound.label}>
      <View className="flex-1 px-6 pb-8 pt-2">
        <Animated.View entering={FadeInDown.duration(380)} className="overflow-hidden rounded-3xl">
          <ImageBackground
            source={coverSource}
            resizeMode="cover"
            style={{ width: "100%", height: heroHeight, justifyContent: "flex-end" }}
          >
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.45)",
                paddingHorizontal: 16,
                paddingVertical: 14,
              }}
            >
              <Text className="text-2xl font-bold text-white">{sound.label}</Text>
              <Text className="mt-1 text-sm text-white/85">{sound.description}</Text>
            </View>
          </ImageBackground>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(380)} className="mt-6">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? "Pause sound" : "Play sound"}
            onPress={() => {
              if (isCurrent) {
                void togglePlayPause();
                return;
              }
              void loadAndPlay(sound.id, { uri: audioUrl });
            }}
            className="flex-row items-center justify-center gap-3 rounded-2xl bg-primary py-4 dark:bg-primary"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name={isPlaying && isCurrent ? "pause" : "play"}
                  size={24}
                  color="#FFFFFF"
                />
                <Text className="text-base font-bold text-white">
                  {isPlaying && isCurrent ? "Pause" : "Play"}
                </Text>
              </>
            )}
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(140).duration(380)} className="mt-8">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-foreground dark:text-d-text">
              Progress
            </Text>
            <Text className="text-xs text-muted-foreground dark:text-d-muted">
              {formatPlaybackTime(isCurrent ? progress.positionMs : 0)}
              {" / "}
              {formatPlaybackTime(durationMs)}
            </Text>
          </View>
          <SeekBar
            value={isCurrent ? progress.positionMs : 0}
            max={Math.max(durationMs, 1)}
            onChange={handleSeek}
            trackColor="rgba(127,127,127,0.25)"
            fillColor="#6B9080"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(380)} className="mt-8">
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            className="items-center py-2"
          >
            <Text className="text-sm font-semibold text-primary">Back to all sounds</Text>
          </Pressable>
        </Animated.View>
      </View>
    </CravingToolScreen>
  );
}

export function RelaxSoundDetailScreenFromId({ id }: { id: string }) {
  const { sounds, isLoading } = useRelaxSoundsCatalogContext();
  const sound = findRelaxSound(sounds, id);

  if (isLoading) {
    return (
      <CravingToolScreen toolId="relax-sound">
        <ThemedLoadingScreen message="Loading sounds…" />
      </CravingToolScreen>
    );
  }

  if (!sound) {
    return (
      <CravingToolScreen toolId="relax-sound">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
            This sound does not exist.
          </Text>
        </View>
      </CravingToolScreen>
    );
  }

  return <RelaxSoundDetailScreen soundId={sound.id} />;
}
