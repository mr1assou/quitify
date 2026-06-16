import { Pressable, Text, View } from "react-native";

import type { PostTag, PostTagId } from "@/constants/community/postTags";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  tag: PostTag;
  selected: boolean;
  onSelect: (id: PostTagId) => void;
};

export function PostTagOption({ tag, selected, onSelect }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onSelect(tag.id)}
      className="mb-3 flex-row items-center"
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View
        className="mr-3 h-5 w-5 items-center justify-center rounded-full border-2"
        style={{ borderColor: selected ? colors.primary : colors.mutedForeground }}
      >
        {selected ? (
          <View
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
        ) : null}
      </View>
      <View
        className="min-w-0 flex-1 rounded-full px-5 py-2.5"
        style={{ backgroundColor: tag.backgroundColor }}
      >
        <Text className="text-center text-sm font-semibold" style={{ color: tag.textColor }}>
          {tag.label}
        </Text>
      </View>
    </Pressable>
  );
}
