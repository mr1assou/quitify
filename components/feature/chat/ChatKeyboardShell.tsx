import { createContext, useContext, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

import { useChatKeyboardMotion } from "@/hooks/chat/useChatKeyboardMotion";

const ChatKeyboardProgressContext = createContext<SharedValue<number> | null>(
  null,
);

export function useChatComposerKeyboardProgress(): SharedValue<number> {
  const fromChat = useContext(ChatKeyboardProgressContext);
  const fallback = useSharedValue(0);
  return fromChat ?? fallback;
}

type Props = {
  children: ReactNode;
};

/**
 * WhatsApp-style: list stays in place, a spacer grows under the composer so
 * only the input (and the list viewport) move with the keyboard on the UI thread.
 */
export function ChatKeyboardShell({ children }: Props) {
  const { height, progress } = useChatKeyboardMotion();
  const spacerStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <ChatKeyboardProgressContext.Provider value={progress}>
      <View style={styles.root}>
        {children}
        <Animated.View pointerEvents="none" style={spacerStyle} />
      </View>
    </ChatKeyboardProgressContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
