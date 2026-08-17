import {
  Audio,
  InterruptionModeAndroid,
  InterruptionModeIOS,
  type AVPlaybackSource,
  type AVPlaybackStatus,
} from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";

export type RelaxSoundProgress = {
  positionMs: number;
  durationMs: number;
};

/** Looping ambient sound playback for the relax-sound tool. */
export function useRelaxSoundPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const pendingIdRef = useRef<string | null>(null);
  const pendingPromiseRef = useRef<Promise<void> | null>(null);
  const genRef = useRef(0);

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
    genRef.current += 1;
    pendingIdRef.current = null;
    pendingPromiseRef.current = null;
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
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });

    return () => {
      void unload();
    };
  }, [unload]);

  const resetProgress = useCallback(() => {
    setProgress({ positionMs: 0, durationMs: 0 });
    setIsPlaying(false);
  }, []);

  const playLoaded = useCallback(async (id: string) => {
    const sound = soundRef.current;
    if (!sound) return false;
    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return false;
      if (!status.isPlaying) await sound.playAsync();
      activeIdRef.current = id;
      setActiveId(id);
      setIsPlaying(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const loadSound = useCallback(
    async (id: string, source: AVPlaybackSource, shouldPlay: boolean) => {
      if (activeIdRef.current === id && soundRef.current) {
        if (shouldPlay) await playLoaded(id);
        return;
      }

      if (pendingIdRef.current === id && pendingPromiseRef.current) {
        await pendingPromiseRef.current;
        if (shouldPlay) await playLoaded(id);
        return;
      }

      const gen = ++genRef.current;
      pendingIdRef.current = id;
      if (shouldPlay) {
        setLoadingId(id);
        if (activeIdRef.current !== id) resetProgress();
      }

      const run = (async () => {
        const previous = soundRef.current;
        soundRef.current = null;
        if (previous) {
          void previous
            .stopAsync()
            .catch(() => {})
            .then(() => previous.unloadAsync().catch(() => {}));
        }

        const { sound } = await Audio.Sound.createAsync(
          source,
          {
            isLooping: true,
            shouldPlay,
            volume: 1,
            progressUpdateIntervalMillis: 250,
          },
          onPlaybackStatusUpdate,
          false,
        );

        if (gen !== genRef.current) {
          await sound.unloadAsync().catch(() => {});
          return;
        }

        soundRef.current = sound;
        activeIdRef.current = id;
        if (shouldPlay) {
          setActiveId(id);
          setIsPlaying(true);
        }
      })();

      pendingPromiseRef.current = run;
      try {
        await run;
      } catch {
        if (gen === genRef.current) {
          activeIdRef.current = null;
          setActiveId(null);
          resetProgress();
        }
      } finally {
        if (gen === genRef.current) {
          pendingIdRef.current = null;
          pendingPromiseRef.current = null;
          setLoadingId(null);
        }
      }
    },
    [onPlaybackStatusUpdate, playLoaded, resetProgress],
  );

  const loadAndPlay = useCallback(
    async (id: string, source: AVPlaybackSource) => {
      await loadSound(id, source, true);
    },
    [loadSound],
  );

  const preload = useCallback(
    async (id: string, source: AVPlaybackSource) => {
      if (soundRef.current || pendingIdRef.current) return;
      await loadSound(id, source, false);
    },
    [loadSound],
  );

  const stop = useCallback(async () => {
    await unload();
    setActiveId(null);
    setLoadingId(null);
    resetProgress();
  }, [resetProgress, unload]);

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
    preload,
    togglePlayPause,
    seekTo,
    stop,
  };
}
