import { View } from "react-native";

import { LinkifiedText } from "@/components/ui/LinkifiedText";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  title?: string;
  text?: string;
  className?: string;
};

export function PostTextContent({ title, text, className }: Props) {
  const { colors } = useTheme();

  if (!title && !text) return null;

  const titleStyle = {
    fontSize: 20,
    fontWeight: "800" as const,
    lineHeight: 26,
    color: colors.foreground,
  };

  const bodyStyle = {
    fontSize: 14,
    lineHeight: 20,
    color: colors.foreground,
  };

  return (
    <View className={className}>
      {title ? <LinkifiedText style={titleStyle}>{title}</LinkifiedText> : null}
      {text ? (
        <LinkifiedText style={[bodyStyle, title ? { marginTop: 8 } : null]}>
          {text}
        </LinkifiedText>
      ) : null}
    </View>
  );
}
