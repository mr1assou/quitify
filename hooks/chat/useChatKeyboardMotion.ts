import { useLayoutEffect } from "react";
import { Platform } from "react-native";
import {
  AndroidSoftInputModes,
  KeyboardController,
  useGenericKeyboardHandler,
} from "react-native-keyboard-controller";
import { useSharedValue } from "react-native-reanimated";

/**
 * Tracks keyboard height/progress on the UI thread without forcing Android
 * adjustResize (which relayouts the whole chat and feels laggy).
 */
export function useChatKeyboardMotion() {
  const height = useSharedValue(0);
  const progress = useSharedValue(0);

  useLayoutEffect(() => {
    if (Platform.OS !== "android") return;
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_NOTHING,
    );
    return () => KeyboardController.setDefaultMode();
  }, []);

  useGenericKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";
        height.value = e.height;
        progress.value = e.progress;
      },
      onMove: (e) => {
        "worklet";
        height.value = e.height;
        progress.value = e.progress;
      },
      onInteractive: (e) => {
        "worklet";
        height.value = e.height;
        progress.value = e.progress;
      },
      onEnd: (e) => {
        "worklet";
        height.value = e.height;
        progress.value = e.progress;
      },
    },
    [],
  );

  return { height, progress };
}
