import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

import { getPostTag, type PostTagId } from "@/constants/community/postTags";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  selectedTagId: PostTagId | null;
  onPress: () => void;
  onClear: () => void;
};

export function PostTagsChip({ selectedTagId, onPress, onClear }: Props) {
  const { colors } = useTheme();

  if (selectedTagId) {
    const tag = getPostTag(selectedTagId);
    return (
      <Pressable
        onPress={onPress}
        className="mx-5 mt-3 self-start flex-row items-center rounded-full px-4 py-2"
        style={{ backgroundColor: tag.backgroundColor }}
      >
        <Text className="text-sm font-semibold" style={{ color: tag.textColor }}>
          {tag.label}
        </Text>
        <Pressable onPress={onClear} hitSlop={8} className="ml-2">
          <Ionicons name="close" size={14} color={tag.textColor} />
        </Pressable>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className="mx-5 mt-3 self-start flex-row items-center rounded-full border border-section px-4 py-2 dark:border-d-border"
    >
      <Ionicons name="add" size={16} color={colors.mutedForeground} />
      <Text className="ml-1.5 text-sm font-semibold" style={{ color: colors.mutedForeground }}>
        Choose a tag *
      </Text>
    </Pressable>
  );
}
