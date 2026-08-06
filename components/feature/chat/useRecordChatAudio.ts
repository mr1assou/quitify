import { Audio } from "expo-av";
import { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";

import { useTranslation } from "@/hooks/i18n/useTranslation";

import type { ChatMediaPick } from "./usePickChatMedia";

export function useRecordChatAudio() {
  const { t } = useTranslation();
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = useCallback(async (): Promise<boolean> => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(t("chat.permissionNeeded"), t("chat.micPermission"));
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = recording;
      setIsRecording(true);
      return true;
    } catch {
      Alert.alert(t("chat.recordingFailed"), t("chat.recordingFailedHint"));
      return false;
    }
  }, [t]);

  const stopRecording = useCallback(async (): Promise<ChatMediaPick | null> => {
    const recording = recordingRef.current;
    if (!recording) return null;

    setIsRecording(false);
    recordingRef.current = null;

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      const uri = recording.getURI();
      if (!uri) return null;

      const status = await recording.getStatusAsync();
      const durationMs = status.durationMillis ?? 0;
      if (durationMs < 500) return null;

      return {
        uri,
        kind: "audio",
        mimeType: "audio/mp4",
        durationMs,
      };
    } catch {
      return null;
    }
  }, []);

  const cancelRecording = useCallback(async () => {
    const recording = recordingRef.current;
    if (!recording) return;

    setIsRecording(false);
    recordingRef.current = null;

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    } catch {
      // ignore cleanup errors
    }
  }, []);

  return { isRecording, startRecording, stopRecording, cancelRecording };
}
