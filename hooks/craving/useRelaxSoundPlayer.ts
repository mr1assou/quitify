import { Audio, type AVPlaybackSource, type AVPlaybackStatus } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";

export type RelaxSoundProgress = {
  positionMs: number;
  durationMs: number;
};

/** Looping ambient sound playback for the relax-sound tool. */
export function useRelaxSoundPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const activeIdRef = useRef<string | null>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<RelaxSoundProgress>({
    positionMs: 0,
    durationMs: 0,
  });

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    setProgress({
      positionMs: status.positionMillis ?? 0,
      durationMs: status.durationMillis ?? 0,
    });
    setIsPlaying(status.isPlaying);
  }, []);

  const unload = useCallback(async () => {
    const sound = soundRef.current;
    soundRef.current = null;
    activeIdRef.current = null;
    if (!sound) return;
    try {
      await sound.unloadAsync();
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    void Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    return () => {
      void unload();
    };
  }, [unload]);

  const resetProgress = useCallback(() => {
    setProgress({ positionMs: 0, durationMs: 0 });
    setIsPlaying(false);
  }, []);

  const stop = useCallback(async () => {
    await unload();
    setActiveId(null);
    resetProgress();
  }, [resetProgress, unload]);

  const loadAndPlay = useCallback(
    async (id: string, source: AVPlaybackSource) => {
      if (activeIdRef.current === id && soundRef.current) {
        try {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        } catch {
          // ignore
        }
        return;
      }

      setLoadingId(id);
      resetProgress();
      try {
        await unload();

        const { sound } = await Audio.Sound.createAsync(
          source,
          {
            isLooping: true,
            shouldPlay: true,
            volume: 1,
            progressUpdateIntervalMillis: 250,
          },
          onPlaybackStatusUpdate,
        );

        soundRef.current = sound;
        activeIdRef.current = id;
        setActiveId(id);
        setIsPlaying(true);
      } catch {
        activeIdRef.current = null;
        setActiveId(null);
        resetProgress();
      } finally {
        setLoadingId(null);
      }
    },
    [onPlaybackStatusUpdate, resetProgress, unload],
  );

  const togglePlayPause = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;

      if (status.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const seekTo = useCallback(
    async (positionMs: number) => {
      const sound = soundRef.current;
      if (!sound) return;

      const clamped = Math.max(
        0,
        Math.min(positionMs, progress.durationMs || positionMs),
      );
      try {
        await sound.setPositionAsync(clamped);
        setProgress((current) => ({ ...current, positionMs: clamped }));
      } catch {
        // ignore
      }
    },
    [progress.durationMs],
  );

  return {
    activeId,
    loadingId,
    isPlaying,
    progress,
    loadAndPlay,
    togglePlayPause,
    seekTo,
    stop,
  };
};
