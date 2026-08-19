import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import { PanResponder, Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { formatMediaDuration } from "@/utils/chat/formatMediaDuration";
import {
  getPlayingChatAudioId,
  setPlayingChatAudioId,
  subscribeChatAudioPlayback,
} from "@/utils/chat/chatAudioPlayback";

type Props = {
  id: string;
  uri: string;
  durationMs?: number;
};

const NEAR_END_MS = 200;
/** Status positions this close to a pending seek target are considered settled. */
const SEEK_SETTLE_TOLERANCE_MS = 350;
/** Give up waiting for the seek to settle after this long (failed/slow seek). */
const SEEK_SETTLE_TIMEOUT_MS = 1_500;

export function ChatAudioMessage({ id, uri, durationMs }: Props) {
  const { colors } = useTheme();
  const soundRef = useRef<Audio.Sound | null>(null);
  const loadPromiseRef = useRef<Promise<Audio.Sound | null> | null>(null);
  const loadGenRef = useRef(0);
  const seekingRef = useRef(false);
  const pendingSeekRef = useRef<{ targetMs: number; at: number } | null>(null);
  const playingRef = useRef(false);
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
    loadGenRef.current += 1;
    loadPromiseRef.current = null;
    pendingSeekRef.current = null;
    const sound = soundRef.current;
    soundRef.current = null;
    playingRef.current = false;
    setPlaying(false);
    if (getPlayingChatAudioId() === id) setPlayingChatAudioId(null);
    if (!sound) return;
    try {
      await sound.unloadAsync();
    } catch {
      // ignore
    }
  }, [id]);

  const applyStatus = useCallback((status: Audio.AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    if (status.durationMillis) setLoadedDurationMs(status.durationMillis);
    if (status.didJustFinish) {
      pendingSeekRef.current = null;
      playingRef.current = false;
      setPlaying(false);
      setPositionMs(0);
      if (getPlayingChatAudioId() === id) setPlayingChatAudioId(null);
      void soundRef.current?.setPositionAsync(0).catch(() => {});
      return;
    }
    if (status.isPlaying && getPlayingChatAudioId() !== id) {
      playingRef.current = false;
      setPlaying(false);
      void soundRef.current?.pauseAsync().catch(() => {});
      return;
    }
    if (seekingRef.current) return;

    // After a seek, the player still reports a few stale pre-seek positions.
    // Hold the thumb at the target until playback catches up (or times out).
    const pending = pendingSeekRef.current;
    if (pending) {
      const position = status.positionMillis ?? 0;
      const settled = Math.abs(position - pending.targetMs) <= SEEK_SETTLE_TOLERANCE_MS;
      const expired = Date.now() - pending.at > SEEK_SETTLE_TIMEOUT_MS;
      if (!settled && !expired) return;
      pendingSeekRef.current = null;
    }

    setPositionMs(status.positionMillis ?? 0);
  }, [id]);

  const ensureSound = useCallback(async () => {
    const existing = soundRef.current;
    if (existing) {
      try {
        const status = await existing.getStatusAsync();
        if (status.isLoaded) return existing;
      } catch {
        // reload below
      }
      soundRef.current = null;
      await existing.unloadAsync().catch(() => {});
    }

    if (!loadPromiseRef.current) {
      const gen = loadGenRef.current;
      const requestedUri = uri;
      const promise = (async () => {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });
        const { sound } = await Audio.Sound.createAsync(
          { uri: requestedUri },
          { shouldPlay: false, progressUpdateIntervalMillis: 80 },
          applyStatus,
        );
        if (loadGenRef.current !== gen) {
          await sound.unloadAsync().catch(() => {});
          return null;
        }
        soundRef.current = sound;
        return sound;
      })();
      loadPromiseRef.current = promise;
      void promise.finally(() => {
        if (loadPromiseRef.current === promise) loadPromiseRef.current = null;
      });
    }

    return loadPromiseRef.current;
  }, [applyStatus, uri]);

  const pauseLocal = useCallback(async () => {
    playingRef.current = false;
    setPlaying(false);
    try {
      await soundRef.current?.pauseAsync();
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    return subscribeChatAudioPlayback((activeId) => {
      if (activeId === id) return;
      void pauseLocal();
    });
  }, [id, pauseLocal]);

  useEffect(() => {
    setPositionMs(0);
    positionMsRef.current = 0;
    pendingSeekRef.current = null;
    playingRef.current = false;
    setPlaying(false);
    setLoadedDurationMs(durationMs ?? 0);
    void ensureSound();
    return () => {
      void unload();
    };
  }, [ensureSound, unload, uri]);

  const seekTo = useCallback(
    async (nextMs: number) => {
      const duration = totalMsRef.current;
      const clamped = Math.max(0, Math.min(nextMs, duration || nextMs));
      pendingSeekRef.current = { targetMs: clamped, at: Date.now() };
      setPositionMs(clamped);
      try {
        const sound = await ensureSound();
        if (!sound) return;
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
      if (!sound) return;
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;

      if (status.isPlaying) {
        await sound.pauseAsync();
        playingRef.current = false;
        setPlaying(false);
        if (getPlayingChatAudioId() === id) setPlayingChatAudioId(null);
        return;
      }

      const duration = status.durationMillis ?? totalMsRef.current;
      const atEnd =
        duration > 0 && (status.positionMillis ?? 0) >= duration - NEAR_END_MS;
      if (atEnd || status.didJustFinish) {
        pendingSeekRef.current = { targetMs: 0, at: Date.now() };
        await sound.setPositionAsync(0);
        setPositionMs(0);
      }

      setPlayingChatAudioId(id);
      playingRef.current = true;
      setPlaying(true);
      await sound.playAsync();
    } catch {
      playingRef.current = false;
      setPlaying(false);
      await unload();
    }
  }, [ensureSound, id, unload]);

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
