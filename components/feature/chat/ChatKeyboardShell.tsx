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
 * Slides the thread + composer with the keyboard (UI thread).
 * The window does not resize, so bubbles stay put like WhatsApp / Instagram.
 */
export function ChatKeyboardShell({ children }: Props) {
  const { height, progress } = useChatKeyboardMotion();
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -height.value }],
  }));

  return (
    <ChatKeyboardProgressContext.Provider value={progress}>
      <View style={styles.clip}>
        <Animated.View style={[styles.body, bodyStyle]}>{children}</Animated.View>
      </View>
    </ChatKeyboardProgressContext.Provider>
  );
}

const styles = StyleSheet.create({
  clip: {
    flex: 1,
    overflow: "hidden",
  },
  body: {
    flex: 1,
  },
});
