import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  canPost: boolean;
  isPosting?: boolean;
  onPost: () => void;
  submitLabel?: string;
};

export function PostComposerFooter({
  canPost,
  isPosting = false,
  onPost,
  submitLabel = "Post",
}: Props) {
  const { colors } = useTheme();
  const enabled = canPost && !isPosting;

  return (
    <View className="flex-row items-center justify-end border-t border-section px-5 py-4 dark:border-d-border">
      <Pressable
        onPress={onPost}
        disabled={!enabled}
        className="rounded-full px-6 py-2.5"
        style={[
          { opacity: enabled ? 1 : 0.45 },
          { backgroundColor: enabled ? colors.primary : colors.mutedForeground },
        ]}
      >
        {isPosting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text className="text-sm font-bold text-white">{submitLabel}</Text>
        )}
      </Pressable>
    </View>
  );
}
