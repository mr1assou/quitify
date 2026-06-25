import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { safeRouter } from "@/utils/app/safeRouter";

type Props = {
  postId: string;
  previewText: string;
};

export function SharedPostMessageCard({ postId, previewText }: Props) {
  const { colors } = useTheme();

  const openPost = () => {
    safeRouter.push({ pathname: "/post/[id]", params: { id: postId } });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open shared community post"
      onPress={openPost}
      className="active:opacity-80"
    >
      <View className="overflow-hidden rounded-2xl border border-border bg-background dark:border-d-border dark:bg-d-elevated">
        <View className="flex-row items-center gap-2 border-b border-border px-3 py-2 dark:border-d-border">
          <Ionicons name="newspaper-outline" size={16} color={colors.primary} />
          <Text className="text-xs font-semibold uppercase tracking-wide text-primary">
            Community post
          </Text>
        </View>

        {previewText ? (
          <Text
            className="px-3 pt-2.5 text-sm leading-5 text-foreground dark:text-d-text"
            numberOfLines={4}
          >
            {previewText}
          </Text>
        ) : null}

        <View className="flex-row items-center px-3 py-2.5">
          <Text className="text-sm font-semibold text-primary">View post</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} style={{ marginLeft: 2 }} />
        </View>
      </View>
    </Pressable>
  );
}
