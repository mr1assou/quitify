import { Text, View } from "react-native";

import { getPostTag, type PostTagId } from "@/constants/postTags";

type Props = {
  tagId: PostTagId;
  className?: string;
};

export function PostTagBadge({ tagId, className }: Props) {
  const tag = getPostTag(tagId);

  return (
    <View
      className={`self-start rounded-full px-4 py-1.5 ${className ?? ""}`}
      style={{ backgroundColor: tag.backgroundColor }}
    >
      <Text className="text-xs font-semibold" style={{ color: tag.textColor }}>
        {tag.label}
      </Text>
    </View>
  );
}
