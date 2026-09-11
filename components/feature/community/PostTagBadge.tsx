import { Text, View } from "react-native";

import { getPostTag, type PostTagId } from "@/constants/community/postTags";

type Props = {
  tagId: PostTagId;
  className?: string;
};

export function PostTagBadge({ tagId, className }: Props) {
  const tag = getPostTag(tagId);

  return (
    <View
      className={`rounded-full px-4 py-1.5 ${className ?? ""}`}
      style={{
        alignSelf: "flex-start",
        flexShrink: 0,
        backgroundColor: tag.backgroundColor,
      }}
    >
      <Text
        numberOfLines={1}
        className="text-xs font-semibold"
        style={{ color: tag.textColor, flexShrink: 0 }}
      >
        {tag.label}
      </Text>
    </View>
  );
}
