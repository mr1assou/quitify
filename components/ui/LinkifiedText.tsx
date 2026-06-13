import { useMemo } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
} from "react-native";

import {
  linkTextStyle,
  normalizeUrl,
  splitTextByUrls,
} from "@/utils/text/linkifyText";

type Props = TextProps & {
  children: string;
  linkStyle?: TextStyle;
};

export function LinkifiedText({ children, style, linkStyle, ...rest }: Props) {
  const segments = useMemo(() => splitTextByUrls(children), [children]);
  const flatStyle = StyleSheet.flatten(style) as TextStyle | undefined;
  const { color: _bodyColor, ...typography } = flatStyle ?? {};

  return (
    <Text style={style} {...rest}>
      {segments.map((segment, index) => {
        if (segment.type === "url") {
          return (
            <Text
              key={`url-${index}`}
              style={[typography, linkTextStyle(), linkStyle]}
              onPress={() => void Linking.openURL(normalizeUrl(segment.value))}
            >
              {segment.value}
            </Text>
          );
        }

        if (!segment.value) return null;

        return (
          <Text key={`text-${index}`} style={flatStyle}>
            {segment.value}
          </Text>
        );
      })}
    </Text>
  );
}
