import { Text, View } from "react-native";

type Props = {
  title?: string;
  text?: string;
  className?: string;
};

export function PostTextContent({ title, text, className }: Props) {
  if (!title && !text) return null;

  return (
    <View className={className}>
      {title ? (
        <Text className="text-lg font-bold leading-7 text-foreground dark:text-d-text">
          {title}
        </Text>
      ) : null}
      {text ? (
        <Text
          className={`text-base leading-6 text-foreground dark:text-d-text${title ? " mt-2" : ""}`}
        >
          {text}
        </Text>
      ) : null}
    </View>
  );
}
