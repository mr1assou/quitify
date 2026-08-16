import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import { PanResponder, Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { formatMediaDuration } from "@/utils/chat/formatMediaDuration";

type Props = {
  uri: string;
  durationMs?: number;
};

const NEAR_END_MS = 200;

export function ChatAudioMessage({ uri, durationMs }: Props) {
  const { colors } = useTheme();
  const soundRef = useRef<Audio.Sound | null>(null);
  const seekingRef = useRef(false);
  const widthRef = useRef(0);
  const totalMsRef = useRef(durationMs ?? 0);
  const positionMsRef = useRef(0);
  const seekToRef = useRef<(nextMs: number) => Promise<void>>(async () => {});
  const [playing, setPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [loadedDurationMs, setLoadedDurationMs] = useState(durationMs ?? 0);

  const totalMs = loadedDurationMs > 0 ? loadedDurationMs : durationMs ?? 0;
  totalMsRef.current = totalMs;
  positionMsRef.current = positionMs;

  const unload = useCallback(async () => {
    const sound = soundRef.current;
    soundRef.current = null;
    setPlaying(false);
    if (!sound) return;
    try {
      await sound.unloadAsync();
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setPositionMs(0);
    positionMsRef.current = 0;
    setPlaying(false);
    setLoadedDurationMs(durationMs ?? 0);
    void unload();
    return () => {
      void unload();
    };
  }, [unload, uri]);

  const applyStatus = useCallback((status: Audio.AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    if (status.durationMillis) setLoadedDurationMs(status.durationMillis);
    if (!seekingRef.current) {
      setPositionMs(status.positionMillis ?? 0);
    }
    if (status.didJustFinish) {
      setPlaying(false);
      setPositionMs(0);
      const finished = soundRef.current;
      soundRef.current = null;
      void finished?.unloadAsync().catch(() => {});
    }
  }, []);

  const ensureSound = useCallback(async () => {
    const existing = soundRef.current;
    if (existing) {
      const status = await existing.getStatusAsync();
      if (status.isLoaded) return existing;
      await existing.unloadAsync().catch(() => {});
      soundRef.current = null;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false, progressUpdateIntervalMillis: 80 },
      applyStatus,
    );
    soundRef.current = sound;
    return sound;
  }, [applyStatus, uri]);

  const seekTo = useCallback(
    async (nextMs: number) => {
      const duration = totalMsRef.current;
      const clamped = Math.max(0, Math.min(nextMs, duration || nextMs));
      setPositionMs(clamped);
      try {
        const sound = await ensureSound();
        await sound.setPositionAsync(clamped);
      } catch {
        // keep local position until playback works
      }
    },
    [ensureSound],
  );
  seekToRef.current = seekTo;

  const togglePlay = useCallback(async () => {
    try {
      const sound = await ensureSound();
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;

      if (status.isPlaying) {
        await sound.pauseAsync();
        setPlaying(false);
        return;
      }

      const duration = status.durationMillis ?? totalMsRef.current;
      const atEnd =
        duration > 0 && (status.positionMillis ?? 0) >= duration - NEAR_END_MS;
      if (atEnd || status.didJustFinish) {
        await sound.setPositionAsync(0);
        setPositionMs(0);
      }

      await sound.playAsync();
      setPlaying(true);
    } catch {
      setPlaying(false);
      await unload();
    }
  }, [ensureSound, unload]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        seekingRef.current = true;
        const next = positionFromTouch(
          event.nativeEvent.locationX,
          widthRef.current,
          totalMsRef.current,
        );
        setPositionMs(next);
      },
      onPanResponderMove: (event) => {
        const next = positionFromTouch(
          event.nativeEvent.locationX,
          widthRef.current,
          totalMsRef.current,
        );
        setPositionMs(next);
      },
      onPanResponderRelease: (event) => {
        const next = positionFromTouch(
          event.nativeEvent.locationX,
          widthRef.current,
          totalMsRef.current,
        );
        seekingRef.current = false;
        void seekToRef.current(next);
      },
      onPanResponderTerminate: () => {
        seekingRef.current = false;
        void seekToRef.current(positionMsRef.current);
      },
    }),
  ).current;

  const ratio = totalMs > 0 ? Math.min(1, positionMs / totalMs) : 0;
  const timeLabel = formatMediaDuration(playing || positionMs > 0 ? positionMs : totalMs);

  return (
    <View className="min-w-[220px] flex-row items-center gap-3 px-1 py-1">
      <Pressable
        onPress={() => void togglePlay()}
        accessibilityRole="button"
        accessibilityLabel={playing ? "Pause voice message" : "Play voice message"}
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.primary }}
      >
        <Ionicons name={playing ? "pause" : "play"} size={18} color={colors.white} />
      </Pressable>

      <View className="min-w-0 flex-1">
        <View
          onLayout={(event) => {
            widthRef.current = event.nativeEvent.layout.width;
          }}
          {...panResponder.panHandlers}
          className="h-7 justify-center"
          accessibilityLabel="Voice message progress"
        >
          <View
            className="h-1 overflow-hidden rounded-full"
            style={{ backgroundColor: `${colors.primary}28` }}
          >
            <View
              className="h-1 rounded-full"
              style={{ width: `${ratio * 100}%`, backgroundColor: colors.primary }}
            />
          </View>
          <View
            pointerEvents="none"
            className="absolute h-3 w-3 rounded-full"
            style={{
              left: `${ratio * 100}%`,
              marginLeft: -6,
              backgroundColor: colors.primary,
            }}
          />
        </View>
        <Text className="text-[11px] font-medium tabular-nums text-muted-foreground dark:text-d-muted">
          {timeLabel}
        </Text>
      </View>
    </View>
  );
}

function positionFromTouch(x: number, width: number, totalMs: number): number {
  if (width <= 0 || totalMs <= 0) return 0;
  const ratio = Math.max(0, Math.min(1, x / width));
  return Math.round(ratio * totalMs);
}
