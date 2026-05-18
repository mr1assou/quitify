import { Text } from "react-native";

type Props = {
  authorName: string;
  text: string;
};

/** Single-line inline comment preview shown under a post card. */
export function CommentPreview({ authorName, text }: Props) {
  return (
    <Text
      numberOfLines={2}
      className="text-sm text-foreground dark:text-d-text"
    >
      <Text className="font-bold">{authorName}</Text>
      <Text>  {text}</Text>
    </Text>
  );
}
