import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  Text,
  View,
  type NativeSyntheticEvent,
  type TextLayoutEventData,
} from "react-native";

import { LinkifiedText } from "@/components/ui/LinkifiedText";
import { useTheme } from "@/context/ThemeContext";

/** Collapsed body line count in the feed and post detail. */
const BODY_COLLAPSED_LINES = 4;

type Props = {
  title?: string;
  text?: string;
  className?: string;
};

export function PostTextContent({ title, text, className }: Props) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    setExpanded(false);
    setCanExpand(false);
  }, [text]);

  const handleBodyLayout = useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (expanded) return;
      setCanExpand(event.nativeEvent.lines.length >= BODY_COLLAPSED_LINES);
    },
    [expanded],
  );

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

  const showToggle = Boolean(text && canExpand);

  return (
    <View className={className}>
      {title ? <LinkifiedText style={titleStyle}>{title}</LinkifiedText> : null}
      {text ? (
        <View style={title ? { marginTop: 8 } : undefined}>
          <LinkifiedText
            style={bodyStyle}
            numberOfLines={expanded ? undefined : BODY_COLLAPSED_LINES}
            onTextLayout={handleBodyLayout}
          >
            {text}
          </LinkifiedText>

          {showToggle ? (
            <Pressable
              onPress={() => setExpanded((current) => !current)}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={expanded ? "See less" : "See more"}
              className="mt-1 self-start"
            >
              <Text className="text-sm font-semibold text-primary">
                {expanded ? "See less" : "See more"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
