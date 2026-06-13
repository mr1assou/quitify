import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type TextStyle,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { LINK_TEXT_COLOR } from "@/utils/text/linkifyText";

import { LinkifiedText } from "./LinkifiedText";

type Props = TextInputProps & {
  value: string;
  overlayStyle?: TextStyle;
};

export function LinkifiedTextInput({
  value,
  style,
  overlayStyle,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const mergedStyle = StyleSheet.flatten([style, overlayStyle]) as TextStyle;
  const hasContent = value.length > 0;
  const displayStyle: TextStyle = {
    ...mergedStyle,
    color: mergedStyle.color ?? colors.foreground,
  };

  return (
    <View style={{ position: "relative" }}>
      {hasContent ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            zIndex: 1,
            minHeight: mergedStyle.height,
          }}
        >
          <LinkifiedText style={displayStyle}>{value}</LinkifiedText>
        </View>
      ) : null}

      <TextInput
        {...rest}
        value={value}
        style={[
          mergedStyle,
          hasContent ? { color: "transparent" } : { color: colors.foreground },
        ]}
        selectionColor={LINK_TEXT_COLOR}
        cursorColor={colors.foreground}
        underlineColorAndroid="transparent"
      />
    </View>
  );
}
