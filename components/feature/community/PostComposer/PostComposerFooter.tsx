import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  canPost: boolean;
  onPost: () => void;
};

export function PostComposerFooter({ canPost, onPost }: Props) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-end border-t border-section px-5 py-4 dark:border-d-border">
      <Pressable
        onPress={onPost}
        disabled={!canPost}
        className="rounded-full px-6 py-2.5"
        style={[
          { opacity: canPost ? 1 : 0.45 },
          { backgroundColor: canPost ? colors.primary : colors.mutedForeground },
        ]}
      >
        <Text className="text-sm font-bold text-white">Post</Text>
      </Pressable>
    </View>
  );
}
